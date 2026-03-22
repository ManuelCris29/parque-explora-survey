import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

// Common CORS headers
const getCorsHeaders = () => ({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
});

// Handle CORS preflight
const handleCorsPreflight = (headers) => {
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'CORS preflight' })
    };
};

const normalizeComment = (text = '') =>
    text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

const countByRoom = (roomIds = []) => {
    const counter = {};
    roomIds.forEach((roomId) => {
        counter[roomId] = (counter[roomId] || 0) + 1;
    });
    return counter;
};

const mapToInsightItems = (counter, rooms, includeZero = false) => {
    const roomNameById = (rooms || []).reduce((acc, room) => {
        acc[room.roomId] = room.nombre;
        return acc;
    }, {});

    if (includeZero) {
        return (rooms || []).map((room) => ({
            roomId: room.roomId,
            roomName: room.nombre,
            count: counter[room.roomId] || 0
        }));
    }

    return Object.entries(counter).map(([roomId, count]) => ({
        roomId,
        roomName: roomNameById[roomId] || roomId,
        count
    }));
};

const buildHeuristicInsights = (surveys, rooms) => {
    const completedSurveys = (surveys || []).filter((survey) => survey.estado === 'completed');

    if (completedSurveys.length === 0) {
        return {
            mostVisited: [],
            leastVisited: [],
            mostRequestedRenovation: [],
            averageRating: 0,
            happinessLevel: 'Sin datos',
            commentSentimentScore: 0,
            totalCompletedSurveys: 0,
            aiFindings: ['Aún no hay encuestas completadas para generar insights automáticos.']
        };
    }

    const allVisitedRooms = completedSurveys.flatMap((survey) => survey.salasVisitadas || []);
    const allRenovationRooms = completedSurveys.flatMap((survey) => survey.salasParaRenovar || []);

    const visitedCounter = countByRoom(allVisitedRooms);
    const renovationCounter = countByRoom(allRenovationRooms);

    const visitedItems = mapToInsightItems(visitedCounter, rooms, true).sort((a, b) => b.count - a.count);
    const mostVisited = visitedItems.filter((item) => item.count > 0).slice(0, 3);
    const leastVisited = visitedItems.filter((item) => item.count >= 0).sort((a, b) => a.count - b.count).slice(0, 3);

    const mostRequestedRenovation = mapToInsightItems(renovationCounter, rooms)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    const ratings = completedSurveys
        .map((survey) => survey.calificacionGeneral)
        .filter((rating) => typeof rating === 'number');

    const averageRating = ratings.length
        ? ratings.reduce((acc, current) => acc + current, 0) / ratings.length
        : 0;

    const positiveWords = [
        'excelente', 'genial', 'increible', 'increíble', 'maravilloso', 'recomendado', 'encanto', 'gusto',
        'feliz', 'agradable', 'divertido', 'bueno', 'espectacular', 'fantastico', 'fantástico'
    ];
    const negativeWords = [
        'malo', 'regular', 'aburrido', 'lento', 'fila', 'espera', 'calor', 'frio', 'frío', 'danado', 'dañado',
        'sucio', 'costoso', 'caro', 'mejorar', 'renovar', 'daño', 'fallo', 'fallas'
    ];

    let sentimentScore = 0;
    completedSurveys.forEach((survey) => {
        if (typeof survey.calificacionGeneral === 'number') {
            sentimentScore += (survey.calificacionGeneral - 3) * 0.9;
        }

        const normalized = normalizeComment(survey.comentarios || '');
        positiveWords.forEach((word) => {
            if (normalized.includes(word)) {
                sentimentScore += 0.5;
            }
        });
        negativeWords.forEach((word) => {
            if (normalized.includes(word)) {
                sentimentScore -= 0.5;
            }
        });
    });

    const commentSentimentScore = Math.round((sentimentScore / completedSurveys.length) * 100) / 100;

    let happinessLevel = 'Media';
    if (averageRating >= 4.2 && commentSentimentScore >= 0.5) {
        happinessLevel = 'Alta';
    } else if (averageRating < 3.3 || commentSentimentScore < 0) {
        happinessLevel = 'Baja';
    }

    const aiFindings = [];
    if (mostVisited.length > 0) {
        aiFindings.push(`La sala más visitada es ${mostVisited[0].roomName} con ${mostVisited[0].count} visitas registradas.`);
    }
    if (mostRequestedRenovation.length > 0) {
        aiFindings.push(`La mayor prioridad de mejora es ${mostRequestedRenovation[0].roomName}, sugerida ${mostRequestedRenovation[0].count} veces para renovación.`);
    }
    if (averageRating >= 4) {
        aiFindings.push('La satisfacción general es positiva; conviene reforzar las fortalezas actuales en salas mejor valoradas.');
    } else {
        aiFindings.push('La satisfacción general requiere intervención; se recomienda priorizar acciones sobre salas con más solicitudes de cambio.');
    }

    return {
        mostVisited,
        leastVisited,
        mostRequestedRenovation,
        averageRating: Math.round(averageRating * 10) / 10,
        happinessLevel,
        commentSentimentScore,
        totalCompletedSurveys: completedSurveys.length,
        aiFindings
    };
};

const normalizeSentimentScore = (value, fallback) => {
    if (typeof value !== 'number' || Number.isNaN(value)) {
        return fallback;
    }
    const clamped = Math.max(-2, Math.min(2, value));
    return Math.round(clamped * 100) / 100;
};

const resolveHappinessLevel = (averageRating, sentimentScore, openAiLevel, fallbackLevel) => {
    if (['Alta', 'Media', 'Baja'].includes(openAiLevel)) {
        return openAiLevel;
    }

    if (averageRating >= 4.2 && sentimentScore >= 0.5) {
        return 'Alta';
    }

    if (averageRating < 3.3 || sentimentScore < 0) {
        return 'Baja';
    }

    return fallbackLevel || 'Media';
};

const enrichInsightsWithOpenAI = async (heuristicInsights, surveys) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return {
            provider: 'heuristic',
            data: heuristicInsights
        };
    }

    const completedSurveys = (surveys || []).filter((survey) => survey.estado === 'completed');
    const comments = completedSurveys
        .map((survey) => ({
            comentario: survey.comentarios || '',
            estrellas: survey.calificacionGeneral || null
        }))
        .filter((item) => item.comentario || item.estrellas !== null);

    if (comments.length === 0) {
        return {
            provider: 'heuristic',
            data: heuristicInsights
        };
    }

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const prompt = {
        totalCompletedSurveys: heuristicInsights.totalCompletedSurveys,
        averageRating: heuristicInsights.averageRating,
        topMostVisited: heuristicInsights.mostVisited,
        topRenovationRequests: heuristicInsights.mostRequestedRenovation,
        comments
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                response_format: { type: 'json_object' },
                temperature: 0,
                messages: [
                    {
                        role: 'system',
                        content: 'Eres un analista de experiencia de visitantes. Devuelve SOLO JSON con: commentSentimentScore (numero entre -2 y 2), happinessLevel (Alta|Media|Baja), aiFindings (array de 3 insights accionables en español). No incluyas otros campos.'
                    },
                    {
                        role: 'user',
                        content: `Analiza los datos y genera insights. Datos: ${JSON.stringify(prompt)}`
                    }
                ]
            })
        });

        if (!response.ok) {
            return {
                provider: 'heuristic',
                data: heuristicInsights
            };
        }

        const payload = await response.json();
        const content = payload?.choices?.[0]?.message?.content;
        if (!content) {
            return {
                provider: 'heuristic',
                data: heuristicInsights
            };
        }

        const parsed = JSON.parse(content);

        const aiSentiment = normalizeSentimentScore(parsed.commentSentimentScore, heuristicInsights.commentSentimentScore);
        const aiHappinessLevel = resolveHappinessLevel(
            heuristicInsights.averageRating,
            aiSentiment,
            parsed.happinessLevel,
            heuristicInsights.happinessLevel
        );

        const merged = {
            ...heuristicInsights,
            commentSentimentScore: aiSentiment,
            happinessLevel: aiHappinessLevel,
            aiFindings: Array.isArray(parsed.aiFindings) && parsed.aiFindings.length > 0
                ? parsed.aiFindings.slice(0, 4)
                : heuristicInsights.aiFindings
        };

        return {
            provider: 'openai',
            data: merged
        };
    } catch (error) {
        console.error('OpenAI insight error:', error);
        return {
            provider: 'heuristic',
            data: heuristicInsights
        };
    }
};

const getAiInsights = async () => {
    try {
        const [surveysResult, roomsResult] = await Promise.all([
            dynamodb.send(new ScanCommand({ TableName: process.env.SURVEYS_TABLE })),
            dynamodb.send(new ScanCommand({ TableName: process.env.ROOMS_TABLE }))
        ]);

        const surveys = surveysResult.Items || [];
        const rooms = roomsResult.Items || [];

        const heuristic = buildHeuristicInsights(surveys, rooms);
        const enriched = await enrichInsightsWithOpenAI(heuristic, surveys);

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                success: true,
                provider: enriched.provider,
                data: enriched.data
            })
        };
    } catch (error) {
        console.error('Error getting AI insights:', error);
        return {
            statusCode: 500,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                error: 'Error interno del servidor',
                message: error.message
            })
        };
    }
};

// Create survey
const createSurvey = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const { cedula } = body;
        
        if (!cedula) {
            return {
                statusCode: 400,
                headers: getCorsHeaders(),
                body: JSON.stringify({ 
                    error: 'Cédula es requerida' 
                })
            };
        }

        // Verify if user exists
        const userCommand = new GetCommand({
            TableName: process.env.USERS_TABLE,
            Key: { cedula }
        });

        const userResult = await dynamodb.send(userCommand);
        
        if (!userResult.Item) {
            return {
                statusCode: 404,
                headers: getCorsHeaders(),
                body: JSON.stringify({ 
                    error: 'Usuario no encontrado. Debe registrarse primero.' 
                })
            };
        }

        // Check if survey already exists for this user
        const existingSurveyCommand = new QueryCommand({
            TableName: process.env.SURVEYS_TABLE,
            IndexName: 'CedulaIndex',
            KeyConditionExpression: 'cedula = :cedula',
            ExpressionAttributeValues: {
                ':cedula': cedula
            }
        });

        const existingSurvey = await dynamodb.send(existingSurveyCommand);
        
        if (existingSurvey.Items && existingSurvey.Items.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            const lastSurvey = existingSurvey.Items[0];
            const lastSurveyDate = lastSurvey.fechaActualizacion.split('T')[0];
            
            // If last survey was completed today, don't allow another
            if (lastSurvey.estado === 'completed' && lastSurveyDate === today) {
                return {
                    statusCode: 409,
                    headers: getCorsHeaders(),
                    body: JSON.stringify({ 
                        error: 'Ya completaste la encuesta hoy. Solo puedes completar una encuesta por día.',
                        surveyId: lastSurvey.surveyId,
                        completedToday: true
                    })
                };
            }
            
            // If there's a pending survey, don't create another
            if (lastSurvey.estado === 'pending' || lastSurvey.estado === 'in_progress') {
                return {
                    statusCode: 409,
                    headers: getCorsHeaders(),
                    body: JSON.stringify({ 
                        error: 'Ya existe una encuesta para este usuario',
                        surveyId: lastSurvey.surveyId
                    })
                };
            }
        }

        // Create new survey
        const surveyData = {
            surveyId: uuidv4(),
            cedula,
            estado: 'pending',
            salasVisitadas: [],
            salasFavoritas: [],
            salasParaRenovar: [],
            calificacionGeneral: null,
            comentarios: '',
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
        };

        // Save survey to DynamoDB
        const surveyCommand = new PutCommand({
            TableName: process.env.SURVEYS_TABLE,
            Item: surveyData
        });

        await dynamodb.send(surveyCommand);

        return {
            statusCode: 201,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                message: 'Encuesta creada exitosamente',
                data: surveyData
            })
        };

    } catch (error) {
        console.error('Error creating survey:', error);
        return {
            statusCode: 500,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                error: 'Error interno del servidor',
                message: error.message
            })
        };
    }
};

// Get survey by cedula
const getSurveyByUser = async (event) => {
    try {
        const cedula = event.pathParameters?.cedula;
        
        if (!cedula) {
            return {
                statusCode: 400,
                headers: getCorsHeaders(),
                body: JSON.stringify({ 
                    error: 'Cédula es requerida' 
                })
            };
        }

        // Search survey in DynamoDB using index
        const command = new QueryCommand({
            TableName: process.env.SURVEYS_TABLE,
            IndexName: 'CedulaIndex',
            KeyConditionExpression: 'cedula = :cedula',
            ExpressionAttributeValues: {
                ':cedula': cedula
            }
        });

        const result = await dynamodb.send(command);

        if (!result.Items || result.Items.length === 0) {
            return {
                statusCode: 404,
                headers: getCorsHeaders(),
                body: JSON.stringify({ 
                    error: 'Encuesta no encontrada para este usuario',
                    cedula: cedula
                })
            };
        }

        // Get user data as well
        const userCommand = new GetCommand({
            TableName: process.env.USERS_TABLE,
            Key: { cedula }
        });

        const userResult = await dynamodb.send(userCommand);

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                message: 'Encuesta encontrada',
                data: {
                    survey: result.Items[0],
                    user: userResult.Item
                }
            })
        };

    } catch (error) {
        console.error('Error getting survey:', error);
        return {
            statusCode: 500,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                error: 'Error interno del servidor',
                message: error.message
            })
        };
    }
};

// Get survey by surveyId
const getSurveyById = async (event) => {
    try {
        const surveyId = event.pathParameters?.surveyId;
        
        if (!surveyId) {
            return {
                statusCode: 400,
                headers: getCorsHeaders(),
                body: JSON.stringify({ 
                    error: 'Survey ID es requerido' 
                })
            };
        }

        const command = new GetCommand({
            TableName: process.env.SURVEYS_TABLE,
            Key: { surveyId }
        });

        const result = await dynamodb.send(command);

        if (!result.Item) {
            return {
                statusCode: 404,
                headers: getCorsHeaders(),
                body: JSON.stringify({ 
                    error: 'Encuesta no encontrada' 
                })
            };
        }

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                message: 'Encuesta encontrada',
                data: result.Item
            })
        };

    } catch (error) {
        console.error('Error getting survey by ID:', error);
        return {
            statusCode: 500,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                error: 'Error interno del servidor',
                message: error.message
            })
        };
    }
};

// Update survey
const updateSurvey = async (event) => {
    try {
        const surveyId = event.pathParameters?.surveyId;
        
        if (!surveyId) {
            return {
                statusCode: 400,
                headers: getCorsHeaders(),
                body: JSON.stringify({ 
                    error: 'Survey ID es requerido' 
                })
            };
        }

        const body = JSON.parse(event.body || '{}');
        
        // Allowed fields for update
        const allowedFields = [
            'salasVisitadas',
            'salasFavoritas', 
            'salasParaRenovar',
            'calificacionGeneral',
            'comentarios',
            'estado'
        ];

        // Filter only allowed fields
        const updateData = {};
        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        });

        if (Object.keys(updateData).length === 0) {
            return {
                statusCode: 400,
                headers: getCorsHeaders(),
                body: JSON.stringify({ 
                    error: 'No hay datos válidos para actualizar' 
                })
            };
        }

        // Add update timestamp
        updateData.fechaActualizacion = new Date().toISOString();

        // Prepare update expression
        const updateExpression = 'SET ' + Object.keys(updateData).map(key => `${key} = :${key}`).join(', ');
        const expressionAttributeValues = {};
        Object.keys(updateData).forEach(key => {
            expressionAttributeValues[`:${key}`] = updateData[key];
        });

        // Update in DynamoDB
        const command = new UpdateCommand({
            TableName: process.env.SURVEYS_TABLE,
            Key: { surveyId },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        });

        const result = await dynamodb.send(command);

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                message: 'Encuesta actualizada exitosamente',
                data: result.Attributes
            })
        };

    } catch (error) {
        console.error('Error updating survey:', error);
        
        if (error.name === 'ConditionalCheckFailedException') {
            return {
                statusCode: 404,
                headers: getCorsHeaders(),
                body: JSON.stringify({
                    error: 'Encuesta no encontrada'
                })
            };
        }
        
        return {
            statusCode: 500,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                error: 'Error interno del servidor',
                message: error.message
            })
        };
    }
};

// Delete survey
const deleteSurvey = async (event) => {
    try {
        const surveyId = event.pathParameters?.surveyId;

        if (!surveyId) {
            return {
                statusCode: 400,
                headers: getCorsHeaders(),
                body: JSON.stringify({
                    error: 'Survey ID es requerido'
                })
            };
        }

        // Verify if survey exists
        const getCommand = new GetCommand({
            TableName: process.env.SURVEYS_TABLE,
            Key: { surveyId }
        });

        const surveyExists = await dynamodb.send(getCommand);

        if (!surveyExists.Item) {
            return {
                statusCode: 404,
                headers: getCorsHeaders(),
                body: JSON.stringify({
                    error: 'Encuesta no encontrada'
                })
            };
        }

        // Delete survey
        const deleteCommand = new DeleteCommand({
            TableName: process.env.SURVEYS_TABLE,
            Key: { surveyId }
        });

        await dynamodb.send(deleteCommand);

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                success: true,
                message: 'Encuesta eliminada exitosamente'
            })
        };

    } catch (error) {
        console.error('Error deleting survey:', error);
        return {
            statusCode: 500,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                error: 'Error interno del servidor',
                message: error.message
            })
        };
    }
};

// Get all surveys
const getAllSurveys = async (event) => {
    try {
        const command = new ScanCommand({
            TableName: process.env.SURVEYS_TABLE
        });

        const result = await dynamodb.send(command);

        // Enrich data with user information
        const surveysWithUsers = await Promise.all(
            (result.Items || []).map(async (survey) => {
                try {
                    const userCommand = new GetCommand({
                        TableName: process.env.USERS_TABLE,
                        Key: {
                            cedula: survey.cedula
                        }
                    });
                    const userResult = await dynamodb.send(userCommand);
                    return {
                        ...survey,
                        user: userResult.Item || null
                    };
                } catch (error) {
                    console.error('Error getting user data:', error);
                    return survey;
                }
            })
        );

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                success: true,
                surveys: surveysWithUsers,
                count: result.Count || 0
            })
        };

    } catch (error) {
        console.error('Error getting all surveys:', error);
        return {
            statusCode: 500,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                error: 'Error interno del servidor',
                message: error.message
            })
        };
    }
};

// Main handler - Router
export const handler = async (event) => {
    console.log('SurveyService - Method:', event.httpMethod, 'Path:', event.path);
    
    const headers = getCorsHeaders();
    
    // Route based on HTTP method and path
    switch (event.httpMethod) {
        case 'OPTIONS':
            return handleCorsPreflight(headers);
            
        case 'GET':
            if (event.path === '/surveys') {
                return getAllSurveys(event);
            } else if (event.path === '/surveys/insights/ai') {
                return getAiInsights();
            } else if (event.path.includes('/surveys/user/')) {
                return getSurveyByUser(event);
            } else if (event.pathParameters?.surveyId) {
                return getSurveyById(event);
            }
            break;
            
        case 'POST':
            if (event.path === '/surveys') {
                return createSurvey(event);
            }
            break;
            
        case 'PUT':
            if (event.pathParameters?.surveyId) {
                return updateSurvey(event);
            }
            break;
            
        case 'DELETE':
            if (event.pathParameters?.surveyId) {
                return deleteSurvey(event);
            }
            break;
    }
    
    // If no route matches, return method not allowed
    return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
            error: 'Endpoint no encontrado',
            method: event.httpMethod,
            path: event.path
        })
    };
};

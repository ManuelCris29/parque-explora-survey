const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
    };

    try {
        // Verificar método HTTP
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ message: 'CORS preflight' })
            };
        }

        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Método no permitido' })
            };
        }

        // Parsear el body
        const body = JSON.parse(event.body || '{}');
        
        // Validar datos requeridos
        const { cedula } = body;
        
        if (!cedula) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Cédula es requerida' 
                })
            };
        }

        // Verificar si el usuario existe
        const userParams = {
            TableName: process.env.USERS_TABLE,
            Key: { cedula }
        };

        const userResult = await dynamodb.get(userParams).promise();
        
        if (!userResult.Item) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ 
                    error: 'Usuario no encontrado. Debe registrarse primero.' 
                })
            };
        }

        // Verificar si ya existe una encuesta para este usuario
        const existingSurveyParams = {
            TableName: process.env.SURVEYS_TABLE,
            IndexName: 'CedulaIndex',
            KeyConditionExpression: 'cedula = :cedula',
            ExpressionAttributeValues: {
                ':cedula': cedula
            }
        };

        const existingSurvey = await dynamodb.query(existingSurveyParams).promise();
        
        if (existingSurvey.Items && existingSurvey.Items.length > 0) {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const lastSurvey = existingSurvey.Items[0];
            const lastSurveyDate = lastSurvey.fechaActualizacion.split('T')[0];
            
            // Si la última encuesta fue completada hoy, no permitir crear otra
            if (lastSurvey.estado === 'completed' && lastSurveyDate === today) {
                return {
                    statusCode: 409,
                    headers,
                    body: JSON.stringify({ 
                        error: 'Ya completaste la encuesta hoy. Solo puedes completar una encuesta por día.',
                        surveyId: lastSurvey.surveyId,
                        completedToday: true
                    })
                };
            }
            
            // Si existe una encuesta pendiente, no crear otra
            if (lastSurvey.estado === 'pending' || lastSurvey.estado === 'in_progress') {
                return {
                    statusCode: 409,
                    headers,
                    body: JSON.stringify({ 
                        error: 'Ya existe una encuesta para este usuario',
                        surveyId: lastSurvey.surveyId
                    })
                };
            }
        }

        // Crear nueva encuesta
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

        // Guardar encuesta en DynamoDB
        const surveyParams = {
            TableName: process.env.SURVEYS_TABLE,
            Item: surveyData
        };

        await dynamodb.put(surveyParams).promise();

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                message: 'Encuesta creada exitosamente',
                data: surveyData
            })
        };

    } catch (error) {
        console.error('Error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Error interno del servidor',
                message: error.message
            })
        };
    }
};

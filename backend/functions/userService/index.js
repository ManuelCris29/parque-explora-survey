import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
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

// Validate HTTP method
const validateMethod = (event, allowedMethods) => {
    if (event.httpMethod === 'OPTIONS') {
        return handleCorsPreflight(getCorsHeaders());
    }
    
    if (!allowedMethods.includes(event.httpMethod)) {
        return {
            statusCode: 405,
            headers: getCorsHeaders(),
            body: JSON.stringify({ error: 'Método no permitido' })
        };
    }
    
    return null;
};

// Create user
const createUser = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const { cedula, nombre, email, telefono, fechaCompra, boletaId } = body;
        
        // Validate required fields
        if (!cedula || !nombre || !email) {
            return {
                statusCode: 400,
                headers: getCorsHeaders(),
                body: JSON.stringify({ 
                    error: 'Datos requeridos: cedula, nombre, email' 
                })
            };
        }

        // Create user object
        const userData = {
            cedula,
            nombre,
            email,
            telefono: telefono || '',
            fechaCompra: fechaCompra || new Date().toISOString(),
            boletaId: boletaId || uuidv4(),
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
        };

        // Save to DynamoDB
        const command = new PutCommand({
            TableName: process.env.USERS_TABLE,
            Item: userData,
            ConditionExpression: 'attribute_not_exists(cedula) OR attribute_exists(cedula)',
            ReturnValues: 'ALL_OLD'
        });

        await dynamodb.send(command);

        return {
            statusCode: 201,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                message: 'Usuario creado/actualizado exitosamente',
                data: userData
            })
        };

    } catch (error) {
        console.error('Error creating user:', error);
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

// Get user by cedula
const getUser = async (event) => {
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

        // Search user in DynamoDB
        const command = new GetCommand({
            TableName: process.env.USERS_TABLE,
            Key: { cedula }
        });

        const result = await dynamodb.send(command);

        if (!result.Item) {
            return {
                statusCode: 404,
                headers: getCorsHeaders(),
                body: JSON.stringify({ 
                    error: 'Usuario no encontrado' 
                })
            };
        }

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                message: 'Usuario encontrado',
                data: result.Item
            })
        };

    } catch (error) {
        console.error('Error getting user:', error);
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

// Update user
const updateUser = async (event) => {
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

        const body = JSON.parse(event.body || '{}');
        
        // Allowed fields for update
        const allowedFields = ['nombre', 'email', 'telefono', 'fechaCompra'];
        
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
            TableName: process.env.USERS_TABLE,
            Key: { cedula },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        });

        const result = await dynamodb.send(command);

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                message: 'Usuario actualizado exitosamente',
                data: result.Attributes
            })
        };

    } catch (error) {
        console.error('Error updating user:', error);
        
        if (error.name === 'ConditionalCheckFailedException') {
            return {
                statusCode: 404,
                headers: getCorsHeaders(),
                body: JSON.stringify({
                    error: 'Usuario no encontrado'
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

// Delete user
const deleteUser = async (event) => {
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

        // Verify if user exists
        const getCommand = new GetCommand({
            TableName: process.env.USERS_TABLE,
            Key: { cedula }
        });

        const userExists = await dynamodb.send(getCommand);

        if (!userExists.Item) {
            return {
                statusCode: 404,
                headers: getCorsHeaders(),
                body: JSON.stringify({
                    error: 'Usuario no encontrado'
                })
            };
        }

        // Delete user
        const deleteCommand = new DeleteCommand({
            TableName: process.env.USERS_TABLE,
            Key: { cedula }
        });

        await dynamodb.send(deleteCommand);

        // Also delete associated surveys
        const surveysCommand = new ScanCommand({
            TableName: process.env.SURVEYS_TABLE,
            FilterExpression: 'cedula = :cedula',
            ExpressionAttributeValues: {
                ':cedula': cedula
            }
        });

        const surveysResult = await dynamodb.send(surveysCommand);

        // Delete all user surveys
        if (surveysResult.Items && surveysResult.Items.length > 0) {
            const deletePromises = surveysResult.Items.map(survey => {
                return dynamodb.send(new DeleteCommand({
                    TableName: process.env.SURVEYS_TABLE,
                    Key: { surveyId: survey.surveyId }
                }));
            });

            await Promise.all(deletePromises);
        }

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                success: true,
                message: 'Usuario y sus encuestas eliminados exitosamente'
            })
        };

    } catch (error) {
        console.error('Error deleting user:', error);
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

// Get all users
const getAllUsers = async (event) => {
    try {
        const command = new ScanCommand({
            TableName: process.env.USERS_TABLE
        });

        const result = await dynamodb.send(command);

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                success: true,
                users: result.Items || [],
                count: result.Count || 0
            })
        };

    } catch (error) {
        console.error('Error getting all users:', error);
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
    console.log('UserService - Method:', event.httpMethod, 'Path:', event.path);
    
    const headers = getCorsHeaders();
    
    // Route based on HTTP method and path
    switch (event.httpMethod) {
        case 'OPTIONS':
            return handleCorsPreflight(headers);
            
        case 'GET':
            if (event.path === '/users') {
                return getAllUsers(event);
            } else if (event.pathParameters?.cedula) {
                return getUser(event);
            }
            break;
            
        case 'POST':
            if (event.path === '/users') {
                return createUser(event);
            }
            break;
            
        case 'PUT':
            if (event.pathParameters?.cedula) {
                return updateUser(event);
            }
            break;
            
        case 'DELETE':
            if (event.pathParameters?.cedula) {
                return deleteUser(event);
            }
            break;
    }
    
    // If no route matches, return method not allowed
    const methodValidation = validateMethod(event, ['GET', 'POST', 'PUT', 'DELETE']);
    if (methodValidation) {
        return methodValidation;
    }
    
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

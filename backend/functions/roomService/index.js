import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

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

// Create room
const createRoom = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const { roomId, nombre, descripcion, activa = true } = body;
        
        // Validate required fields
        if (!roomId || !nombre) {
            return {
                statusCode: 400,
                headers: getCorsHeaders(),
                body: JSON.stringify({ 
                    error: 'Datos requeridos: roomId, nombre' 
                })
            };
        }

        // Create room object
        const roomData = {
            roomId,
            nombre,
            descripcion: descripcion || '',
            activa: activa,
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
        };

        // Save to DynamoDB
        const command = new PutCommand({
            TableName: process.env.ROOMS_TABLE,
            Item: roomData,
            ConditionExpression: 'attribute_not_exists(roomId)',
            ReturnValues: 'ALL_OLD'
        });

        await dynamodb.send(command);

        return {
            statusCode: 201,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                message: 'Sala creada exitosamente',
                data: roomData
            })
        };

    } catch (error) {
        console.error('Error creating room:', error);
        
        if (error.name === 'ConditionalCheckFailedException') {
            return {
                statusCode: 409,
                headers: getCorsHeaders(),
                body: JSON.stringify({
                    error: 'La sala ya existe'
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

// Get room by ID
const getRoom = async (event) => {
    try {
        const roomId = event.pathParameters?.roomId;
        
        if (!roomId) {
            return {
                statusCode: 400,
                headers: getCorsHeaders(),
                body: JSON.stringify({ 
                    error: 'Room ID es requerido' 
                })
            };
        }

        // Search room in DynamoDB
        const command = new GetCommand({
            TableName: process.env.ROOMS_TABLE,
            Key: { roomId }
        });

        const result = await dynamodb.send(command);

        if (!result.Item) {
            return {
                statusCode: 404,
                headers: getCorsHeaders(),
                body: JSON.stringify({ 
                    error: 'Sala no encontrada' 
                })
            };
        }

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                message: 'Sala encontrada',
                data: result.Item
            })
        };

    } catch (error) {
        console.error('Error getting room:', error);
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

// Update room
const updateRoom = async (event) => {
    try {
        const roomId = event.pathParameters?.roomId;
        
        if (!roomId) {
            return {
                statusCode: 400,
                headers: getCorsHeaders(),
                body: JSON.stringify({ 
                    error: 'Room ID es requerido' 
                })
            };
        }

        const body = JSON.parse(event.body || '{}');
        
        // Allowed fields for update
        const allowedFields = ['nombre', 'descripcion', 'activa'];
        
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
            TableName: process.env.ROOMS_TABLE,
            Key: { roomId },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        });

        const result = await dynamodb.send(command);

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                message: 'Sala actualizada exitosamente',
                data: result.Attributes
            })
        };

    } catch (error) {
        console.error('Error updating room:', error);
        
        if (error.name === 'ConditionalCheckFailedException') {
            return {
                statusCode: 404,
                headers: getCorsHeaders(),
                body: JSON.stringify({
                    error: 'Sala no encontrada'
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

// Delete room
const deleteRoom = async (event) => {
    try {
        const roomId = event.pathParameters?.roomId;

        if (!roomId) {
            return {
                statusCode: 400,
                headers: getCorsHeaders(),
                body: JSON.stringify({
                    error: 'Room ID es requerido'
                })
            };
        }

        // Verify if room exists
        const getCommand = new GetCommand({
            TableName: process.env.ROOMS_TABLE,
            Key: { roomId }
        });

        const roomExists = await dynamodb.send(getCommand);

        if (!roomExists.Item) {
            return {
                statusCode: 404,
                headers: getCorsHeaders(),
                body: JSON.stringify({
                    error: 'Sala no encontrada'
                })
            };
        }

        // Delete room
        const deleteCommand = new DeleteCommand({
            TableName: process.env.ROOMS_TABLE,
            Key: { roomId }
        });

        await dynamodb.send(deleteCommand);

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                success: true,
                message: 'Sala eliminada exitosamente'
            })
        };

    } catch (error) {
        console.error('Error deleting room:', error);
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

// Get all rooms
const getAllRooms = async (event) => {
    try {
        const command = new ScanCommand({
            TableName: process.env.ROOMS_TABLE
        });

        const result = await dynamodb.send(command);

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                success: true,
                rooms: result.Items || [],
                count: result.Count || 0
            })
        };

    } catch (error) {
        console.error('Error getting all rooms:', error);
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
    console.log('RoomService - Method:', event.httpMethod, 'Path:', event.path);
    
    const headers = getCorsHeaders();
    
    // Route based on HTTP method and path
    switch (event.httpMethod) {
        case 'OPTIONS':
            return handleCorsPreflight(headers);
            
        case 'GET':
            if (event.path === '/rooms') {
                return getAllRooms(event);
            } else if (event.pathParameters?.roomId) {
                return getRoom(event);
            }
            break;
            
        case 'POST':
            if (event.path === '/rooms') {
                return createRoom(event);
            }
            break;
            
        case 'PUT':
            if (event.pathParameters?.roomId) {
                return updateRoom(event);
            }
            break;
            
        case 'DELETE':
            if (event.pathParameters?.roomId) {
                return deleteRoom(event);
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

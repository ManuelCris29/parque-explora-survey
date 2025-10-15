import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'PUT') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const cedula = event.pathParameters?.cedula;
        const body = JSON.parse(event.body || '{}');

        if (!cedula) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Cédula es requerida'
                })
            };
        }

        // Campos permitidos para actualización
        const allowedFields = ['nombre', 'email', 'telefono'];
        const updateExpression = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};

        // Construir expresión de actualización solo con campos permitidos
        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                updateExpression.push(`#${field} = :${field}`);
                expressionAttributeNames[`#${field}`] = field;
                expressionAttributeValues[`:${field}`] = body[field];
            }
        });

        if (updateExpression.length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'No hay campos válidos para actualizar'
                })
            };
        }

        // Agregar fecha de actualización
        updateExpression.push('#fechaActualizacion = :fechaActualizacion');
        expressionAttributeNames['#fechaActualizacion'] = 'fechaActualizacion';
        expressionAttributeValues[':fechaActualizacion'] = new Date().toISOString();

        const params = {
            TableName: process.env.USERS_TABLE,
            Key: {
                cedula: cedula
            },
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        };

        const result = await dynamodb.send(new UpdateCommand(params));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Usuario actualizado exitosamente',
                user: result.Attributes
            })
        };

    } catch (error) {
        console.error('Error updating user:', error);
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

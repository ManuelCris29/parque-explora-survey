import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'PUT,OPTIONS'
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

        if (event.httpMethod !== 'PUT') {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Método no permitido' })
            };
        }

        // Obtener surveyId de los path parameters
        const surveyId = event.pathParameters?.surveyId;
        
        if (!surveyId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Survey ID es requerido' 
                })
            };
        }

        // Parsear el body
        const body = JSON.parse(event.body || '{}');
        
        // Campos permitidos para actualizar
        const allowedFields = [
            'salasVisitadas',
            'salasFavoritas', 
            'salasParaRenovar',
            'calificacionGeneral',
            'comentarios',
            'estado'
        ];

        // Filtrar solo campos permitidos
        const updateData = {};
        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        });

        if (Object.keys(updateData).length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'No hay datos válidos para actualizar' 
                })
            };
        }

        // Agregar fecha de actualización
        updateData.fechaActualizacion = new Date().toISOString();

        // Preparar expresión de actualización
        const updateExpression = 'SET ' + Object.keys(updateData).map(key => `${key} = :${key}`).join(', ');
        const expressionAttributeValues = {};
        Object.keys(updateData).forEach(key => {
            expressionAttributeValues[`:${key}`] = updateData[key];
        });

        // Actualizar en DynamoDB
        const params = {
            TableName: process.env.SURVEYS_TABLE,
            Key: {
                surveyId: surveyId
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        };

        const result = await dynamodb.send(new UpdateCommand(params));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Encuesta actualizada exitosamente',
                data: result.Attributes
            })
        };

    } catch (error) {
        console.error('Error:', error);
        
        if (error.code === 'ConditionalCheckFailedException') {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    error: 'Encuesta no encontrada'
                })
            };
        }
        
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

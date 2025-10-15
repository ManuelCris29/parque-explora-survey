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
        const surveyId = event.pathParameters?.surveyId;
        const body = JSON.parse(event.body || '{}');

        if (!surveyId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Survey ID es requerido'
                })
            };
        }

        // Campos permitidos para actualización
        const allowedFields = [
            'calificacionGeneral', 
            'salasVisitadas', 
            'salasFavoritas', 
            'salasParaRenovar', 
            'comentarios',
            'estado'
        ];
        
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
            TableName: process.env.SURVEYS_TABLE,
            Key: {
                surveyId: surveyId
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
                message: 'Encuesta actualizada exitosamente',
                survey: result.Attributes
            })
        };

    } catch (error) {
        console.error('Error updating survey:', error);
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

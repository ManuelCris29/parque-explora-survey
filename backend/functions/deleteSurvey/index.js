import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    console.log('DeleteSurvey function called with method:', event.httpMethod);
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

    if (event.httpMethod !== 'DELETE') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
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

        // Verificar si la encuesta existe
        const getParams = {
            TableName: process.env.SURVEYS_TABLE,
            Key: {
                surveyId: surveyId
            }
        };

        const surveyExists = await dynamodb.send(new GetCommand(getParams));

        if (!surveyExists.Item) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    error: 'Encuesta no encontrada'
                })
            };
        }

        // Eliminar la encuesta
        const deleteParams = {
            TableName: process.env.SURVEYS_TABLE,
            Key: {
                surveyId: surveyId
            }
        };

        await dynamodb.send(new DeleteCommand(deleteParams));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Encuesta eliminada exitosamente'
            })
        };

    } catch (error) {
        console.error('Error deleting survey:', error);
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

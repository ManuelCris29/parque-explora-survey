const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
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

    if (event.httpMethod !== 'GET') {
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

        const params = {
            TableName: process.env.SURVEYS_TABLE,
            Key: {
                surveyId: surveyId
            }
        };

        const result = await dynamodb.get(params).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    error: 'Encuesta no encontrada'
                })
            };
        }

        // Obtener datos del usuario
        let user = null;
        if (result.Item.cedula) {
            try {
                const userParams = {
                    TableName: process.env.USERS_TABLE,
                    Key: {
                        cedula: result.Item.cedula
                    }
                };
                const userResult = await dynamodb.get(userParams).promise();
                user = userResult.Item;
            } catch (error) {
                console.error('Error getting user data:', error);
            }
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                survey: {
                    ...result.Item,
                    user: user
                }
            })
        };

    } catch (error) {
        console.error('Error getting survey:', error);
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

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('DeleteUser function called with method:', event.httpMethod);
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
        const cedula = event.pathParameters?.cedula;

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
        const getParams = {
            TableName: process.env.USERS_TABLE,
            Key: {
                cedula: cedula
            }
        };

        const userExists = await dynamodb.get(getParams).promise();

        if (!userExists.Item) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    error: 'Usuario no encontrado'
                })
            };
        }

        // Eliminar el usuario
        const deleteParams = {
            TableName: process.env.USERS_TABLE,
            Key: {
                cedula: cedula
            }
        };

        await dynamodb.delete(deleteParams).promise();

        // También eliminar las encuestas asociadas
        const surveysParams = {
            TableName: process.env.SURVEYS_TABLE,
            FilterExpression: 'cedula = :cedula',
            ExpressionAttributeValues: {
                ':cedula': cedula
            }
        };

        const surveysResult = await dynamodb.scan(surveysParams).promise();

        // Eliminar todas las encuestas del usuario
        if (surveysResult.Items && surveysResult.Items.length > 0) {
            const deletePromises = surveysResult.Items.map(survey => {
                return dynamodb.delete({
                    TableName: process.env.SURVEYS_TABLE,
                    Key: {
                        surveyId: survey.surveyId
                    }
                }).promise();
            });

            await Promise.all(deletePromises);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Usuario y sus encuestas eliminados exitosamente'
            })
        };

    } catch (error) {
        console.error('Error deleting user:', error);
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

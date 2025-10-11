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

        const params = {
            TableName: process.env.USERS_TABLE,
            Key: {
                cedula: cedula
            }
        };

        const result = await dynamodb.get(params).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    error: 'Usuario no encontrado'
                })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                user: result.Item
            })
        };

    } catch (error) {
        console.error('Error getting user:', error);
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

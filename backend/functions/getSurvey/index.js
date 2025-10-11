const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
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

        if (event.httpMethod !== 'GET') {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Método no permitido' })
            };
        }

        // Obtener cédula de los path parameters
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

        // Buscar encuesta en DynamoDB usando el índice
        const params = {
            TableName: process.env.SURVEYS_TABLE,
            IndexName: 'CedulaIndex',
            KeyConditionExpression: 'cedula = :cedula',
            ExpressionAttributeValues: {
                ':cedula': cedula
            }
        };

        const result = await dynamodb.query(params).promise();

        if (!result.Items || result.Items.length === 0) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ 
                    error: 'Encuesta no encontrada para este usuario',
                    cedula: cedula
                })
            };
        }

        // Obtener también los datos del usuario
        const userParams = {
            TableName: process.env.USERS_TABLE,
            Key: { cedula }
        };

        const userResult = await dynamodb.get(userParams).promise();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Encuesta encontrada',
                data: {
                    survey: result.Items[0],
                    user: userResult.Item
                }
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

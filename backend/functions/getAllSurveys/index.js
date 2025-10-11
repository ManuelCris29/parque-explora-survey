const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
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
        const params = {
            TableName: process.env.SURVEYS_TABLE
        };

        const result = await dynamodb.scan(params).promise();

        // Enriquecer datos con información de usuarios
        const surveysWithUsers = await Promise.all(
            (result.Items || []).map(async (survey) => {
                try {
                    const userParams = {
                        TableName: process.env.USERS_TABLE,
                        Key: {
                            cedula: survey.cedula
                        }
                    };
                    const userResult = await dynamodb.get(userParams).promise();
                    return {
                        ...survey,
                        user: userResult.Item || null
                    };
                } catch (error) {
                    console.error('Error getting user data:', error);
                    return survey;
                }
            })
        );

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                surveys: surveysWithUsers,
                count: result.Count || 0
            })
        };

    } catch (error) {
        console.error('Error getting all surveys:', error);
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


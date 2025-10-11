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

        // Obtener todas las salas de DynamoDB
        const params = {
            TableName: process.env.ROOMS_TABLE
        };

        const result = await dynamodb.scan(params).promise();

        // Si no hay salas, devolver salas por defecto
        if (!result.Items || result.Items.length === 0) {
            const defaultRooms = [
                {
                    roomId: 'sala-1',
                    nombre: 'Sala de Proyección 3D',
                    descripcion: 'Experiencia inmersiva en 3D con tecnología de última generación',
                    categoria: 'Tecnología',
                    estado: 'activa'
                },
                {
                    roomId: 'sala-2', 
                    nombre: 'Planetario',
                    descripcion: 'Observación del cosmos y proyecciones astronómicas',
                    categoria: 'Astronomía',
                    estado: 'activa'
                },
                {
                    roomId: 'sala-3',
                    nombre: 'Laboratorio de Química',
                    descripcion: 'Experimentos interactivos de química y física',
                    categoria: 'Ciencias',
                    estado: 'activa'
                },
                {
                    roomId: 'sala-4',
                    nombre: 'Acuario',
                    descripcion: 'Exhibición de vida marina y ecosistemas acuáticos',
                    categoria: 'Biología',
                    estado: 'activa'
                },
                {
                    roomId: 'sala-5',
                    nombre: 'Sala de Robots',
                    descripcion: 'Interacción con robots y tecnología de inteligencia artificial',
                    categoria: 'Robótica',
                    estado: 'activa'
                }
            ];

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    message: 'Salas obtenidas exitosamente',
                    data: defaultRooms,
                    source: 'default'
                })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Salas obtenidas exitosamente',
                data: result.Items,
                source: 'database'
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

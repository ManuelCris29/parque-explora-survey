const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
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

        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Método no permitido' })
            };
        }

        // Parsear el body
        const body = JSON.parse(event.body || '{}');
        
        // Validar datos requeridos
        const { cedula, nombre, email, telefono, fechaCompra, boletaId } = body;
        
        if (!cedula || !nombre || !email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Datos requeridos: cedula, nombre, email' 
                })
            };
        }

        // Crear objeto de usuario
        const userData = {
            cedula,
            nombre,
            email,
            telefono: telefono || '',
            fechaCompra: fechaCompra || new Date().toISOString(),
            boletaId: boletaId || uuidv4(),
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
        };

        // Guardar en DynamoDB
        const params = {
            TableName: process.env.USERS_TABLE,
            Item: userData,
            ConditionExpression: 'attribute_not_exists(cedula) OR attribute_exists(cedula)',
            ReturnValues: 'ALL_OLD'
        };

        const result = await dynamodb.put(params).promise();

        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                message: 'Usuario creado/actualizado exitosamente',
                data: userData
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

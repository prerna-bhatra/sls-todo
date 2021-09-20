'use strict'

const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createTodo = (event, context, callback) => {
    const datetime = new Date().toISOString();
    const data = JSON.parse(event.body);
    if (typeof data.task != 'string') {
        console.log("NOT A STRIN");
        const response = {
            statusCode: 400,
            body: JSON.stringify({ "message": "TASK IS NOT A STRING" })
        }

        const params =
        {
            TableName: 'todos',
            Items: {
                id: uuid.v1(),
                task: data.task,
                done: false,
                createdAt: datetime
            }
        }

        dynamoDb.put(params, (error, data) => {
            if (error) {
                callback(new Error(error));
                return;
            }

            const response = {
                statusCode: 201,
                body: JSON.stringify(data.Items)
            }

            callback(null, response);

        })
    }
}
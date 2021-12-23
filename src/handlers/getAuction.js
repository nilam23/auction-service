import AWS from 'aws-sdk';
import middy from '@middy/core';
import commonMiddleware from '../lib/middleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
    let auction;
    const { id } = event.pathParameters;

    try {
        const result = await dynamodb.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id }
        }).promise();
        auction = result.Item;
    } catch (error) {
        console.log(error);
    }

    if(!auction) {
        return {
            statusCode: 404,
            body: `Item not found with id ${id}`
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify(auction),
    };
}

export const handler = commonMiddleware(getAuction);

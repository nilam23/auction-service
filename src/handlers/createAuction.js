import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/middleware';
// import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  // const {title} = JSON.parse(event.body);
  const {title} = event.body; // because of httpJsonBodyParser
  const now = new Date();
  const endDate = new Date();
  // endDate.setDays(now.getDays() + 1);
  endDate.setHours(now.getHours() + 1);
  
  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    }
  };

  try {
    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction
    }).promise();
    
    return {
      statusCode: 201,
      body: JSON.stringify(auction),
    };
  } catch (error) {
    console.log(error);
    // throw new createError.InternalServerError(error);
  }
}

export const handler = commonMiddleware(createAuction);

'use strict';

const AWS = require('aws-sdk');
let { getConnectionIds, addConnection, deleteConnection } = require("./dynamo");

require('aws-sdk/clients/apigatewaymanagementapi'); 

const successfullResponse = {
  statusCode: 200,
  body: 'everything is alright'
};

module.exports.connectionHandler = (event, context, callback) => {
  
  // pegar parametros queryString na url
  // const token = event["queryStringParameters"]["token"];

  // console.log("routeKey", event.requestContext.routeKey);
  // console.log('eventType', event.requestContext.eventType);
  // console.log('requestTime', event.requestContext.requestTime);
  // console.log('stage', event.requestContext.stage);
  // console.log('connectionId', event.requestContext.connectionId);


  try {
    const token = event["queryStringParameters"]["token"];
    console.log("Token: ", token);
  } catch (err) {
    console.log("Requeried Token!");
    return callback(null, {
      statusCode: 400,
      body: "Requeried Token!",
    });
  }

  if (event.requestContext.eventType === 'CONNECT') {
    // Handle connection
    addConnection(event.requestContext.connectionId)
      .then(() => {
        callback(null, successfullResponse);
      })
      .catch(err => {
        console.log(err);
        callback(null, JSON.stringify(err));
      });
  } else if (event.requestContext.eventType === 'DISCONNECT') {
    // Handle disconnection
    deleteConnection(event.requestContext.connectionId)
      .then(() => {
        callback(null, successfullResponse);
      })
      .catch(err => {
        console.log(err);
        callback(null, {
          statusCode: 500,
          body: 'Failed to connect: ' + JSON.stringify(err)
        });
      });
  }
};

// THIS ONE DOESNT DO ANYHTING
module.exports.defaultHandler = (event, context, callback) => {
  console.log('defaultHandler was called');
  console.log(event);

  callback(null, {
    statusCode: 200,
    body: 'defaultHandler'
  });
};

module.exports.sendMessageHandler = (event, context, callback) => {
  sendMessageToAllConnected(event).then(() => {
    callback(null, successfullResponse)
  }).catch (err => {
    callback(null, JSON.stringify(err));
  });
}

const sendMessageToAllConnected = (event) => {
  return getConnectionIds().then(connectionData => {
    return connectionData.Items.map(connectionId => {
      return send(event, connectionId.connectionId);
    });
  });
}

const send = (event, connectionId) => {
  const body = JSON.parse(event.body);
  const postData = body.data;  

  const endpoint = event.requestContext.domainName + "/" + event.requestContext.stage;
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: endpoint
  });

  const params = {
    ConnectionId: connectionId,
    Data: postData
  };
  return apigwManagementApi.postToConnection(params).promise();
};

module.exports.createToken = function (event, context, callback) {
  console.log("Hello World API!");
  const response = {
    statusCode: 200,
    headers: {
      // Required for CORS support to work
      "Access-Control-Allow-Origin": "*",
      // Required for cookies, authorization headers with HTTPS
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ token: "123456" }),
  };

  callback(null, response);
};
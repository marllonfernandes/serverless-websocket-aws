const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const CHATCONNECTION_TABLE = "chatIdTable";

const getConnectionIds = () => {
  const params = {
    TableName: CHATCONNECTION_TABLE,
    ProjectionExpression: "connectionId",
  };

  return dynamo.scan(params).promise();
};

const addConnection = (connectionId) => {
  const params = {
    TableName: CHATCONNECTION_TABLE,
    Item: {
      connectionId: connectionId,
    },
  };

  return dynamo.put(params).promise();
};

const deleteConnection = (connectionId) => {
  const params = {
    TableName: CHATCONNECTION_TABLE,
    Key: {
      connectionId: connectionId,
    },
  };

  return dynamo.delete(params).promise();
};

module.exports = { getConnectionIds, addConnection, deleteConnection };
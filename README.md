# Serverless Websocket AWS + DynamoDb

This is an example of how to use AWS ApiGateway and DynamoDb using NodeJS and the aws-sdk.

### Install Packages

````
npm install
````

### Deploy

````
sls deploy --stage dev --region sa-east-1 --verbose

````

### Output Generate
#### Replace the word URL

````
endpoints:
  POST - https://{URL}/dev/api/token
  wss://{URL}/dev
````

### Consume API Rest Token Test
````
curl --location --request POST 'https://{URL}/dev/api/token'

````
````
response: {"message":"Hello World API!"}

````

### Consume Websocket Test
#### Install Package npm install wscat -g or use a client via browser
````
wscat -c 'https://{URL}/dev/api/token?token=123456'

````
````
send message: {"action": "sendMessage", "data": "hello test"}

````
````
response: hello test

````

### Remove
````
sls remove --stage dev --region sa-east-1 --verbose

````


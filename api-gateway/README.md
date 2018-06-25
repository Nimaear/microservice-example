## Microservices

The microservice architecture consists of 2 crucial parts.
  1. RabbitMQ messaging service
  2. Api-Gateway


### RabbitMQ messaging service
RabbitMQ is used to pass messages between microservices and manage persistent queues. Molecluer uses RabbitMQ internall to manage the messaging and usually you'll not have to deal with this at all.

### Api-Gateway
Api-Gateway is called a gateway because it acts as a gateway between the internet and the microservice infrastructure. This is where the webhooks usually end up and depending on the implementation, the gateway usually just places an object on the queue. (In the case of the endpoint /gmail/syncEmailFromEnterprise is this queue ```email-sync```)


## Usual process flow
We'll see ```email-sync``` as our example service here:

  1. Gmail webhook request a ```POST``` on ```/gmail/syncEmailFromEnterprise``` with the following payload on the api-gateway
```JSON
  {
    "message":
    {
      "data": "eyJlbWFpbEFkZHJlc3MiOiAidXNlckBleGFtcGxlLmNvbSIsICJoaXN0b3J5SWQiOiAiMTIzNDU2Nzg5MCJ9",
      "message_id": "1234567890",
    },
    "subscription": "projects/myproject/subscriptions/mysubscription"
  }  
```
  2. The gateway decos the data property of the message (which is a base64 encoded string) and places the result on the ```email-sync``` queue (in this case this is):
```JSON
  {
    "emailAddress": "user@example.com", 
    "historyId": "1234567890"
  }
```
  3. The Email-Sync microservice gets notified that there is a new queue item available
```java
  Consumer consumer = new DefaultConsumer(channel) {
    @Override
    public void handleDelivery(String consumerTag, Envelope envelope,
                               AMQP.BasicProperties properties, byte[] body)
        throws IOException {
      String message = new String(body, "UTF-8");
      System.out.println(" [x] Received '" + message + "'");
    }
  };
  channel.basicConsume(QUEUE_NAME, true, consumer);
```
  4. ```message``` here contains the message in string form. 
  5. Java Microservice should then parse this string to JSON/Object. This object contains the email address. 


## Problems with the current approach
There's no need to add the following routes to the gateway at all since the only thing needed is the ```/gmail/syncEmailFromEnterprise``` endpoint.
```JS
  app.post('/email', email(context));
  app.post('/startSync', startSync(context));
  app.post('/stopSync', stopSync(context));
  app.post('/webHook', webHook(context));
```

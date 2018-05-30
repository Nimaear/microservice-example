# Description

The **api-gateway** has two endpoints that are relevant for testing and you can reach them like this:

[http://localhost:3001/queue](http://localhost:3001/queue) : this distributes calls to the **queue-microservice**

and

[http://localhost:3001/math](http://localhost:3001/math) : this distributes calls to the **math-microservice**

The difference between these two microservices is that we care about the response of the **math-microservice** and we don't care about the response of **queue-microservice** (as long as it's executed, it's fine)

# Getting started

  1. Get microservices up and running
  2a. Test using `curl`
  or
  2b. Test using `ab`

## Getting the microservices up and running

You have two choices to get these microservices up and running

### 1. Docker-Compose

Just run `docker-compose up` and continue to **Test using curl**. If you want to go crazy, you can run `docker-compose scale math=10 queue=3` to run 10 instances of **math-microservice** and 3 instances of the **queue-microservice**.

### 2. Manually

If you are feeling adventurous and want to run things manually, you can run `npm install` followed by `npm start` in each sub directory

## Test using curl

`curl -d '{"some": "payload"}' -H "Content-Type: application/json" -X POST http://localhost:3001/queue` will call the **api-gateway** and will ask some data to be sent to the queue-microservices. The **queue-microservice** is a little slacky and takes 5000 milliseconds (simulated) to handle the queue. The gateway responds instantly that the task has been placed on the queue. (This could be for example some email that we are sending out or an export we are building. The export microservice can then in turn use the email microservice to send the result to the user)

`curl -d '{"a":3, "b":20}' -H "Content-Type: application/json" -X POST http://localhost:3001/math` will call the **api-gateway** and will ask the **math-microservice** to add *3* and *20*. The **math-microservice** is not that smart and takes 1000 milliseconds (simulated) to calculate the result. The gateway will return the result in around 1000 milliseconds. Since node.js is not-blocking, we can still handle a lot more requests.


## Test using ab
If you are feeling even more adventurous, you can try testing `ab` (Apache-bench).  Keep in mind that the second example actually places _10000_ requests on the api-gateway and will probably keep your queue microservices busy for a long time, so adjust the numbers accordingly.

```
ab \
  -n 100 \
  -c 10 \
  -T "application/json" \
  -v 4 \
  -p math.json \
  http://localhost:3001/math
```


```
ab \
  -n 10000 \
  -c 100 \
  -T "application/json" \
  -v 4 \
  -p queue.json \
  http://localhost:3001/queue
```

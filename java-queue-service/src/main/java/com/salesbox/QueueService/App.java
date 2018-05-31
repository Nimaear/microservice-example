package com.salesbox.QueueService;
import java.io.IOException;
import java.lang.Exception;
import java.util.concurrent.TimeoutException;
import java.io.StringWriter;
import java.io.PrintWriter;

import com.rabbitmq.client.*;

public class App
{
    private final static String QUEUE_NAME = "tasks";

    public static void main( String[] args )
    {

        try {

            ConnectionFactory factory = new ConnectionFactory();
            factory.setUsername("guest");
            factory.setPassword("guest");
            factory.setHost("rabbitmq");
            factory.setPort(5672);

            Connection conn = factory.newConnection();

            Channel channel = conn.createChannel();
            channel.queueDeclare(QUEUE_NAME, true, false, false, null);

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


            System.out.println("Queue-Service started!");


        } catch (IOException e) {
            StringWriter outError = new StringWriter();
            e.printStackTrace(new PrintWriter(outError));
            String errorString = outError.toString();
            System.err.println("IOException: " + e.getMessage());
            System.out.println(errorString);
        } catch (TimeoutException e) {
            System.err.println("TimeoutException: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Exception: " + e.getMessage());
        }

    }
}



package com.salesbox.MathService;
import java.io.IOException;
import java.lang.Exception;
import java.util.concurrent.TimeoutException;
import services.moleculer.config.ServiceBrokerConfig;
import services.moleculer.ServiceBroker;
import services.moleculer.transporter.AmqpTransporter;

public class App
{
    public static void main( String[] args )
    {
        ServiceBrokerConfig cfg = new ServiceBrokerConfig();
        try {

            AmqpTransporter t = new AmqpTransporter("amqp://guest:guest@rabbitmq:5672");
            // t.setDebug(true);
            cfg.setTransporter(t);

            MathService math = new MathService();

            ServiceBroker broker = new ServiceBroker(cfg);
            broker.createService(math);
            broker.start();
            System.out.println("Math-Service started!");


        } catch (IOException e) {
            System.err.println("IOException: " + e.getMessage());
        } catch (TimeoutException e) {
            System.err.println("TimeoutException: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Exception: " + e.getMessage());
        }

    }
}


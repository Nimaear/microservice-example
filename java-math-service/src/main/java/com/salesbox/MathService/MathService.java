package com.salesbox.MathService;
import io.datatree.Tree;
import services.moleculer.ServiceBroker;
import services.moleculer.service.Service;
import services.moleculer.eventbus.Listener;
import services.moleculer.service.Action;
import services.moleculer.eventbus.Subscribe;
import services.moleculer.service.Name;

@Name("Math")
public class MathService extends Service {
    public int count = 0;

    public Action add = ctx -> {
        this.count++;
        int a = ctx.params.get("a", 0);
        int b = ctx.params.get("b", 0);
        System.out.println( "Receieved:" + "(" + this.count + ") : " + a + "," + b);
        return a + b;
    };

    @Subscribe("foo.*")
    public Listener listener = payload -> {
        // System.out.println("Received: " + payload);
    };

};
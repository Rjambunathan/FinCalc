"use strict";var __awaiter=this&&this.__awaiter||function(a,b,c,d){return new(c||(c=Promise))(function(e,f){function g(a){try{i(d.next(a))}catch(a){f(a)}}function h(a){try{i(d["throw"](a))}catch(a){f(a)}}function i(a){a.done?e(a.value):new c(function(b){b(a.value)}).then(g,h)}i((d=d.apply(a,b||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const config=require("config"),queue_1=require("./queue"),queueHost=config.get("queue.host"),queuePort=config.get("queue.port"),queueExchange=config.get("queue.exchange");function createQueueProducer(){return __awaiter(this,void 0,void 0,function*(){const a=yield queue_1.MessageSender.createInstance(queueHost,queuePort,{exchange:queueExchange,exchangeType:"direct",exchangeOptions:{durable:!0,autoDelete:!1}});return yield a.init(),a})}exports.createQueueProducer=createQueueProducer;function createQueueConsumer(){return __awaiter(this,void 0,void 0,function*(){const a=yield queue_1.MessageReceiver.createInstance(queueHost,queuePort,{exchange:queueExchange,exchangeType:"direct",pattern:"task",queue:"loancalc.tasks",exchangeOptions:{durable:!0,autoDelete:!1},queueOptions:{maxPriority:8}});return yield a.init(),a})}exports.createQueueConsumer=createQueueConsumer;function createTask(a,b,c){return new queue_1.Message("task",a,b,c)}exports.createTask=createTask;function createEmailTask(a){return createTask("email",a)}exports.createEmailTask=createEmailTask;
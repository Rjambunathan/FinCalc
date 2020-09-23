"use strict";var __decorate=this&&this.__decorate||function(a,b,e,f){var g,d=arguments.length,c=3>d?b:null===f?f=Object.getOwnPropertyDescriptor(b,e):f;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(a,b,e,f);else for(var h=a.length-1;0<=h;h--)(g=a[h])&&(c=(3>d?g(c):3<d?g(b,e,c):g(b,e))||c);return 3<d&&c&&Object.defineProperty(b,e,c),c},__awaiter=this&&this.__awaiter||function(a,b,c,d){return new(c||(c=Promise))(function(e,f){function g(a){try{i(d.next(a))}catch(a){f(a)}}function h(a){try{i(d["throw"](a))}catch(a){f(a)}}function i(a){a.done?e(a.value):new c(function(b){b(a.value)}).then(g,h)}i((d=d.apply(a,b||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const serve_1=require("../serve"),db_files_1=require("../util/db-files"),config=require("config"),moment=require("moment"),api_1=require("./api"),app_queue_1=require("../workers/app-queue");class DebugController extends serve_1.Controller{constructor(){super(...arguments),this.errorHander=new api_1.ApiErrorHandler}emailtask({app:a}){return __awaiter(this,void 0,void 0,function*(){const b=app_queue_1.createEmailTask({to:"adolph.celestin@gmail.com",content:"Some random email content.",subject:"Testing123"}).retry(1);a.queue.send(b)})}forceFilePruning({context:a,params:b}){return __awaiter(this,void 0,void 0,function*(){serve_1.Logger.info("Forcing file pruning...");const c=serve_1.requireStringField(b,"time","time");if("ttl"!==c&&"now"!==c)throw new serve_1.ServerError(!1,"bad-time-field","Time field must either be 'now' or 'ttl'.");let d;if("ttl"===c){const a=config.get("server.uploadTTL"),b=config.get("server.uploadTTLUnits");d=moment().subtract(a,b)}else d=moment();db_files_1.pruneFiles(d).catch((a)=>{serve_1.Logger.error("Error while pruning files: ",a)}),a.response.body="Pruning Files...",a.response.status=200})}getErrorHandler(){return this.errorHander}}__decorate([serve_1.get("/debug/email")],DebugController.prototype,"emailtask",null),__decorate([serve_1.get("/debug/prune-files/:time")],DebugController.prototype,"forceFilePruning",null),exports.default=DebugController;
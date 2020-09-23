"use strict";var __awaiter=this&&this.__awaiter||function(a,b,c,d){return new(c||(c=Promise))(function(e,f){function g(a){try{i(d.next(a))}catch(a){f(a)}}function h(a){try{i(d["throw"](a))}catch(a){f(a)}}function i(a){a.done?e(a.value):new c(function(b){b(a.value)}).then(g,h)}i((d=d.apply(a,b||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const node_fetch_1=require("node-fetch"),Url=require("url");class MailChimp{constructor(a,b){this.accessToken=a,b?(this.endpoint=b.cookies.get("mailchimp-endpoint",{signed:!0}),this.endpoint&&!this.endpoint.toLowerCase().endsWith("mailchimp.com")&&(this.endpoint=null),this.context=b):(this.context=void 0,this.endpoint=null)}fetchProps(a){let b={headers:{Authorization:"OAuth "+this.accessToken}};return a&&(b=Object.assign(b,a)),b}ensureEndpoint(){return __awaiter(this,void 0,void 0,function*(){if(!this.endpoint){const a=yield node_fetch_1.default("https://login.mailchimp.com/oauth2/metadata",this.fetchProps()).then((a)=>a.json());this.endpoint=a&&"string"==typeof a.api_endpoint?a.api_endpoint:"https://api.mailchimp.com",this.context&&this.context.cookies.set("mailchimp-endpoint",this.endpoint,{signed:!0,httpOnly:!0})}return this.endpoint})}getAccountDetails(){return __awaiter(this,void 0,void 0,function*(){const a=this.endpoint||(yield this.ensureEndpoint());return yield node_fetch_1.default(Url.resolve(a,"/3.0"),this.fetchProps()).then((a)=>a.json())})}getLists(){return __awaiter(this,void 0,void 0,function*(){const a=this.endpoint||(yield this.ensureEndpoint());return yield node_fetch_1.default(Url.resolve(a,"/3.0/lists"),this.fetchProps()).then((a)=>a.json())})}}exports.MailChimp=MailChimp;
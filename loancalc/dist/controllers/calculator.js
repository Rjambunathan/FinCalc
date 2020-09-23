"use strict";var __decorate=this&&this.__decorate||function(a,b,e,f){var g,d=arguments.length,c=3>d?b:null===f?f=Object.getOwnPropertyDescriptor(b,e):f;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(a,b,e,f);else for(var h=a.length-1;0<=h;h--)(g=a[h])&&(c=(3>d?g(c):3<d?g(b,e,c):g(b,e))||c);return 3<d&&c&&Object.defineProperty(b,e,c),c},__awaiter=this&&this.__awaiter||function(a,b,c,d){return new(c||(c=Promise))(function(e,f){function g(a){try{i(d.next(a))}catch(a){f(a)}}function h(a){try{i(d["throw"](a))}catch(a){f(a)}}function i(a){a.done?e(a.value):new c(function(b){b(a.value)}).then(g,h)}i((d=d.apply(a,b||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const serve_1=require("../serve"),models_1=require("../graph/calculators/models"),models_2=require("../graph/clients/models"),FS=require("mz/fs"),metrics_1=require("../util/metrics"),constants_1=require("../util/constants"),moment=require("moment"),util_1=require("../util/util"),models_3=require("../graph/leads/models"),config=require("config");function copyprop(a,b,c,d=void 0){d===void 0&&(d=c),b[d]=a[c];const e=b[d];return"string"==typeof e&&1>e.trim().length||void 0===e?!1:!0}function copymeta(a,b,c,d=void 0){d===void 0&&(d=c),a.metadata&&(b[d]=a.metadata[c]);const e=b[d];return"string"==typeof e&&1>e.trim().length||void 0===e?!1:!0}function getmeta(a,b,c=null){if(a.metadata){const d=a.metadata[b];return null===d||void 0===d?c:d}return c}const TABS_ADDED_REGEX=/\s*tabs_added\[(\w+)\]\s*/i;class CalculatorController extends serve_1.Controller{constructor(){super(),this.ignoreDuplicateLeads=!1,this.calculatorTemplateLoaded=!1,this.calculatorTemplateStart="",this.calculatorTemplateEnd="",this.ignoreDuplicateLeads=!!config.get("app.ignoreDuplicateLeads"),this.facebookAppId=config.get("facebook.appId"),this.facebookAppSecret=config.get("facebook.appSecret")}randVisitGenerator({reroute:a,context:b,app:c,params:d}){return __awaiter(this,void 0,void 0,function*(){const a=d.getString("id"),c=d.getInt("count"),e=d.getString("from"),f=d.getString("to"),g=moment(e),h=moment(f);b.response.body="check the logs",b.response.status=200,metrics_1.createRandomVisits(c,a,g,h).then(()=>{serve_1.Logger.info("Finished Generating Visitors.")},(a)=>{serve_1.Logger.error("Error while generating visitors: ",a)})})}getCalculatorPost(a){return __awaiter(this,void 0,void 0,function*(){return yield this.getCalculator(a)})}getCalculator({reroute:a,context:b,app:c,params:d}){return __awaiter(this,void 0,void 0,function*(){const c=d.getString("id"),e=new models_1.Calculators,f=yield e.getByShortIdWithBranding(c);if(f){const a=yield metrics_1.MetricsSession.fromContext(f,b);yield metrics_1.Metrics.pushEvent(a,metrics_1.Metrics.VISIT_EVENT);const c=new models_2.Clients,d=yield c.getById(f.client_uuid);b.response.body=yield this.getInjectedCalculatorString(b,f,d),b.response.type="text/html"}else a.path="/404"})}logCalculatorEngagement({context:a,params:b,app:c,next:d}){return __awaiter(this,void 0,void 0,function*(){const{request:b,response:f}=a;yield c.koaBody(a,d);let e;try{e=JSON.parse(serve_1.requireField(b.body,"payload"))}catch(a){return serve_1.Logger.warn("error parsing engagement payload: ",a),f.status=400,void(f.message="Bad payload.")}const g=serve_1.requireField(b.body,"calculatorShortId");if(g&&e){const b=serve_1.requireNumberField(e,"input.loanAmount"),c=serve_1.requireNumberField(e,"input.downPayment"),d=serve_1.requireNumberField(e,"input.interestRate"),f=serve_1.requireIntegerField(e,"input.termLength"),h=serve_1.requireNumberField(e,"output.total"),i=yield metrics_1.MetricsSession.fromContext({shortid:g},a,{loanAmount:b,downPayment:c,interestRate:d,termLength:f,monthlyPayment:h});yield metrics_1.Metrics.pushEvent(i,metrics_1.Metrics.ENGAGEMENT_EVENT)}else throw new serve_1.ServerError(!1,"badmetric","No ID or payload.")})}logCalculatorConversion({context:a,params:b,app:c,next:d}){return __awaiter(this,void 0,void 0,function*(){const{request:b,response:f}=a;yield c.koaBody(a,d);let e;try{e=JSON.parse(serve_1.requireField(b.body,"payload"))}catch(a){return serve_1.Logger.warn("error parsing lead payload: ",a),f.status=400,void(f.message="Bad payload.")}const g=serve_1.requireField(b.body,"calculatorShortId");if(g&&e){const b=util_1.trimIfString(serve_1.requireStringField(e,"lead.firstName")),c=util_1.trimIfString(serve_1.requireStringField(e,"lead.lastName")),d=util_1.trimIfString(serve_1.getStringField(e,"lead.phoneNumber")),f=util_1.trimIfString(serve_1.getStringField(e,"lead.emailAddress")),h=util_1.trimIfString(serve_1.getStringField(e,"lead.loanType"));if(!d&&1>d.trim().length&&!f&&1>f.trim().length)throw new serve_1.ServerError(!1,"badfields","Must provide phone number or email address.");const i=serve_1.requireNumberField(e,"input.loanAmount"),j=serve_1.requireNumberField(e,"input.downPayment"),k=serve_1.requireNumberField(e,"input.interestRate"),l=serve_1.requireIntegerField(e,"input.termLength"),m=serve_1.requireNumberField(e,"output.total"),n=yield metrics_1.MetricsSession.fromContext({shortid:g},a,{loanAmount:i,downPayment:j,interestRate:k,termLength:l,monthlyPayment:m,loanType:h,calculatorShortId:g}),o={calculator_uuid:n.calculatorUUID,client_uuid:n.clientUUID,email_address:f,first_name:b,last_name:c,metadata:{loanAmount:i,downPayment:j,interestRate:k,termLength:l,monthlyPayment:m,loanType:h},phone_number:d,session_uuid:n.sessionId,visitor_uuid:n.visitorId},p=new models_3.Leads;let q=!1;if(!this.ignoreDuplicateLeads)try{const b=a.cookies.get("app:last-lead",{signed:!0});if(b&&b.length){const a=yield p.getById(b);a&&util_1.isDuplicateLead(a,o)&&(serve_1.Logger.debug("Skipping lead because it is a duplicate of %s.",a.uuid),q=!0)}}catch(a){serve_1.Logger.error("Error while checking for duplicate lead: ",a)}if(!q){const b=yield p.createLead(o);yield metrics_1.Metrics.pushEvent(n,metrics_1.Metrics.CONVERSION_EVENT),a.cookies.set("app:last-lead",b.uuid,{signed:!0,httpOnly:!0}),serve_1.Logger.debug("Created and tracked new lead: %s",b.uuid)}}else throw new serve_1.ServerError(!1,"badmetric","No ID or payload.")})}previewCalculator({reroute:a,context:b,app:c,params:d}){return __awaiter(this,void 0,void 0,function*(){this.calculatorTemplateLoaded||(yield this.loadCalculatorTemplate(),this.calculatorTemplateLoaded=!0);const a=`
            <script type="text/javascript">
                window["__ijcinfo__"] = { preview: true };
            </script>
        `;b.response.body=this.calculatorTemplateStart+a+this.calculatorTemplateEnd,b.response.type="text/html"})}pageTab({reroute:a,context:b,app:c,params:d}){return __awaiter(this,void 0,void 0,function*(){const{request:a,response:e}=b,f=new models_2.Clients;let g,h=!0;if(d.cuuid)g=yield f.getById(d.cuuid);else{yield c.koaBody(b,()=>Promise.resolve(null));const d=serve_1.requireStringField(a.body,"signed_request"),e=util_1.parseFacebookSignedRequest(d,this.facebookAppSecret);let h=null;e.page&&"object"==typeof e.page&&e.page.id&&"string"==typeof e.page.id&&(h=e.page.id),h&&(g=yield f.getClientBrandingForFacebookId(h))}if(g){const a=new models_1.Calculators,b=yield a.listCalculators(g.uuid,0,16);b.forEach((a)=>{a.calc_type=util_1.formatCalculatorTypeId(a.calc_type)}),e.body=c.views.render("calculator-list",{client:g,calculators:b,meta:{backURL:encodeURIComponent("/fbpagetab/"+g.uuid)}}),e.status=200,h=!1}h&&(e.body=c.views.render("404"),e.status=404)})}removePageTab({reroute:a,context:b,app:c,params:d}){return __awaiter(this,void 0,void 0,function*(){const a=d.cuuid;if(!a)throw new serve_1.ServerError(!1,"no-client-uuid","There was no client UUID provided");const c=d.fbid;if(!c)throw new serve_1.ServerError(!1,"no-page-id","There was no page ID provided");const e=new models_2.Clients,f=yield e.deleteFacebookIdForClient(a,c);b.response.body={deleted:f}})}addPageTab({reroute:a,context:b,app:c,params:d}){return __awaiter(this,void 0,void 0,function*(){const{response:a,request:c}=b,e=d.cuuid;if(!e)throw new serve_1.ServerError(!1,"no-client-uuid","There was no client UUID provided");const f=new models_2.Clients;if(c.query)for(const a in c.query)if("string"==typeof a){const b=c.query[a];if("1"===b||1===b){TABS_ADDED_REGEX.lastIndex=0;const b=TABS_ADDED_REGEX.exec(a);if(b&&b[1]){const a=b[1];f.setFacebookIdForClient(e,a),serve_1.Logger.debug("Added facebookId(%s) for client(%s).",a,e)}}}serve_1.RouteUtil.redirectPermanently(b,serve_1.RouteUtil.resolveURL("/sdash/index.html#/dash/settings/connections"))})}getInjectedCalculatorString(a,b,c){return __awaiter(this,void 0,void 0,function*(){const d={company:c.name},e=c.name||"",f={},g={};getmeta(b,"defaultDisclaimer",!0)?f.disclaimer="Annual percentage rates, terms and availability may differ based upon evaluation of credit. Additional loan rates and terms may be available. Other restrictions may apply. The figures shown are hypothetical and may not be applicable to your individual situation.":copymeta(b,f,"disclaimer"),getmeta(b,"defaultInitialPopoverText",!0)?(f.initialPopoverHeaderText=constants_1.selectStringValue(constants_1.CalculatorDefaults,"text",b.calc_type,"initialPopoverHeaderText",d),f.initialPopoverBodyText=constants_1.selectStringValue(constants_1.CalculatorDefaults,"text",b.calc_type,"initialPopoverBodyText",d)):(copymeta(b,f,"initialPopoverHeaderText"),copymeta(b,f,"initialPopoverBodyText")),copymeta(b,f,"applyRedirectText"),copymeta(b,f,"applyRedirect"),util_1.isStringWithContent(f.applyRedirectText)||(f.applyRedirectText=`${e} Loan Application`),b.branding_img&&(f.logo=util_1.createUploadStaticURL(a,b.branding_img)),copymeta(b,g,"defaultLoanAmount"),copymeta(b,g,"minLoanAmount"),copymeta(b,g,"maxLoanAmount"),copymeta(b,g,"minDownPayment"),copymeta(b,g,"defaultDownPayment"),copymeta(b,g,"minTermLength"),copymeta(b,g,"defaultTermLength"),copymeta(b,g,"maxTermLength"),copymeta(b,g,"minInterestRate"),copymeta(b,g,"defaultInterestRate"),copymeta(b,g,"maxInterestRate"),copymeta(b,g,"calculatorType"),copymeta(b,g,"loanAmountName")||(g.loanAmountName=constants_1.selectStringValue(constants_1.CalculatorDefaults,"labels",b.calc_type,"loanAmountLabel",d)),copymeta(b,g,"downPaymentName")||(g.downPaymentName=constants_1.selectStringValue(constants_1.CalculatorDefaults,"labels",b.calc_type,"downPaymentLabel",d)),copymeta(b,g,"interestRateName")||(g.interestRateName=constants_1.selectStringValue(constants_1.CalculatorDefaults,"labels",b.calc_type,"interestRateLabel",d)),copymeta(b,g,"termInterests");const h=JSON.stringify({branding:f,calculator:g,calculatorShortId:b.shortid}),i=`
            <script type="text/javascript">
                window["__ijcinfo__"] = ${h};
            </script>
        `;return this.calculatorTemplateLoaded||(yield this.loadCalculatorTemplate(),this.calculatorTemplateLoaded=!0),this.calculatorTemplateStart+i+this.calculatorTemplateEnd})}loadCalculatorTemplate(){return __awaiter(this,void 0,void 0,function*(){serve_1.Logger.info("Loading calculator template...");const a=(yield FS.readFile("./static/calc/index.html")).toString("utf-8"),b=a.indexOf("</head>");this.calculatorTemplateStart=a.substr(0,b),this.calculatorTemplateEnd=a.substr(b),serve_1.Logger.info("Loaded calculator template.")})}}__decorate([serve_1.post("/calc/randvisits/:id/:count/:from/:to")],CalculatorController.prototype,"randVisitGenerator",null),__decorate([serve_1.post("/calc/:id",100)],CalculatorController.prototype,"getCalculatorPost",null),__decorate([serve_1.get("/calc/:id",100)],CalculatorController.prototype,"getCalculator",null),__decorate([serve_1.post("/calcmetric/engage")],CalculatorController.prototype,"logCalculatorEngagement",null),__decorate([serve_1.post("/calcmetric/lead")],CalculatorController.prototype,"logCalculatorConversion",null),__decorate([serve_1.get("/calc-preview")],CalculatorController.prototype,"previewCalculator",null),__decorate([serve_1.get("/fbpagetab/:cuuid"),serve_1.post("/fbpagetab")],CalculatorController.prototype,"pageTab",null),__decorate([serve_1.post("/fbtabremove/:cuuid/:fbid")],CalculatorController.prototype,"removePageTab",null),__decorate([serve_1.get("/fbtabconnected/:cuuid")],CalculatorController.prototype,"addPageTab",null),exports.default=CalculatorController;
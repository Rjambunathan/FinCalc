"use strict";var __decorate=this&&this.__decorate||function(a,b,e,f){var g,d=arguments.length,c=3>d?b:null===f?f=Object.getOwnPropertyDescriptor(b,e):f;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(a,b,e,f);else for(var h=a.length-1;0<=h;h--)(g=a[h])&&(c=(3>d?g(c):3<d?g(b,e,c):g(b,e))||c);return 3<d&&c&&Object.defineProperty(b,e,c),c},__awaiter=this&&this.__awaiter||function(a,b,c,d){return new(c||(c=Promise))(function(e,f){function g(a){try{i(d.next(a))}catch(a){f(a)}}function h(a){try{i(d["throw"](a))}catch(a){f(a)}}function i(a){a.done?e(a.value):new c(function(b){b(a.value)}).then(g,h)}i((d=d.apply(a,b||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const serve_1=require("../serve"),db_files_1=require("../util/db-files"),Path=require("path"),FileSystem=require("mz/fs"),config=require("config"),api_1=require("./api"),file_filtering_1=require("../util/file-filtering");class UploadController extends serve_1.Controller{constructor(){super(),this.acceptedMimeTypes=new Set(["image/gif","image/jpeg","image/png","image/svg+xml"]),this.errorHandler=new api_1.ApiErrorHandler,this.setupUploadDir()}getIndex({context:a,app:b,next:c,params:d}){return __awaiter(this,void 0,void 0,function*(){const e=serve_1.requireStringField(d,"tag","tag");yield b.koaBody(a,c);const{request:f,response:g}=a,h=f.body.files;if(h&&h.upload){const b=yield this.createServerFile(h.upload,e);a.body={filepath:b}}else throw new serve_1.ServerError(!1,"bad-upload","No file uploaded.")})}createServerFile(a,b){return __awaiter(this,void 0,void 0,function*(){const c=a.path,d=a.type;if(!d||"string"!=typeof d||!this.acceptedMimeTypes.has(d))throw serve_1.Logger.debug(`File uploaded with bad mime type: ${d}`),new serve_1.ServerError(!1,"bad-upload","Unexpected file type.");const e=file_filtering_1.getTaggedFileProcessor(b);let f,g=null;if(e){const h=a.name,i=this.extractExtension(h)||this.extractExtension(c)||"";f=yield db_files_1.reserveFile("uploads",e.getDestinationExt(h,i,d),b);const j=Path.resolve(".",this.uploadDir,f);if(e.checkMimeType(d))try{(yield e.process(c,j))||(g=`Could not process file as a ${b}`)}catch(a){g=`Error while processing file as a ${b}`,serve_1.Logger.error("Error processing uploaded '%s' (type: %s) file.",b,d,a)}else g=`File uploaded with bad mime type '${d}' for tag '${b}'.`}if(yield FileSystem.unlink(c),g)throw new serve_1.ServerError(!1,"bad-upload",g);return f})}extractExtension(a){const b=Path.extname(a);return 0<b.length?b.substr(1):null}setupUploadDir(){this.uploadDir=config.get("server.uploadDir"),FileSystem.existsSync(this.uploadDir)?serve_1.Logger.info("Found upload directory at %s",this.uploadDir):(FileSystem.mkdirSync(this.uploadDir),serve_1.Logger.info("Created upload directory at %s",this.uploadDir))}getErrorHandler(){return this.errorHandler}}__decorate([serve_1.post("/upload/:tag")],UploadController.prototype,"getIndex",null),exports.default=UploadController;
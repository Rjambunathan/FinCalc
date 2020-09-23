"use strict";var __awaiter=this&&this.__awaiter||function(a,b,c,d){return new(c||(c=Promise))(function(e,f){function g(a){try{i(d.next(a))}catch(a){f(a)}}function h(a){try{i(d["throw"](a))}catch(a){f(a)}}function i(a){a.done?e(a.value):new c(function(b){b(a.value)}).then(g,h)}i((d=d.apply(a,b||[])).next())})};Object.defineProperty(exports,"__esModule",{value:!0});const bcrypt=require("bcrypt"),crypto=require("crypto"),jwt=require("jsonwebtoken"),BCRYPT_SALT_ROUNDS=12,SECRET_KEY="1c5421776fddabde18694e32612565aab6d5312f1306b90ba157cdbbba6cce1c";function preHashPassword(a){const b=crypto.createHash("sha256");return b.update(a),b.digest("hex")}function hashPassword(a){return __awaiter(this,void 0,void 0,function*(){return yield bcrypt.hash(a,BCRYPT_SALT_ROUNDS)})}function preparePassword(a){return __awaiter(this,void 0,void 0,function*(){const b=preHashPassword(a),c=yield hashPassword(b);return c})}exports.preparePassword=preparePassword;function comparePassword(a,b){return __awaiter(this,void 0,void 0,function*(){const c=preHashPassword(b);return yield bcrypt.compare(c,a)})}exports.comparePassword=comparePassword;function generateToken(a,b="5m"){return new Promise((c,d)=>{jwt.sign({userId:a},SECRET_KEY,{algorithm:"HS256",expiresIn:b},(a,b)=>{a?d(a):c(b)})})}exports.generateToken=generateToken;function verifyToken(a){return new Promise((b,c)=>{jwt.verify(a,SECRET_KEY,{algorithms:["HS256"]},(a,d)=>{a?c(a):d&&d.userId?b(d.userId):c(new Error("User ID not found in verified token!"))})})}exports.verifyToken=verifyToken;
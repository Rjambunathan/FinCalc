"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const logger_1=require("./logger"),PGPromise=require("pg-promise"),config=require("config"),moment=require("moment"),TIMESTAMPTZ_OID=1184,TIMESTAMP_OID=1114,options={query:(a)=>{logger_1.default.info("query:\n",a.query)},error:(a)=>{a.cn&&a.query?logger_1.default.error("connection:\n%o\nquery:\n%o",a.cn,a.query):a.cn?logger_1.default.error("connection:\n%o",a.cn):a.query&&logger_1.default.info("query:\n",a.query)}},pgp=PGPromise(options);pgp.pg.types.setTypeParser(TIMESTAMP_OID,(a)=>moment.utc(a)),pgp.pg.types.setTypeParser(TIMESTAMPTZ_OID,(a)=>moment(a));const dbConfig=config.get("db");logger_1.default.info(`Connecting to database: postgres://${dbConfig.user}@${dbConfig.host}/${dbConfig.name}`);const connection={host:dbConfig.host,port:dbConfig.port,database:dbConfig.name,password:dbConfig.password,user:dbConfig.user};exports.db=pgp(connection);
import express, {Application, Express, Request, Response, NextFunction, ErrorRequestHandler} from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import Database from "./services/database/database";
import Routes from './routes/v1';
import RequestValidations from "./validations/request";
import Path from 'path';
import ExpressFileUpload from 'express-fileupload';

declare global {
    namespace NodeJS {
        interface Global {
            database: Database;
            appRoot: any;
        }
    }
}

class App {
    public express: express.Application;
    readonly requestValidations: RequestValidations;

    constructor() {
        this.express = express();
        this.requestValidations = new RequestValidations(this.express);

        this.setEnvironment();
        this.database();
        this.middleware();
        this.publicFiles();
        this.routes();
    }

    private publicFiles() {
        global.appRoot = require('app-root-path');

        this.express.set('views', Path.join(__dirname, 'views'));
        this.express.set('view engine', 'jade');
        this.express.use(express.static(Path.join(__dirname, '../public')));

        console.log('express');
    }

    private middleware() {
        this.express.use(cors());

        this.requestValidations.applyMalformedJSONHandlerMiddleware();
        this.express.use(bodyParser.json());
        this.express.use(ExpressFileUpload());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.validationMiddleware(this.express);

    }

    private database(): void {
        global.database = new Database();
    }

    private setEnvironment() {
        dotenv.config();
    }

    private routes() {
        this.express.use('/api/v1', new Routes().getRoutes());

        this.express.get('*', function(req, res) {
            res.sendFile( Path.join(__dirname, '../public/index.html') );
            // res.sendFile( Path.join(__dirname, '../public/index.html') );
        });
    }

    private validationMiddleware(app: Application) {
        this.express = new RequestValidations(this.express).bootstrap();
    }
}

export default new App().express;

import {Application, Router, Request, Response, NextFunction, ErrorRequestHandler} from "express";

export default class RequestValidations {

    readonly app: any;

    constructor(app: any) {
        this.app = app;
    }

    /**
     * This class will bootstrap my request object with all it's needed.
     */
    public bootstrap(): Application {
        this.app.use('*', this.getRequestMethod);

        return this.app;
    }

    private getRequestMethod(req: any, res: Response, next: NextFunction) {
        req.hello = () => {
            console.log('hello!');
        };

        next();
    }

    public applyMalformedJSONHandlerMiddleware() {
        this.app.use (function (error: any, req: Request, res: Response, next: NextFunction){
            if (error) {
                if (req.method === "POST") {
                    return res.send('Malformed JSON error');
                }
            }

            next();
        });
    }

    /*static handleJSONSyntaxErrors(req: Request, res: Response, err: ErrorRequestHandler) {
        if (err) {

        }
    }*/
}

import {Response} from "express";

export default class ResponseBuilderUtility {
    static responseBuilder(res: Response, httpCode: number, responseMessage: any, data: any): void {
        res.status(httpCode).send({
            httpCode: httpCode,
            responseMessage: responseMessage,
            data: data
        });

        return;
    }
}

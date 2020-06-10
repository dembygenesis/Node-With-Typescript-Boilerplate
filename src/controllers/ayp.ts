import {Request, Response} from "express";
import AypService from "../services/ayp";
import ResponseBuilderUtility from "../utilities/response";
import {validationResult} from "express-validator";

import "reflect-metadata";
import {autoInjectable} from "tsyringe";

@autoInjectable()
class AypController {

    constructor(
        readonly service?: AypService
    ) {
        
    }

    update = async (req: Request, res: Response) => {
        try {
            const params = {
                id: req.body.id,
                part_number: req.body.part_number,
                old_part_number: req.body.old_part_number,
                discount_code: req.body.discount_code,
                srp: req.body.srp,
                part_description: req.body.part_description,
                applicable_model: req.body.applicable_model,
                block_no: req.body.block_no,
                line_no: req.body.line_no,
                pcs: req.body.pcs,
                amount: req.body.amount,
            };

            const data = await this.service?.update(params);

            return ResponseBuilderUtility.responseBuilder(
                res,
                200,
                'Here is your data',
                data
            );
        } catch (e) {
            return ResponseBuilderUtility.responseBuilder(
                res,
                500,
                'Something went wrong',
                {
                    errors: [e]
                }
            );
        }
    };

    getAll = async (req: Request, res: Response) => {
        try {
            const data = await this.service?.getAll();

            return ResponseBuilderUtility.responseBuilder(
                res,
                200,
                'Here is your data',
                data
            );
        } catch (e) {

            return ResponseBuilderUtility.responseBuilder(
                res,
                500,
                'Database Error',
                {
                    errors: [e]
                }
            );
        }
    };
}

export default AypController;

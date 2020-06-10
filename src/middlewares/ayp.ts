import {Router, Request, Response, NextFunction} from "express";
import {strict as Assert} from 'assert';
import {check, validationResult} from 'express-validator';

export default class AypMiddleware {

    /**
     * Async validation methods.
     */

    getValidations = () => [

        check('partNumber').notEmpty(),
        check('oldPartNumber').notEmpty(),
        check('discountCode').notEmpty(),
        check('srp').notEmpty(),
        check('partDescription').notEmpty(),
        check('applicableModel').notEmpty(),
        check('blockNo').notEmpty(),
        check('lineNo').notEmpty(),
        check('pcs').notEmpty(),
        check('amount').isNumeric(),
    ];

    private checkVariables() {

    }
}

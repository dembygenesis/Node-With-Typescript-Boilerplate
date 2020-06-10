import {Router, Request, Response, NextFunction} from "express";
import {strict as Assert} from 'assert';
import {check, validationResult} from 'express-validator';
import ValidationUtility from "../../utilities/validation";
import ResponseBuilderUtility from "../../utilities/response";

export default class ProductMiddleware {

    /**
     * Async validation methods.
     */

    getValidations = () => [

    ];

    getIdValidations = () => {
        const validations = [
            check('id').notEmpty()
                .withMessage('must not be empty')
                .bail()
                .custom(async value => {
                    const exists = await ValidationUtility.isExistingAndActive(
                        'product',
                        'id',
                        value
                    );

                    if (!exists) {
                        throw "must be existing";
                    }
                })
            ,
        ];

        return async (req: Request, res: Response, next: NextFunction) => {
            await Promise.all(validations.map(validation => validation.run(req)));

            const errors:any = validationResult(req);
            if (errors.isEmpty()) {
                return next();
            } else {
                const trimmedErrors = [];
                const errorOutput = errors['errors'];

                for (let i in errorOutput) {
                    trimmedErrors.push({
                        [errorOutput[i]['param']]: errorOutput[i]['msg']
                    })
                }

                return ResponseBuilderUtility.responseBuilder(
                    res,
                    422,
                    "Errors",
                    {errors: trimmedErrors}
                );
            }
        };
    };

    getPostValidations = () => {
        const validations = [
            check('name').notEmpty()
                .withMessage('must not be empty')
                .bail()
                .custom(async value => {
                    const exists = await ValidationUtility.isExisting(
                        'product',
                        'name',
                        value
                    );

                    if (exists) {
                        throw "must not be existing";
                    }
                })
            ,
            check('product_type_id')
                .notEmpty()
                .withMessage('must not be empty')
                .bail()
                .custom(async value => {
                    const exists = await ValidationUtility.isExisting(
                        'product_type',
                        'id',
                        value
                    );

                    if (!exists) {
                        throw "must be existing";
                    }
                }),
        ];

        return async (req: Request, res: Response, next: NextFunction) => {
            await Promise.all(validations.map(validation => validation.run(req)));

            const errors:any = validationResult(req);
            if (errors.isEmpty()) {
                if (!ValidationUtility.objectChecker(req, ['files', 'image'])) {
                    return ResponseBuilderUtility.responseBuilder(
                        res,
                        422,
                        "Errors",
                        {errors: ["No 'image' found in file parameters"]}
                    );
                }

                return next();
            } else {
                const trimmedErrors = [];
                const errorOutput = errors['errors'];

                for (let i in errorOutput) {
                    trimmedErrors.push({
                        [errorOutput[i]['param']]: errorOutput[i]['msg']
                    })
                }

                return ResponseBuilderUtility.responseBuilder(
                    res,
                    422,
                    "Errors",
                    {errors: trimmedErrors}
                );
            }
        };
    };

    getPutValidations = () => {
        const validations = [
            check('name').notEmpty()
                .withMessage('must not be empty')
                .bail()
                .custom(async (value, {req}) => {
                    const exists = await ValidationUtility.isExistingNotOwn(
                        req.body.id,
                        'product',
                        'name',
                        value
                    );

                    if (exists) {
                        throw "must be unique";
                    }

                    return;
                }),
            check('product_type_id')
                .notEmpty()
                .withMessage('must not be empty')
                .custom(async value => {
                    const exists = await ValidationUtility.isExisting(
                        'product_type',
                        'id',
                        value
                    );

                    if (!exists) {
                        throw "must be existing";
                    }
                }),
        ];

        return async (req: Request, res: Response, next: NextFunction) => {
            await Promise.all(validations.map(validation => validation.run(req)));

            const errors:any = validationResult(req);
            if (errors.isEmpty()) {
                // Route must work with/without images
                if (ValidationUtility.objectChecker(req, ['files'])) {
                    if (!ValidationUtility.objectChecker(req, ['files', 'image'])) {
                        return ResponseBuilderUtility.responseBuilder(
                            res,
                            422,
                            "Errors",
                            {errors: ["No 'image' found in file parameters"]}
                        );
                    }
                }

                return next();
            } else {
                const trimmedErrors = [];
                const errorOutput = errors['errors'];

                for (let i in errorOutput) {
                    trimmedErrors.push({
                        [errorOutput[i]['param']]: errorOutput[i]['msg']
                    })
                }

                return ResponseBuilderUtility.responseBuilder(
                    res,
                    422,
                    "Errors",
                    {errors: trimmedErrors}
                );
            }
        };
    };

    private checkVariables() {

    }
}

import {Router, Request, Response, NextFunction} from "express";
import {strict as Assert} from 'assert';
import {check, validationResult} from 'express-validator';
import ResponseBuilderUtility from "../utilities/response";
import ValidationUtility from "../utilities/validation";
import UserService from "../services/user";

export default class UserMiddleware {

    /**
     * Async validation methods.
     */

    private service = new UserService();

    getPostValidations = () => {
        const validations = [
            check('firstname').notEmpty().withMessage('must not be empty'),
            check('lastname').notEmpty(),
            check('email').notEmpty()
                .isEmail()
                .withMessage('must be a valid email')
                .bail()
                .custom(async value => {
                    const exists = await ValidationUtility.isExisting(
                        'user',
                        'email',
                        value
                    );

                    if (exists) {
                        throw "must be unique";
                    }
                }),
            check('mobile_number').notEmpty().withMessage('must not be empty'),
            check('password').notEmpty().withMessage('must not be empty'),
            check('user_type_id').notEmpty()
                .withMessage('must be a valid email')
                .bail()
                .custom(async value => {

                    const exists = await ValidationUtility.isExisting(
                        'user_type',
                        'id',
                        value
                    );

                    if (!exists) {
                        throw "must be valid";
                    }
                })
            ,
            check('bank_type_id')
                .notEmpty()
                .withMessage('must not be empty')
                .custom(async value => {
                    const exists = await ValidationUtility.isExisting(
                        'bank_type',
                        'id',
                        value
                    );

                    if (!exists) {
                        throw "must be existing";
                    }
                }),
            check('bank_no')
                .notEmpty()
                .withMessage('must not be empty'),

            // New good
            check('address')
                .notEmpty()
                .withMessage('must not be empty'),

            check('birthday')
                .notEmpty()
                .withMessage('must not be empty'),

            check('gender')
                .notEmpty()
                .withMessage('must not be empty')
                .bail()
                .custom((value, { req }) => {
                    if (!['M', 'F'].includes(value)) {
                        throw "must be M or F"
                    }

                    return true;
                }),

            check('m88_account')
                .notEmpty()
                .withMessage('must not be empty'),
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

    getDeleteValidations = () => {
        const validations = [
            check('id').notEmpty()
                .withMessage('must not be empty')
                .bail()
                .custom(async (value, {req}) => {
                    const exists = await ValidationUtility.isExisting(
                        'user',
                        'id',
                        value
                    );

                    if (!exists) {
                        throw "must be valid";
                    }

                    // Also throw the constraint that you can't delete the last admin account.
                    const role = req.user[0].role;

                    if (role === 'Admin') {
                        const isNotLastAdmin: boolean = await this.service.isNotLastAdmin();

                        if (!isNotLastAdmin) {
                            throw "you cannot delete the last admin user";
                        }
                    }
                }),
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

    getPutValidations = () => {
        const validations = [
            check('id').notEmpty()
                .withMessage('must not be empty')
                .bail()
                .custom(async (value, {req}) => {
                    const exists = await ValidationUtility.isExisting(
                        'user',
                        'id',
                        value
                    );

                    if (!exists) {
                        throw "must be valid";
                    }
                }),
            check('firstname').notEmpty().withMessage('must not be empty'),
            check('lastname').notEmpty(),
            check('email').notEmpty()
                .isEmail()
                .withMessage('must be a valid email')
                .bail()
                .custom(async (value, {req}) => {
                    console.log('req.body.id', req.body.id);
                    const exists = await ValidationUtility.isExistingNotOwn(
                        req.body.id,
                        'user',
                        'email',
                        value
                    );

                    if (exists) {
                        throw "must be unique";
                    }
                }),
            check('mobile_number').notEmpty().withMessage('must not be empty'),
            check('password').notEmpty().withMessage('must not be empty'),
            check('user_type_id').notEmpty()
                .withMessage('must be a valid email')
                .bail()
                .custom(async value => {

                    const exists = await ValidationUtility.isExisting(
                        'user_type',
                        'id',
                        value
                    );

                    if (!exists) {
                        throw "must be valid";
                    }
                })
            ,
            check('bank_type_id')
                .notEmpty()
                .withMessage('must not be empty')
                .custom(async value => {
                    const exists = await ValidationUtility.isExisting(
                        'bank_type',
                        'id',
                        value
                    );

                    if (!exists) {
                        throw "must be existing";
                    }
                }),
            check('bank_no')
                .notEmpty()
                .withMessage('must not be empty'),

            // New good
            check('address')
                .notEmpty()
                .withMessage('must not be empty'),

            check('birthday')
                .notEmpty()
                .withMessage('must not be empty'),

            check('gender')
                .notEmpty()
                .withMessage('must not be empty')
                .bail()
                .custom((value, { req }) => {
                    if (!['M', 'F'].includes(value)) {
                        throw "must be M or F"
                    }

                    return true;
                }),

            check('m88_account')
                .notEmpty()
                .withMessage('must not be empty'),
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

    private checkVariables() {

    }
}

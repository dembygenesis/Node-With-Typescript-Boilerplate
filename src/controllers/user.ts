import {Request, Response} from "express";
import UserService from "../services/user";
import ResponseBuilderUtility from "../utilities/response";

import "reflect-metadata";
import {autoInjectable} from "tsyringe";
import StringUtility from "../utilities/string";
import AuthUtility from "../utilities/auth";

@autoInjectable()
class UserController {

    constructor(
        readonly service?: UserService
    ) {

    }

    delete = async (req: Request, res: Response) => {
        try {
            const data = await this.service?.delete(req.body);

            return ResponseBuilderUtility.responseBuilder(
                res,
                200,
                "Successfully Deleted The User",
                ['Successfully Deleted The User']
            );
        } catch (e) {
            return ResponseBuilderUtility.responseBuilder(
                res,
                422,
                "Failed to delete the user",
                {
                    errors: [e]
                }
            );
        }
    };

    add = async (req: Request, res: Response) => {
        try {
            const data = await this.service?.add(req.body);

            return ResponseBuilderUtility.responseBuilder(
                res,
                201,
                "Successfully Added The User",
                ['Successfully Added The User']
            );
        } catch (e) {
            return ResponseBuilderUtility.responseBuilder(
                res,
                422,
                "Failed to add the user",
                {
                    errors: [e]
                }
            );
        }
    };

    getAllBankTypes = async (req: Request, res: Response) => {
        try {
            const data = await this.service?.getBankTypes();

            return ResponseBuilderUtility.responseBuilder(
                res,
                200,
                "Here's your bank types",
                data
            );
        } catch (e) {
            return ResponseBuilderUtility.responseBuilder(
                res,
                422,
                "Errors",
                {
                    errors: [e]
                }
            );
        }
    };

    getAllUserTypes = async (req: Request, res: Response) => {
        try {
            const data = await this.service?.getUserTypes();

            if (!data) {
                return ResponseBuilderUtility.responseBuilder(
                    res,
                    422,
                    "Errors",
                    {
                        errors: ['Login Failed. Invalid email/password']
                    }
                );
            }

            return ResponseBuilderUtility.responseBuilder(
                res,
                200,
                "Here's your user types",
                data
            );
        } catch (e) {
            return ResponseBuilderUtility.responseBuilder(
                res,
                422,
                "Errors",
                {
                    errors: [e]
                }
            );
        }
    };

    getOne = async (req: Request, res: Response) => {
        try {

            const data: any = await this.service?.getOne(req.params);

            if (data.length === 0) {
                return ResponseBuilderUtility.responseBuilder(
                    res,
                    200,
                    "Errors",
                    {
                        errors: ['There was no specific user found']
                    }
                );
            }

            return ResponseBuilderUtility.responseBuilder(
                res,
                200,
                "Here's your user",
                data
            );
        } catch (e) {
            return ResponseBuilderUtility.responseBuilder(
                res,
                422,
                "Errors",
                {
                    errors: [e]
                }
            );
        }
    };

    getAll = async (req: Request, res: Response) => {
        try {
            const data = await this.service?.get();

            if (!data) {
                return ResponseBuilderUtility.responseBuilder(
                    res,
                    422,
                    "Errors",
                    {
                        errors: ['Login Failed. Invalid email/password']
                    }
                );
            }

            return ResponseBuilderUtility.responseBuilder(
                res,
                200,
                "Here's your users",
                data
            );
        } catch (e) {
            return ResponseBuilderUtility.responseBuilder(
                res,
                422,
                "Errors",
                {
                    errors: [e]
                }
            );
        }
    };


    update = async (req: Request, res: Response) => {

        try {
            const userInfo = await this.service?.update(req.body);

            if (!userInfo) {
                return ResponseBuilderUtility.responseBuilder(
                    res,
                    422,
                    'Errors',
                    {
                        errors: ['Login Failed. Invalid email/password']
                    }
                );
            }

            return ResponseBuilderUtility.responseBuilder(
                res,
                201,
                "Successfully updated the user",
                ["Successfully updated the user"]
            );
        } catch (e) {
            console.log('e', e);
            return ResponseBuilderUtility.responseBuilder(
                res,
                500,
                "Something went wrong whe trying to update the user",
                {
                    e
                }
            );
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const userInfo = await this.service?.login(req.body);

            if (!userInfo) {
                return ResponseBuilderUtility.responseBuilder(
                    res,
                    422,
                    'Errors',
                    {
                        errors: ['Login Failed. Invalid email/password']
                    }
                );
            }

            return ResponseBuilderUtility.responseBuilder(
                res,
                200,
                "Here's your token",
                {
                    userInfo
                }
            );
        } catch (e) {
            return ResponseBuilderUtility.responseBuilder(
                res,
                500,
                "Something went wrong",
                {
                    e
                }
            );
        }
    };

    createAdmin = async (req: Request, res: Response) => {
        try {

            const {
                firstname,
                lastname,
                email,
                mobile_number,
                password,
                role,
                bank,
                bank_no,
            } = JSON.parse(StringUtility.getEnv('ADMIN_DEFAULT_CREDS'));

            let user_type_id: any = await global.database.query(`SELECT id FROM user_type WHERE name = ?`, [role]);
            let bank_type_id: any = await global.database.query(`SELECT id FROM bank_type WHERE name = ?`, [bank]);

            user_type_id = user_type_id[0]['id'];
            bank_type_id = bank_type_id[0]['id'];

            console.log({user_type_id, bank_type_id});

            const sql = `
                INSERT INTO user (firstname, lastname, email, mobile_number, password, user_type_id, bank_type_id, bank_no)
                VALUES (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )
            `;

            try {
                const deleteUsers = await global.database.query('DELETE FROM user');
                const insertAdminUser = await global.database.query(sql, [
                    firstname,
                    lastname,
                    email,
                    mobile_number,
                    await AuthUtility.getHashed(password),
                    user_type_id,
                    bank_type_id,
                    bank_no,
                ], true);

                return ResponseBuilderUtility.responseBuilder(
                    res,
                    201,
                    "Admin Created",
                    ['Admin Created!']
                );
            } catch (e) {
                return ResponseBuilderUtility.responseBuilder(
                    res,
                    422,
                    'Errors',
                    {
                        errors: ['Admin migration failed', e]
                    }
                );
            }
        } catch (e) {
            return ResponseBuilderUtility.responseBuilder(
                res,
                500,
                "Something went wrong",
                {
                    e
                }
            );
        }
    };


}

export default UserController;

import {Request, Response} from "express";
import ResponseBuilderUtility from "../utilities/response";

import "reflect-metadata";
import {autoInjectable} from "tsyringe";
import ProductService from "../services/product";

@autoInjectable()
class ProductController {

    constructor(
        readonly service?: ProductService
    ) {

    }

    update = async (req: Request, res: Response) => {
        try {
            const data = await this.service?.update(req);

            return ResponseBuilderUtility.responseBuilder(
                res,
                200,
                "Successfully Updated The Product",
                ['Successfully Updated The Product']
            );
        } catch (e) {
            return ResponseBuilderUtility.responseBuilder(
                res,
                422,
                "Failed to delete the product",
                {
                    errors: [e]
                }
            );
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const data = await this.service?.deleteProduct(req.body);

            return ResponseBuilderUtility.responseBuilder(
                res,
                200,
                "Successfully Deleted The Product",
                ['Successfully Deleted The Product']
            );
        } catch (e) {
            return ResponseBuilderUtility.responseBuilder(
                res,
                422,
                "Failed to delete the product",
                {
                    errors: [e]
                }
            );
        }
    };

    add = async (req: Request, res: Response) => {
        try {
            const data = await this.service?.add(req);

            if (!data) {
                return ResponseBuilderUtility.responseBuilder(
                    res,
                    422,
                    "Errors",
                    {
                        errors: ['Something went wrong.']
                    }
                );
            }

            return ResponseBuilderUtility.responseBuilder(
                res,
                200,
                "Here's your products",
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

    getAllProductTypes = async (req: Request, res: Response) => {
        try {
            const data = await this.service?.getAllProductTypes();

            if (!data) {
                return ResponseBuilderUtility.responseBuilder(
                    res,
                    422,
                    "Errors",
                    {
                        errors: ['Something went wrong.']
                    }
                );
            }

            return ResponseBuilderUtility.responseBuilder(
                res,
                200,
                "Here's your products",
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
            const data = await this.service?.getOne(req.params);

            if (data.length === 0) {
                return ResponseBuilderUtility.responseBuilder(
                    res,
                    200,
                    "Errors",
                    {
                        errors: ['There was no specific product found']
                    }
                );
            }

            return ResponseBuilderUtility.responseBuilder(
                res,
                200,
                "Here's your product",
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
                        errors: ['Something went wrong.']
                    }
                );
            }

            return ResponseBuilderUtility.responseBuilder(
                res,
                200,
                "Here's your products",
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

}

export default ProductController;

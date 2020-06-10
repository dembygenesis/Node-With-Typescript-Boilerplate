import {Router} from 'express';

import ControllerClass from "../../controllers/product";
import MiddlewareClass from "../../middlewares/product";
import PassportMiddleware from "../../middlewares/passport";

export default class ProductRoutes extends PassportMiddleware{

    private router = Router();
    private controllerClass: ControllerClass;
    private middlewareClass: MiddlewareClass;

    constructor() {
        super();
        this.controllerClass = new ControllerClass();
        this.middlewareClass = new MiddlewareClass();

        this.bindRoutes();
    }

    public getRouter() {
        return this.router;
    }

    /**
     * Declare route logic
     */
    private bindRoutes() {
        this.bindGet();

        this.bindPost();

        this.bindPut();
        /*

        */


        this.bindDelete();
        this.bindGetProductCategories();

        this.bindGetOne();
    }

    private bindGet() {
        this.router.get('',
            this.getAuthMiddleware(),
            this.getRoleMiddleware(['Admin']),
            this.controllerClass.getAll
        );
    }

    private bindGetOne() {
        this.router.get('/:id',
            this.getAuthMiddleware(),
            this.getRoleMiddleware(['Admin']),
            this.middlewareClass.getIdValidations(),
            this.controllerClass.getOne
        );
    }

    private bindPost() {
        this.router.post('',
            this.getAuthMiddleware(),
            this.getRoleMiddleware(['Admin']),
            this.middlewareClass.getPostValidations(),
            this.controllerClass.add
        );
    }

    private bindDelete() {
        this.router.delete('',
            this.getAuthMiddleware(),
            this.getRoleMiddleware(['Admin']),
            this.middlewareClass.getIdValidations(),
            this.controllerClass.delete
        );
    }

    private bindPut() {
        this.router.put('',
            this.getAuthMiddleware(),
            this.getRoleMiddleware(['Admin']),
            this.middlewareClass.getIdValidations(),
            this.middlewareClass.getPutValidations(),
            this.controllerClass.update
        );
    }

    private bindGetProductCategories() {
        this.router.get('/types',
            this.getAuthMiddleware(),
            this.getRoleMiddleware(['Admin']),
            this.controllerClass.getAllProductTypes
        );
    }
}

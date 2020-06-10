import {Router} from 'express';

import ControllerClass from "../../controllers/ayp";
import MiddlewareClass from "../../middlewares/ayp";

export default class AypRoutes {

    private router = Router();
    private controllerClass: ControllerClass;
    private middlewareClass: MiddlewareClass;

    constructor() {
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
        this.bindPut();
        this.bindPost();
        this.bindDelete();
    }

    private bindGet() {
        this.router.get('',

            this.controllerClass.getAll
        );
    }

    private bindPut() {
        this.router.put('',
            this.controllerClass.update
        );
    }

    private bindPost() {
        this.router.post('',
            this.middlewareClass.getValidations(),
            this.controllerClass.update
        );
    }

    private bindDelete() {
        this.router.delete('',
            this.controllerClass.getAll
        );
    }
}

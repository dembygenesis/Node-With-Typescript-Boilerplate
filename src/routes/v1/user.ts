import {Router} from 'express';

import ControllerClass from "../../controllers/user";
import PassportMiddleware from "../../middlewares/passport";
import UserMiddleware from "../../middlewares/user";

export default class UserRoutes extends PassportMiddleware {

    private router = Router();
    private controllerClass = new ControllerClass();
    private middlewareClass = new UserMiddleware();

    constructor() {
        super();
        this.bindRoutes();
    }

    public getRouter() {
        return this.router;
    }

    /**
     * Declare route logic
     */
    private bindRoutes() {
        this.bindLogin();

        this.bindPost();
        this.bindPut();
        this.bindDelete();
        this.bindGetUserTypes();
        this.bindGetBankTypes();
        this.createAdmin();

        // I put this on the bottom because it's going to match first. hmmm
        this.bindGetOne();
        this.bindGet();
    }

    private bindLogin() {
        this.router.post('/login',
            this.getSignInMiddleware(),
            this.controllerClass.login
        );
    }

    private bindPut() {
        this.router.put('/',
            this.getAuthMiddleware(),
            this.getRoleMiddleware(['Admin']),
            this.middlewareClass.getPutValidations(),
            this.controllerClass.update
        );
    }

    private createAdmin() {
        this.router.post('/create-admin',
            // this.getSignInMiddleware(),
            this.controllerClass.createAdmin
        );
    }

    private bindGet() {
        this.router.get('/',
            this.getAuthMiddleware(),
            this.getRoleMiddleware(['Admin']),
            this.controllerClass.getAll
        );
    }

    private bindGetOne() {
        this.router.get('/:id',
            this.getAuthMiddleware(),
            this.getRoleMiddleware(['Admin']),
            this.controllerClass.getOne
        );
    }

    private bindPost() {
        this.router.post('/',
            this.getAuthMiddleware(),
            this.getRoleMiddleware(['Admin']),
            this.middlewareClass.getPostValidations(),
            this.controllerClass.add
        );
    }

    private bindDelete() {
        this.router.delete('/',
            this.getAuthMiddleware(),
            this.getRoleMiddleware(['Admin']),
            this.middlewareClass.getDeleteValidations(),
            this.controllerClass.delete
        );
    }

    private bindGetUserTypes() {
        this.router.get('/user-types',
            this.getAuthMiddleware(),
            this.controllerClass.getAllUserTypes
        );
    }

    private bindGetBankTypes() {
        this.router.get('/bank-types',
            this.getAuthMiddleware(),
            this.getRoleMiddleware(['Admin']),
            this.controllerClass.getAllBankTypes
        );
    }
}

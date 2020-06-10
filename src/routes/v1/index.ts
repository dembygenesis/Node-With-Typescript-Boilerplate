import {Router, Request, Response} from  'express';
import AypRoutes from "./ayp";
import UserRoutes from "./user";
import {check, validationResult} from 'express-validator';
import ProductRoutes from "./product";

export default class Routes {

    /**
     * Main route to return
     */
    private router: Router = Router();

    /**
     * Add route modules here
     */
    private aypRoutes = new AypRoutes();
    private userRoutes = new UserRoutes();
    private productRoutes = new ProductRoutes();

    constructor() {
        this.router.use('/ayp', this.aypRoutes.getRouter());
        this.router.use('/user', this.userRoutes.getRouter());
        this.router.use('/product', this.productRoutes.getRouter());
    }

    public getRoutes(): Router {
        return this.router;
    }

}

import { Router } from "express";
import { UserController } from "../controllers/userController";
import { AuthController } from "../controllers/authController";

export class UserRouter {
    private router: Router;
    private userController: UserController = new UserController();
    private authController: AuthController = new AuthController();

    public constructor() {
        this.router = Router();
        this.routes();
    }

    public getRouter() { return this.router; }

    private routes() {
        const bodyParser = require("body-parser");
        this.router.use(bodyParser.urlencoded({extended: true}));
        this.router.post("/register", this.userController.registerUser);
        this.router.post("/login", this.userController.loginUser);
        this.router.post("/update", this.userController.UpdateUser);
        this.router.post("/req-reset-password", this.authController.ResetPassword);
        this.router.post("/new-password", this.userController.NewPassword);
        this.router.post("/valid-password-token", this.userController.ValidPasswordToken);
    }
}

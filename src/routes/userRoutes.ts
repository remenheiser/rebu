import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { UserController } from "../controllers/userController";

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
		this.router.use(bodyParser.urlencoded({ extended: true }));
		this.router.post("/register", this.userController.registerUser);
		this.router.post("/login", this.userController.loginUser);
		this.router.post("/watchList/:id", this.authController.authenticateJWT, this.userController.addWatchList);
		this.router.delete("/watchList/:id", this.authController.authenticateJWT, this.userController.removeWatchList);
		this.router.get("/watchList/", this.authController.authenticateJWT, this.userController.getWatchList);
	}
}

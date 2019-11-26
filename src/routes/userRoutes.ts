import { Router } from "express";
import { UserController } from "../controllers/userController";

export class UserRouter {
	private router: Router;
	private userController: UserController = new UserController();

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
	}
}

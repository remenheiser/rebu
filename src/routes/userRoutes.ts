import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { UserController } from "../controllers/userController";
import { Application } from "../server";

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

		/**
		 * add user image:
		 * request-body format: form-data -> (email: (user's email), userImage: (image file))
		 *
		 * can also be use to update a user's image
		 */
		this.router.post("/userImage/", this.authController.authenticateJWT, Application.getUpload().single("userImage"),
						this.userController.addUserImage);
		/**
		 * delete user image:
		 * request-body format: json -> (email (user's email))
		 */
		this.router.delete("/userImage/", this.authController.authenticateJWT, this.userController.deleteUserImage);
	}
}

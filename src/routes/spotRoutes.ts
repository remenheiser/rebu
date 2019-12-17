import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { SpotController } from "../controllers/spotController";
import { Application } from "../server";

export class SpotRouter {
	private router: Router;
	private spotController: SpotController = new SpotController();
	private authController: AuthController = new AuthController();

	public constructor() {
		this.router = Router();
		this.routes();
	}

	public getRouter() { return this.router; }

	// Creates the routes for this router and returns a populated router object
	private routes() {
		const bodyParser = require("body-parser");
		this.router.use(bodyParser.urlencoded({ extended: true }));

		this.router.get("/spots", this.authController.authenticateJWT, this.spotController.allSpots);

		this.router.post("/spot", this.authController.authenticateJWT,
		Application.getUpload().single("spotImage"), this.spotController.addSpot);

		this.router.get("/spot/:id", this.authController.authenticateJWT, this.spotController.getSpot);
		this.router.delete("/spot/:id", this.authController.authenticateJWT, this.spotController.deleteSpot);
		this.router.post("/spot/:id", this.authController.authenticateJWT, this.spotController.updateSpot);
		this.router.get("/chosen-spot/:id", this.authController.authenticateJWT, this.spotController.getSpot);

		// - GET - /spots/images - return all META DATA, NOT THE IMAGES THEMSELVES, for all spot images in the database
		this.router.get("/spots/images", this.authController.authenticateJWT, this.spotController.allSpotImages);

		// - GET - /spots/image/:id - return the ACTUAL image itself according to the image id (the imgID property of the new spot,
		// or the filename property of the meta data )
		this.router.get("/spots/image/:id", this.spotController.getSpotImage);
	}
}

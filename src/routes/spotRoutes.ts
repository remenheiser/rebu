import { Router } from "express";
import { SpotController } from "../controllers/spotController";
import { AuthController } from "../controllers/authController";

export class SpotRouter {
    private router: Router;
    private spotController: SpotController = new SpotController();
    private authController: AuthController = new AuthController();

    public constructor() {
        this.router = Router();
        this.routes();
    }

    public getRouter() { return this.router }

    // Creates the routes for this router and returns a populated router object
    private routes() {
        const bodyParser = require("body-parser");
        this.router.use(bodyParser.urlencoded({extended: true}));
        this.router.get("/spots", this.authController.authenticateJWT, this.spotController.allSpots);
        this.router.put("/spot", this.authController.authenticateJWT, this.spotController.addSpot);
        this.router.get("/spot/:id", this.authController.authenticateJWT, this.spotController.getSpot);
        //previous spot history
        this.router.get("/spotuser/:userid", this.authController.authenticateJWT, this.spotController.getUser);
        this.router.get("/spotrating/:id", this.authController.authenticateJWT, this.spotController.getRating);
        this.router.delete("/spot/:id", this.authController.authenticateJWT, this.spotController.deleteSpot);
        this.router.post("/spot/:id", this.authController.authenticateJWT, this.spotController.updateSpot);
        this.router.get("/chosen-spot/:id", this.authController.authenticateJWT, this.spotController.getSpot);
    }
}
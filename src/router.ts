import express from "express";
import * as mongoose from "mongoose";
import {Controller} from "./controller";
import * as spotController from "./spotController";

export class ApiRouter {
    private router: express.Router = express.Router();
    private controller: Controller = new Controller();

    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {
        const bodyParser = require("body-parser");
        this.router.use(bodyParser.urlencoded({extended: true}));
        this.router.get("/hello", this.controller.getHello);
        this.router.post("/hello", this.controller.postHello);
        this.router.get("takemymoney", this.controller.getBail);
        this.router.get("/", this.controller.getHome);
        this.router.get("/spots", spotController.allSpots);
        this.router.get("/chosen-spot/:id", spotController.getSpot);
        this.router.put("/spot", spotController.addSpot);
        this.router.delete("/spot/:id", spotController.deleteSpot);
        this.router.post("/spot/:id", spotController.updateSpot);
        return this.router;
    }
}

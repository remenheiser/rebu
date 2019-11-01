import express from "express";
import * as mongoose from "mongoose";
import { Controller } from "./controller";
import * as spotController from "./spotController";
const router = require('express').Router();
import {Auth} from "./routes/auth";
import {Users} from "./models/users";
import {requireAuth} from "./passport";
import {decoder} from "./passport";

export class ApiRouter {
    private router: express.Router = express.Router();
    private controller: Controller = new Controller();

    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {
        const bodyParser = require("body-parser");
        this.router.use(bodyParser.urlencoded({ extended: true }));
        this.router.get("/hello",this.controller.getHello);
        this.router.post("/hello", this.controller.postHello);
        this.router.get("takemymoney", this.controller.getBail);
        this.router.get("/", this.controller.getHome);
        this.router.get("/spots", spotController.allSpots);
        this.router.get("/chosen-spot/:id", spotController.getSpot);
        this.router.put("/spot", spotController.addSpot);
        this.router.delete("/spot/:id", spotController.deleteSpot);
        this.router.post("/spot/:id", spotController.updateSpot);

        //POST new user route (optional, everyone has access)
        this.router.post( '/', decoder(requireAuth), (req: any, res: any, next: any) => {
            const { body: { user } } = req;
            
            if (!user.email) {
                return res.status(422).json({
                    errors: {
                        email: 'is required',
                    },
                });
            }

            if (!user.password) {
                return res.status(422).json({
                    errors: {
                        password: 'is required',
                    },
                });
            }

            const finalUser = new Users(user);

            finalUser.setPassword(user.password);

            return finalUser.save()
                .then(() => res.json({ user: finalUser.toAuthJSON() }));
        });

        //GET current route (required, only authenticated users have access)
        this.router.get('/current', decoder(requireAuth), (req: any, res: any, next: any) => {
            const { payload: { id } } = req;

            return Users.findById(id)
                .then((user: any) => {
                    if (!user) {
                        return res.sendStatus(400);
                    }

                    return res.json({ user: user.toAuthJSON() });
                });
        });

        module.exports = router;
        return this.router;
    }
}

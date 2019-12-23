import {Request, Response} from "express";
import { ISpot, Spot } from "../models/spot";

export class SpotController {

    // - GET - /spot # returns all spots
    public async allSpots(req: Request, res: Response): Promise<void> {
        const spots = await Spot.find((err: any, spots: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(spots);
            }
        });
    }

    // - GET - /spot/{1} # returns a spot with id 1
    public async getSpot(req: Request, res: Response): Promise<void> {
        await Spot.findById(req.params.id, (err: any, spot: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(spot);
            }
        });
    }

    // - GET - /spot/:id/:userid # returns all users at a given spot
    public async getUser(req: Request, res: Response): Promise<void> {
        await Spot.findById(req.params.id, (err: any, spot: any) => {
            if(err) {
                res.send(err);
            } else {
                res.send(spot.users);
            }
        });
    }

    // - GET - /spot/:id/:rating # returns rating at a given spot
    public async getRating(req: Request, res: Response): Promise<void> {
        await Spot.findById(req.params.id, (err: any, spot: any) => {
            if(err) {
                res.send(err);
            } else {
                res.send(spot.rating);
            }
        });
    }

    // - PUT - /spot # inserts a new spot into the table
    public async addSpot(req: Request, res: Response): Promise<void> {
        const spot: ISpot = new Spot(req.body);
        console.log(spot);
        await spot.save((err: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(spot);
            }
        });
    }

    // - DELETE - /spot/{1} # deletes a spot with id of 1
    public async deleteSpot(req: Request, res: Response): Promise<void> {
        await Spot.findOneAndDelete({_id: req.params.id }, (err: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully Deleted the Spot");
            }
        });
    }

    // - POST - /spot/{1} # updates a spot with id of 1
    public async updateSpot(req: Request, res: Response): Promise<void> {
        await Spot.findByIdAndUpdate(req.params.id, req.body, (err: any, spot: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully Updated the Spot");
            }
        });
    }
}

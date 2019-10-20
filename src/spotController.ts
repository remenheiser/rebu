import {Request, Response} from "express";
import Spot from "./Spot";

// - GET - /spot # returns all spots
export let allSpots = (req: Request, res: Response) => {
    const spots = Spot.find((err: any, spots: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(spots);
        }
    });
};

// - GET - /spot/{1} # returns a spot with id 1
export let getSpot = (req: Request, res: Response) => {
    Spot.findById(req.params.id, (err: any, spot: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(spot);
        }
    });
};

// - PUT - /spot # inserts a new spot into the table
export let addSpot = (req: Request, res: Response) => {
    const spot = new Spot(req.body);

    spot.save((err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send(spot);
        }
    });
};

// - DELETE - /spot/{1} # deletes a spot with id of 1
export let deleteSpot = (req: Request, res: Response) => {
    Spot.deleteOne({_id: req.params.id }, (err: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully Deleted the Spot");
        }
    });
};

// - POST - /spot/{1} # updates a spot with id of 1
export let updateSpot = (req: Request, res: Response) => {
    Spot.findByIdAndUpdate(req.params.id, req.body, (err: any, spot: any) => {
        if (err) {
            res.send(err);
        } else {
            res.send("Successfully Updated the Spot");
        }
    });
};

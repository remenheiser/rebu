import express from "express";

export class Controller {

    public getHello(req: express.Request, res: express.Response): void {
        res.send("<img src = https://www.meme-arsenal.com/memes/86ead0c97dae1d9982713966458837d5.jpg>");
    }
    public postHello(req: express.Request, res: express.Response): void {
        res.send(req.body);
    }
    public getBail(req: express.Request, res: express.Response): void {
        res.send("You got my money son");
    }
    public getHome(req: express.Request, res: express.Response): void {
        res.sendFile("rebu/app/src/index.html");
    }

}

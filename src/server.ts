import bodyParser from "body-parser";
import express from "express";
import mongoose = require("mongoose");

import { SpotRouter } from "./routes/spotRoutes";
import { UserRouter } from "./routes/userRoutes";

class Application {
    private app: express.Application;
    private port: number;
    private readonly mongoUri: string = "mongodb+srv://rebu:Silber@rebu-8bwui.mongodb.net/test?retryWrites=true&w=majority";

    constructor() {
        this.app = express();
        this.port = +process.env.serverPort || 3000;
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(express.static("rebu/app/src/public"));
        this.initCors();
    }

    // Starts the server on the port specified in the environment or on port 3000 if none specified.
    public start(): void {
        this.mongoSetup();
        this.buildRoutes();
        this.app.listen(this.port, () => console.log(`Server listening on port ${this.port}...`));
    }

    // sets up to allow cross-origin support from any host.  You can change the options to limit who can access the api.
    // This is not a good security measure as it can easily be bypassed,
    // but should be setup correctly anyway.  Without this, angular would not be able to access the api it it is on
    // another server.
    private initCors(): void {
        this.app.use(function (req: express.Request, res: express.Response, next: any) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
            res.header("Access-Control-Allow-Credentials", "true");
            next();
        });
    }

    // use this method to send a user a token
    // setup routes for the express server
    private buildRoutes(): void {
        this.app.use("/api/location/", new SpotRouter().getRouter());
        this.app.use("/api/user/", new UserRouter().getRouter());
    }

    // connect to mongo
    private mongoSetup(): void {
        mongoose.set("useNewUrlParser", true);
        mongoose.set("useFindAndModify", false);
        mongoose.set("useCreateIndex", true);
        mongoose.set("useUnifiedTopology", true);

        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("mongo connection established");
        });
        connection.on("reconnected", () => {
            console.log("mongo connection reestablished");
        });
        connection.on("disconnected", () => {
            console.log("mongo connection disconnected");
            console.log("trying to reconnect to mongo...");
            setTimeout(() => {
                mongoose.connect(this.mongoUri, {
                    autoReconnect: true, keepAlive: true,
                    socketTimeoutMS: 3000, connectTimeoutMS: 3000
                });
            }, 3000);
        });
        connection.on("close", () => {
            console.log("mongo connection closed");
        });
        connection.on("error", (error: Error) => {
            console.log(`mongo connection ERROR: ${error}`);
        });

        const run = async () => {
            await mongoose.connect(this.mongoUri, {
                autoReconnect: true, keepAlive: true,
            });
        };
        run().catch((error) => console.error(error));
    }
}
new Application().start();

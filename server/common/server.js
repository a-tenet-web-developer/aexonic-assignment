import Express from "express";
import * as http from "http";
import * as path from "path";
import cors from "cors";
import helmet from "helmet";
import useragent from "express-useragent";
import ErrorHandler from "../helper/errorHandler";
import morgan from "morgan";
import db from "../database";

import apiErrorHandler from "../helper/apiErrorHandler";
const app = new Express();
const root = path.normalize(`${__dirname}/../..`);
import ApiError from "../helper/apiError";
class ExpressServer {
  constructor() {
    app.use(Express.json());
    app.use(
      Express.urlencoded({
        extended: true,
      })
    );
    app.use(morgan("dev"));
    app.use(
      helmet.contentSecurityPolicy({
        reportOnly: true,
      })
    );
    app.use(useragent.express());
    app.use(
      cors({
        allowedHeaders: ["Content-Type", "token", "authorization"],
        exposedHeaders: ["token", "authorization"],
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
      })
    );
    
   
  }
  router(routes) {
    routes(app);
    return this;
  }
  handleError() {
    const errorHandler = new ErrorHandler({
      // logger,
      shouldLog: true,
    });
    app.use(apiErrorHandler);
    app.use(errorHandler.unhandledRequest());
    return this;
  }
  configureDb() {
    return new Promise((resolve, reject) => {
      console.log(db.sequelize.sync, "db.sequelize");
      db.sequelize
        .sync({ alter: true })
        .then(() => {
          console.log(`Database & tables generated!`);
          return resolve(this);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  listen(port) {
    http.createServer(app).listen(port, () => {
      console.log(`secure app is listening @port ${port}`);
    });
    return app;
  }
}
export default ExpressServer;

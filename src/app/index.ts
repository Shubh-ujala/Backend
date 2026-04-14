import express from "express";
import type { Express } from "express";
import {authRouter} from "./auth/routes"
import { authenticationMiddleware } from "./middleware/auth-middleware";
export  function createExpressServer(): Express {
  const app = express();

  // middleware
  app.use(express.json());
  app.use(authenticationMiddleware())
  // routes
  app.get("/", (req, res) => {
    
    return res.json({
      message:"Welcome to the  server",
      text:"Successflly created express server"
    });
  });
  app.use('/auth',authRouter);

  // return the app instance
  return app;
}

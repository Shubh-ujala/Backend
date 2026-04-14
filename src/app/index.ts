import express from "express";
import type { Express } from "express";
export  function createExpressServer(): Express {
  const app = express();

  // middleware

  // routes
  app.get("/", (req, res) => {
    
    return res.json({
      message:"Welcome to the  server"
    });
  });

  return app;
}

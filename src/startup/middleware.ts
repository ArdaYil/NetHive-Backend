import express, { Application } from "express";
import cors from "cors";

const middleware = (app: Application) => {
  app.use(cors());
  app.use(express.json());
};

export default middleware;

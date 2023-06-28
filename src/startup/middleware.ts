import express, { Application } from "express";
import corsHandler from "./corsHandler";

const middleware = (app: Application) => {
  app.use(corsHandler);
  app.use(express.json());
};

export default middleware;

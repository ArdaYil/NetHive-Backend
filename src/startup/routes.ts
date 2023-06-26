import express, { Application } from "express";
import user from "../routes/user";

const routes = (app: Application) => {
  app.use("/api/user", user);
};

export default routes;

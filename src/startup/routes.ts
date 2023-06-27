import express, { Application } from "express";
import users from "../routes/users";

const routes = (app: Application) => {
  app.use("/api/users", users);
};

export default routes;

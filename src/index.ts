require("dotenv").config();
import express from "express";
import db from "./startup/db";
import routes from "./startup/routes";
import middleware from "./startup/middleware";

const app = express();

middleware(app);

const defaultPort = 8000;
const port = process.env.PORT || defaultPort;

const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

db();
routes(app);

export default server;

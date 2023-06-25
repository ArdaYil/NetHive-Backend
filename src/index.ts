require("dotenv").config();
import express from "express";
import db from "./startup/db";

const app = express();
const defaultPort = 8000;
const port = process.env.PORT || defaultPort;

const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

db();

export default server;

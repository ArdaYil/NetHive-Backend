import express from "express";

const app = express();
const defaultPort = 8000;
const port = process.env.PORT || defaultPort;

const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

export default server;

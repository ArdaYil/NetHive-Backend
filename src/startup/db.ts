import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.DB || "";

const db = () =>
  mongoose
    .connect(uri)
    .then(() => console.log(`Successfully connected to: ${uri}`))
    .catch(() => console.log("Could not connect to mongodb database"));

export default db;

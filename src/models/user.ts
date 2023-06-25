import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import _ from "lodash";
import dotenv from "dotenv";

dotenv.config();

const accessTokenExpiryTime = "15m";

export const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxLength: 50,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    maxLength: 50,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    maxLength: 100,
    minLength: 7,
    trim: true,
    email: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 1000,
    trim: true,
    email: true,
    required: true,
  },
  permissionLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 1,
  },
  role: {
    type: String,
    maxLength: 50,
    default: "",
  },
});

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    _.pick(this, ["firstName", "lastName", "email", "role"]),
    process.env.ACCESS_PRIVATE_KEY || "",
    { expiresIn: accessTokenExpiryTime }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    _.pick(this, ["firstName", "lastName", "email", "role"]),
    process.env.REFRESH_PRIVATE_KEY || ""
  );
};

export const User = mongoose.model("user", userSchema);

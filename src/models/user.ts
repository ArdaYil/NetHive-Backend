import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import _ from "lodash";
import mongoose, { Document } from "mongoose";
import { TypeOf, z } from "zod";
import { minLength, maxLength } from "../services/nameLengthErrorMessage";
import typegoose, {
  Severity,
  getModelForClass,
  modelOptions,
  pre,
  prop,
} from "@typegoose/typegoose";
import { validate } from "email-validator";
import argon2 from "argon2";

dotenv.config();

const accessTokenExpiryTime = "15m";
const nameMinLength = 1;
const nameMaxLength = 50;
const surnameMinLength = 1;
const surnameMaxLength = 50;
const emailMinLength = 5;
const emailMaxLength = 100;
const passwordMinLength = 8;
const passwordMaxLength = 100;
const passwordHashMaxLength = 3000;

const userValidationSchema = z
  .object({
    name: z
      .string()
      .min(nameMinLength, minLength("Name", nameMinLength))
      .max(nameMaxLength, maxLength("Name", nameMaxLength)),

    surname: z
      .string()
      .min(surnameMinLength, minLength("Surname", surnameMinLength))
      .max(surnameMaxLength, maxLength("Surname", surnameMaxLength)),

    email: z
      .string()
      .email("Input has to be an email")
      .min(emailMinLength, minLength("Email", emailMinLength))
      .max(emailMaxLength, maxLength("Email", emailMaxLength)),
    password: z.string().min(passwordMinLength).max(passwordMaxLength),
    confirmPassword: z.string().min(passwordMinLength).max(passwordMaxLength),
    gender: z.string().min(1).max(50),
    birthdate: z.string().min(1).max(50),
    newsletter: z.boolean(),
    termsOfService: z.boolean(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Confirm password must be equal to password",
  });

export type UserInputBody = TypeOf<typeof userValidationSchema>;

@pre<User>("save", async function () {
  if (!this.isModified("password")) return;

  const hash = await argon2.hash(this.password);

  this.password = hash;

  return;
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({
    required: true,
    minlength: nameMinLength,
    maxlength: nameMaxLength,
    trim: true,
  })
  name: string;

  @prop({
    required: true,
    minlength: surnameMinLength,
    maxlength: surnameMaxLength,
    trim: true,
  })
  surname: string;

  @prop({
    required: true,
    minlength: emailMinLength,
    maxlength: emailMaxLength,
    unique: true,
    trim: true,
    validate: {
      validator: (email: string) => validate(email),
      message: "Input is not an email",
    },
  })
  email: string;

  @prop({
    required: true,
    minlength: passwordMinLength,
    maxlength: passwordHashMaxLength,
    trim: true,
  })
  password: string;

  @prop({ min: 1, max: 10, default: 1 })
  permissionLevel: number;

  @prop({ required: true, minlength: 1, maxlength: 50 })
  gender: string;

  @prop({ required: true, minlength: 1, maxlength: 50 })
  birthdate: string;

  @prop({ required: true })
  newsletter: boolean;

  @prop({
    required: true,
    validate: {
      validator: (termsOfService: boolean) => termsOfService === true,
      message: "User has to agree to the terms of service",
    },
  })
  termsOfService: boolean;

  @prop({ default: "member", minlength: 1, maxlength: 50 })
  role: string;

  public generateAccessToken() {
    return jwt.sign(
      _.pick(this, ["firstName", "lastName", "email", "role"]),
      process.env.ACCESS_PRIVATE_KEY || "",
      { expiresIn: accessTokenExpiryTime }
    );
  }

  public generateRefreshToken() {
    return jwt.sign(
      _.pick(this, ["firstName", "lastName", "email", "role"]),
      process.env.REFRESH_PRIVATE_KEY || ""
    );
  }
}

export const validateUser = (body: UserInputBody) => {
  return userValidationSchema.safeParse(body);
};

const UserModel = getModelForClass(User);

export default UserModel;

import express, { Request, Response } from "express";
import validate from "../services/validate";
import User, { validateUser, UserInputBody } from "../models/user";
import _ from "lodash";

const router = express.Router();

router.post(
  "/",
  validate<UserInputBody>(validateUser),
  async (req: Request, res: Response) => {
    const body: UserInputBody = req.body;

    try {
      const user = new User(body);

      if (!user) res.status(500).send("Internal server error");

      await user.save();

      const jwt = user.generateAccessToken();

      res
        .header("x-auth-token", jwt)
        .status(200)
        .json(
          _.pick(user, [
            "_id",
            "name",
            "surname",
            "email",
            "role",
            "gender",
            "birthdate",
          ])
        );
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.get("/", (req: Request, res: Response) => {
  return res.json({
    success: true,
  });
});

export default router;

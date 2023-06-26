import { Request, Response, NextFunction } from "express";
import { SafeParseReturnType } from "zod";

const validate =
  <T>(validator: Function) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result: SafeParseReturnType<T, {}> = validator(req.body);

    if (result.success) return next();

    res.status(400).json(result.error);
  };

export default validate;

import { ValidationChain } from "express-validator";
import useDb from "./db";

type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown;
}
  ? U
  : T;

export type DBType = Await<ReturnType<typeof useDb>>;

export type Route = {
  path: string;
  validator: ValidationChain[];
  handler: (
    db: DBType,
    data: any
  ) => Promise<{
    res: number | string;
    msg: string;
    data?: any;
  }>;
  type: "POST" | "GET" | "PUT";
};

import { Route } from "../../types";
import get from "./gets";

import { query } from "express-validator";
import post from "./post";
import put from "./put";

const validateToken = () => {
  return query("token")
    .isString()
    .isLength({ min: 1, max: 100 })
    .equals(process.env.TOKEN as string);
};

const entriesRoutes = [...get, ...post, ...put].map((route) => {
  return {
    handler: route.handler,
    path: `/${route.path}`,
    validator: [validateToken(), ...route.validator],
    type: route.type,
  } as Route;
});

export default entriesRoutes;

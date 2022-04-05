import { Route } from "../../types";
import { body, query } from "express-validator";
import moment from "moment";

const genderValidator = (gender: string) => {
  return ["MALE", "FAMALE", "NOT-BINARY"].includes(gender);
};

const dateValidator = (date: string) => {
  try {
    const newDate = moment(date, "YYYY-MM-DD");
    return newDate.isValid();
  } catch (error) {
    return false;
  }
};

const updateEntry: Route = {
  handler: async (db, req) => {
    const data = req.body;
    await db.entriesAndres.where("id", "=", req.query.id).update({
      name: data.name,
      last_name: data.last_name,
      gender: data.gender,
      born_date: data.born_date,
      updated_at: new Date(moment.utc().format()),
    });
    return { data: {}, msg: "", res: 200 };
  },
  path: "update-entry",
  validator: [
    body("name").isString().isLength({ min: 1, max: 100 }),
    body("last_name").isString().isLength({ min: 1, max: 100 }),
    body("gender").isString().custom(genderValidator),
    body("born_date").isString().custom(dateValidator),
    query("id").isNumeric().withMessage("Id is required"),
  ],
  type: "PUT",
};

export default [updateEntry];

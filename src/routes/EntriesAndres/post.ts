import { Route } from "../../types";
import { body } from "express-validator";
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

const createEntry: Route = {
  handler: async (db, req) => {
    const data = req.body;
    const newEntry = await db.entriesAndres.create({
      name: data.name,
      last_name: data.last_name,
      gender: data.gender,
      born_date: data.born_date,
      created_at: new Date(moment.utc().format()),
      updated_at: new Date(moment.utc().format()),
    });
    return { data: { id: newEntry.insertId }, msg: "", res: 200 };
  },
  path: "create-entry",
  validator: [
    body("name").isString().isLength({ min: 1, max: 100 }),
    body("last_name").isString().isLength({ min: 1, max: 100 }),
    body("gender").isString().custom(genderValidator),
    body("born_date").isString().custom(dateValidator),
  ],
  type: "POST",
};

export default [createEntry];

import { Schema, model } from "mongoose";
import { handleSaveError } from "./hooks.js";
import Joi from "joi";
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveError);

export const contactAddSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ message: "missing required name field" }),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean().required(),
});

export const contactPutSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).min(1);


const Contact = model("contact", contactSchema);
export default Contact;

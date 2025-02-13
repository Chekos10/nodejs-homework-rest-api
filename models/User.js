import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError } from "./hooks.js";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        minlength: 6,
        required: true,
    },
    token:{
        type: String,
    },
    avatarURL: {
        type:String,
    },
    verify:{
        type:Boolean,
        default: false,
    },
    verifacationCode:{
        type: String,
    },
}, {versionKey: false, timestamps: true})

userSchema.post("save", handleSaveError)

export const userSignupSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

export const userSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

export const userEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required()
})

const User = model("user", userSchema)
export default User;
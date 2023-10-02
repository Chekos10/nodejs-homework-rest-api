import bcrypt from "bcryptjs"
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import User from "../models/User.js";
import { HttpError , sendEmail } from "../helpers/index.js";
import {ctrlWrapper} from "../decorators/index.js";
import jwt from "jsonwebtoken"
const {JWT_SECRET,BASE_URL} = process.env;




const signup = async(req,res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email})

    if(user){
        throw HttpError (409, "Email already exist")
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const avatarURL = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: '404',
    })
    const verifacationCode = nanoid()
    const newUser = await User.create({...req.body, password:hashPassword , avatarURL, verifacationCode})
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verifacationCode}">Click to verify your email</a>`
    }
    await sendEmail(verifyEmail)

    res.status(200).json({
        username: newUser.username,
        email: newUser.email,
    })
}

const verify = async(req,res) =>{
    const {verifacationCode} = req.params;
    const user = await User.findOne({verifacationCode});
    if(!user){
        throw HttpError(404)
    }
    await User.findByIdAndUpdate(user._id, {verify:true, verifacationCode: ""})

    res.json({
        message:"Email verify success"
    })
}
const resendVerifyEmail = async (req,res) => {
    const {email} = req.params;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError (404, "email not found");
    }
    if(user.verify){
        throw HttpError(400, "email is verified");
    }
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verifacationCode}">Click to verify your email</a>`
    }
    await sendEmail(verifyEmail)
    res.json({
        message:"Verify email is resend!"
    })
}

const signin = async(req,res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw HttpError(401, "Email or password incorrect");
    }
    if(!user.verify) {
        throw HttpError(401, "Email not verify");
    }
    const passwordCompare = await bcrypt.compare(password, user.password)
    if(!passwordCompare){
        throw HttpError(401, "Email or password incorrect");
    }

    const {_id:id} = user
    const payload = {
        id,
    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"})
    await User.findByIdAndUpdate(id, {token});
    res.json({
        token,
    })
}

const getCurrent = (req,res) =>{
    const {name, email} = req.user;

    res.json({
        name,
        email,
    })
}

const signout = async (req, res) =>{
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});
    res.json({
        message: "Signout success"
    }) 
}

export default {
    signup: ctrlWrapper(signup),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
}
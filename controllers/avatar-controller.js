import fs from "fs/promises";
import Contact from "../models/contacts.js";
import { HttpError } from '../helpers/index.js'
import { ctrlWrapper } from '../decorators/index.js'
import path from "path";

const avatarsPath = path.resolve("public" , "avatars");

const updateAvatarById = async (req, res) =>{
    const {id} = req.params;
    const {path: oldPath , filename} = req.file;
    const newPath = path.join(avatarsPath, filename);
    await fs.rename(oldPath , newPath);
    const avatar = path.join("avatars", filename);
    const filter = {_id: id, owner: req.user._id};
    const update = {avatar}
    const result = await Contact.findOneAndUpdate(filter,update, {new:true});
    if(!result){
        throw HttpError(404,`Contact by this ${id} id is not found`)
    }
    res.json(result);
}

export default {
    updateAvatarById: ctrlWrapper(updateAvatarById),
}

import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import Contact from "../models/contacts.js";

const getAll = async (req,res) =>{
    const {_id: owner} = req.user;
    const {page=1, limit=10} = req.query;
    const skip = (page - 1) * limit
    const result = await Contact.find({owner}, "-createdAt -updatedAt",{skip, limit})
    .populate("owner", "username email");
    res.json(result)
}

const getById = async (req,res) =>{
    const {id} = req.params;
    const filter = {_id:id, owner:req.user._id}
    const result = await Contact.findOne(filter)
    if(!result) {
        throw HttpError(404,`Contact by this ${id} id is not found`)
    }
    res.json(result);
}

const add = async (req,res) => {
    const {_id: owner} = req.user
    const result = await Contact.create({...req.body, owner});
    res.status(201).json(result)
}

const updateById = async (req,res)=>{
    const {id} = req.params;
    const filter = {_id:id, owner:req.user._id}
    const result = await Contact.findOneAndUpdate(filter,req.body, {new:true});
    if(!result){
        throw HttpError(404,`Contact by this ${id} id is not found`)
    }
    res.json(result);
}

const deleteById = async (req,res) =>{
    const {id} = req.params
    const filter = {_id:id, owner:req.user._id}
    const result = await Contact.findOneAndDelete(filter)
    if(!result){
        throw HttpError(404,`Contact by this ${id} id is not found`)
    }
    res.json(result)
}

const favorites = async (req, res) =>{
    const {id} = req.params;
    const filter = {_id:id, owner:req.user._id}
    const result = await Contact.findOneAndUpdate(filter, req.body, {new:true});
    if(!result){
        throw HttpError(404,`Contact by this ${id} id is not found`)
    }
    res.json(result);
}

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
    favorites: ctrlWrapper(favorites)
}
import express from 'express'
import Joi from 'joi'
import Contact from "../../models/Contacts.js"
import {HttpError} from "../../helpers/index.js"
import {isValidId} from '../../middlewares/index.js'

const contactRouter = express.Router()

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages(
    {"message": "missing required name field"}),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean().required(),
})

const contactPutSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).min(1);



contactRouter.get('/', async (req, res, next) => {
  try {
    const result = await Contact.find()
    res.json(result)
  } catch (error) {
    next(error)
  }
})

contactRouter.get('/:id',isValidId, async (req, res, next) => {
  try {
    const {id} = req.params
    const result = await Contact.findById(id)
    if(!result){
      throw HttpError(404,`Contact by this ${id} id is not found`)
    }
    res.json(result);
  } catch (error) {
    next(error)
  }
})

contactRouter.post('/', async (req, res, next) => {
  try {
    const {error} = contactAddSchema.validate(req.body)
    if(error){
      throw HttpError(400, error.message)
    }
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error)
  }
})

contactRouter.put('/:contactId',isValidId, async (req, res, next) => {
  try {
    const {error} = contactPutSchema.validate(req.body)
    if(error){
      throw HttpError(400, error.message)
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new:true});
    if(!result){
      throw HttpError(404, `Contact by this ${contactId} id is not found`);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error)
  }})

contactRouter.patch("/:contactId/favorite", async(req,res,next) =>{
  try {
    const {error} = contactPutSchema.validate(req.body)
    if(error){
      throw HttpError(400, error.message)
    }
    const {contactId} = req.params
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new:true})
    if(!result){
      throw HttpError(404, error.message)
    }
    res.status(200).json(result);
  } catch (error) {
    next(error)
  }
})

contactRouter.delete('/:contactId', async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const result = await Contact.findByIdAndDelete(contactId)
    if(!result){
      throw new HttpError(404, `Contact by this ${contactId} id is not found`)
    }
    res.status(200).json({
      "message": "contact deleted"
    }) 
  } catch (error) {
    next(error)
  }
})


/* 

contactRouter.delete('/:contactId',isValidId, async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const result = await contactsService.removeContact(contactId);
    if(!result){
      throw new HttpError(404, `Contact by this ${contactId} id is not found`)
    }
    res.status(200).json({
      "message": "contact deleted"
    }) 
  } catch (error) {
    next(error)
  }
})

contactRouter.put('/:contactId',isValidId, async (req, res, next) => {
  try {
    const {error} = contactPutSchema.validate(req.body)
    if(error){
      throw HttpError(400, error.message)
    }
    const {contactId} = req.params
    const result = await contactsService.updateContactsById(contactId, req.body)
    if(!result){
      throw HttpError(404, `Contact by this ${id} id is not found`)
    }
    res.status(200).json(result);
  } catch (error) {
    next(error)
  }
}) */
export default contactRouter;

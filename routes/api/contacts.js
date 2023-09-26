import express from 'express'
import contactController from '../../controllers/contact-controller.js'
import * as contactSchemas from "../../models/contacts.js";
import {validateBody} from "../../decorators/index.js"
import {authenticate,isValidId} from "../../middlewares/index.js"

const contactAddValidate = validateBody(contactSchemas.contactAddSchema);

const contactUpdateSchema = validateBody(contactSchemas.contactPutSchema);

const contactRouter = express.Router()
contactRouter.use(authenticate)
contactRouter.get("/", authenticate, contactController.getAll);
contactRouter.get("/:id",isValidId, contactController.getById);
contactRouter.post("/", contactAddValidate, contactController.add);
contactRouter.put("/:id", isValidId, contactUpdateSchema, contactController.updateById)
contactRouter.delete("/:id", contactController.deleteById);
contactRouter.delete("/:id", contactController.deleteById);
contactRouter.patch(":id/favorite", isValidId, contactUpdateSchema, contactController.favorites)

export default contactRouter;

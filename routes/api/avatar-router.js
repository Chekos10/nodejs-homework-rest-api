import express from 'express'
import avatarController from '../../controllers/avatar-controller.js'
import {authenticate, upload , uploadedAvatar} from "../../middlewares/index.js"

const avatarRouter = express.Router()
avatarRouter.use(authenticate)

avatarRouter.patch("/:id",upload.single("avatar"),uploadedAvatar, avatarController.updateAvatarById)

export default avatarRouter;
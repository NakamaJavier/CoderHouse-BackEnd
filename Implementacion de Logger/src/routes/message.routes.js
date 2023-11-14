import { Router } from "express"
import { getMessages, postMessages } from "../controllers/message.controller.js"


const messageRouter = Router()

messageRouter.get("/", getMessages)
messageRouter.post("/", postMessages)

export default messageRouter
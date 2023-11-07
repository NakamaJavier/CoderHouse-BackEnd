import { Router } from "express"
import { postTicket } from "../controllers/ticket.controller.js"
import { passportError, authorization } from "../utils/messageErrors.js"

const ticketRouter = Router()

ticketRouter.post('/', passportError('jwt'), authorization('user'), postTicket)

export default ticketRouter
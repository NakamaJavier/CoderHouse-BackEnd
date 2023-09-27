import { Router } from "express"
import messageModel from "../models/messages.model.js"


const messageRouter = Router()

messageRouter.get("/", async (req,res)=>{
    try{
        const messages = await messageModel.find()
        res.status(200).send({resultado: "OK", message: messages})
    }catch (error){
        res.status(400).send({error: `Error al consultar los mensajes: ${error}`})
    }
})

messageRouter.post("/", async (req,res)=>{
    const { email, message, date } = req.body
    try{
        const chat = await messageModel.create({
            email, message, date
        })
        res.status(200).send({resultado: "OK", message: `${date}-${email}: ${message}`})
    }catch (error){
        res.status(400).send({error: "Error al consultar publicar un chat"})
        }
})

export default messageRouter
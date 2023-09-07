import { Router } from "express"
import messageModel from "../models/messages.model.js"


const messageRouter = Router()

messageRouter.get("/", async (req,res)=>{
    try{
        const prods = await messageModelModel.find()
        res.status(200).send({resultado: "OK", message: prods})
    }catch (error){
        res.status(400).send({error: `Error al consultar productos: ${error}`})
    }
})

export default messageRouter
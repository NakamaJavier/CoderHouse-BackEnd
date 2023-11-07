import messageModel from "../models/messages.model.js"

export const getMessages = async (req, res) => {
    try{
        const messages = await messageModel.find()
        return res.status(200).send({resultado: "OK", message: messages})
    }catch (error){
        return res.status(500).send({ error: `Error en consultar productos ${error}`})
    }
}

export const postMessages = async (req,res) => {
    const { email, message, date } = req.body
    try{
        const chat = await messageModel.create({email, message, date})
        return res.status(201).send({resultado: "OK", message: `${date}-${email}: ${message}`})
    }catch (error){
        return res.status(500).send({ error: `Error en consultar productos ${error}`})
        }
}
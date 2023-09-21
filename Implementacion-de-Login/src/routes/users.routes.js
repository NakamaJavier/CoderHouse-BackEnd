import { Router } from "express"
import userModel from "../models/users.models.js"

const userRouter = Router()

userRouter.post('/', async (req,res) =>{
    const {first_name, last_name, email, password, age,rol} = req.body
    console.log(first_name, last_name, email, password, age,rol);
    try{
        const response = await userModel.create({first_name, last_name, email, password, age,rol})
        res.status(200).send({response: 'OK', message: "Usuario Creado"})
    }catch (error){
        res.status(400).send({error: `Error al crear usuario: ${error}`})
    }
    
})

export default userRouter

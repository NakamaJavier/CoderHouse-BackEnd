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

userRouter.get('/:email', async (req,res) =>{
    const {email} = req.params
    try{
        const user = await userModel.findOne({email:email})
        if(user){
            res.status(200).send({response: 'OK', message: user})
        }else{
            res.status(404).send({error: 'Not Found'})
        }
    }catch (error){
        res.status(400).send({error: `Error al obtener usuario: ${error}`})
    }
})

export default userRouter

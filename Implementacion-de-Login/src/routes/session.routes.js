import { Router } from "express"
import userModel from "../models/users.models.js"

const sessionRouter = Router()

sessionRouter.post('/login', async (req,res)=>{
    const {email,password} = req.body
    try{
        console.log(req.session.login)
        if(req.session.login){  //si ya estaba logeado correctamente
            res.status(200).send({resultado: 'OK', message: "Ya esta logeado"})
        }else{
            const user = await userModel.findOne({email:email})    //busco un usuario con el email enviado
            if(user){
                if(user.password === password){     //verifico si el password es correcto
                    req.session.login = true
                    req.session.email = email
                    req.session.rol = user.rol
                    req.session.first_name = user.first_name
                    req.session.last_name = user.last_name
                    req.session.age = user.age
                    res.status(200).send({resultado: 'OK', message: `Se logró logearse con el mail: ${user.email}`})
                    //res.redirect('path',200,{'info': user})
                }else{
                    res.status(401).send({error: 'Unauthorized', message: "Email o contraseña equivocada"})
                }
            }else{
                res.status(404).send({error: 'Unauthorizedd', message: "Email o contraseña equivocada"})
            }
        }
    }catch(error){
        res.status(400).send({error: `Error al loguearse: ${error}`})
    }
})

sessionRouter.get('/logout', (req,res) =>{
    try{
        if(req.session.login){
            console.log("Elimino el session");
            req.session.destroy()
        }
        res.status(200).send({resultado: 'Ha sido deslogeado'})
    }catch(error){
        res.status(400).send({error: `Error al desloguearse: ${error}`})
    }
})

export default sessionRouter
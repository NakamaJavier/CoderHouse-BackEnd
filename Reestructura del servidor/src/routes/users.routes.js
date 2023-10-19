import { Router } from "express"
import userModel from "../models/users.models.js"
import passport from "passport"

const userRouter = Router()

userRouter.post('/', passport.authenticate('register'), async (req, res) => {
    try {
        console.log("usuario:",req.user);
        if (!req.user) {
            return res.status(400).send({ message: 'Usuario ya existente' })
        }
        return res.status(200).send({ message: `Usuario creado: ${req.user}` })
    } catch (error) {
        console.log("fue un error");
        res.status(500).send({ message: `Error al crear usuario ${error}` })
    }
})

userRouter.get('/:email', async (req, res) => {
    const {
        email
    } = req.params
    try {
        const user = await userModel.findOne({
            email: email
        })
        if (user) {
            res.status(200).send({
                response: 'OK',
                message: user
            })
        } else {
            res.status(404).send({
                error: 'Not Found'
            })
        }
    } catch (error) {
        res.status(400).send({
            error: `Error al obtener usuario: ${error}`
        })
    }
})

export default userRouter
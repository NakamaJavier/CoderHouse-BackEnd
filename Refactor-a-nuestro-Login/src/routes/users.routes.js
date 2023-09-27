import {
    Router
} from "express"
import userModel from "../models/users.models.js"
import {
    createHash
} from "../utils/bcrypt.js"
import passport from "passport"

const userRouter = Router()

userRouter.post('/', passport.authenticate('register'), async (req, res) => {
    try {
        console.log("usuario:",req.user);
        if (!req.user) {
            return res.status(400).send({ mensaje: 'Usuario ya existente' })
        }
        return res.status(200).send({ mensaje: `Usuario creado: ${req.user}` })
    } catch (error) {
        console.log("fue un error");
        res.status(500).send({ mensaje: `Error al crear usuario ${error}` })
    }
})

// userRouter.post('/', async (req, res) => {
//     const {
//         first_name,
//         last_name,
//         email,
//         password,
//         age,
//         rol
//     } = req.body
//     console.log(first_name, last_name, email, password, age, rol);
//     try {
//         const hashPassword = createHash(password)
//         const response = await userModel.create({
//             first_name,
//             last_name,
//             email,
//             password: hashPassword,
//             age,
//             rol
//         })
//         res.status(200).send({
//             response: 'OK',
//             message: "Usuario Creado"
//         })
//     } catch (error) {
//         res.status(400).send({
//             error: `Error al crear usuario: ${error}`
//         })
//     }

// })

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
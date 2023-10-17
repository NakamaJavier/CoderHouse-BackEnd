import {Router} from "express"
import userModel from "../models/users.models.js"
import {validatePassword} from "../utils/bcrypt.js"
import passport from "passport"

const sessionRouter = Router()
sessionRouter.post('/login', passport.authenticate('login'), async (req, res) => {
    try {
        console.log(req.user);
        if (!req.user) {
            return res.status(401).send({
                mensaje: "Invalidate user"
            })
        }
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            rol: req.user.rol
        }
        console.log(req.session.user);
        res.status(200).send({resultado: 'OK', message: `Se logró logearse con el mail: ${req.user.email}`})
    } catch (error) {
        res.status(500).send({
            message: `Error al iniciar sesion: ${error}`
        })
    }
})

sessionRouter.get('/logout', (req, res) => {
    try {
        if (req.session) {
            console.log("Elimino el session");
            req.session.destroy()
        }
        res.status(200).redirect("/static/userlog")
    } catch (error) {
        res.status(400).send({
            error: `Error al desloguearse: ${error}`
        })
    }
})

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
        res.status(200).send({ mensaje: 'Usuario creado' })
})

sessionRouter.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    req.session = req.user
    res.status(200).send({ mensaje: 'Session creada' })
})
export default sessionRouter
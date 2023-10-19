import {Router} from "express"
import { passportError, authorization } from "../utils/messageErrors.js";
import { generateToken } from "../utils/jwt.js";
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
        //PARA EL USO DE SESSION
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            rol: req.user.rol
        }
        const token = generateToken(req.user) 
        res.cookie('jwtCookie', token, {      
            maxAge: 43200000
        })
        // console.log(req.session.user);
        res.status(200).send({resultado: 'OK', message: `Se logró logearse con el mail: ${req.user.email}`})
    } catch (error) {
        res.status(500).send({
            message: `Error al iniciar sesion: ${error}`
        })
    }
})

//ES UNA PRUEBA DEL JWT
// sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: true }), async (req, res) => {
//     res.status(200).send({ mensaje: req.user })
//     req.session.user = {
//         first_name: req.user.user.first_name,
//         last_name: req.user.user.last_name,
//         age: req.user.user.age,
//         email: req.user.user.email
//     }
// })

//PRUEBA QUE NO HAYA ERRORES EN LA ESTRATEGIA ELEGIDA COMO PARAMETRO, Y LUEGO AUTORIZA EL REQUEST O NO SEGUN EL RANGO
// sessionRouter.get('/current', passportError('jwt'), authorization('user'), (req, res) => {
//     res.send(req.user)
// })

sessionRouter.get('/logout', (req, res) => {
    try {
        //PARA EL USO DE SESSIONS
        if (req.session) {
            console.log("Elimino el session");
            req.session.destroy()
        }
        res.clearCookie('jwtCookie') 
        res.status(200).redirect("/static/userlog")
    } catch (error) {
        res.status(400).send({
            error: `Error al desloguearse: ${error}`
        })
    }
})

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
        res.status(200).send({ resultado: 'OK', message: 'Usuario creado o logueado' })
})

sessionRouter.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    console.log(req.user);
    //PARA EL USO DE SESSIONS
    req.session.user = req.user
    const token = generateToken(req.user)
        res.cookie('jwtCookie', token, {
            maxAge: 43200000
        })
    res.redirect('/static/realtimeproducts')
    //res.status(200).send({ resultado: 'OK', message: 'Session creada' }) //Por ahora no devuelve status para que la pagina funcione, hasta que no sepa como solucionar el tema del cors cuando consumo esta api desde el front
})
export default sessionRouter
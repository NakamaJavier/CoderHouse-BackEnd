import {Router} from "express"
import passport from "passport"
import { getCreateGithubSession, getGithubLoginSession, getLogoutSession, postLocalLoginSession } from "../controllers/session.controller.js";

const sessionRouter = Router()

sessionRouter.post('/login', passport.authenticate('login'), postLocalLoginSession)
sessionRouter.get('/logout', getLogoutSession)
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), getGithubLoginSession)
sessionRouter.get('/githubSession', passport.authenticate('github', { failureRedirect: '/login' }), getCreateGithubSession)
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

export default sessionRouter
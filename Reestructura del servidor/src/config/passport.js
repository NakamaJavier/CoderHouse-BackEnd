import local from 'passport-local' //Estrategia
import passport from 'passport' //Manejador de las estrategias
import GithubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import { createHash, validatePassword } from '../utils/bcrypt.js'
import userModel from "../models/users.models.js"


//Defino la estrategia a utilizar
const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt //Extractor de los headers de la consulta

const initializePassport = () => {

    
    const cookieExtractor = req => {
        const token = req.cookies.jwtCookie ? req.cookies.jwtCookie : ""
        return token
    }
    
    
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), //Consulto el token de las cookies
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload) //Retorno el contenido del token
        } catch (error) {
            return done(error)
        }
    }))

    //done es como si fuera un res.status(), el callback de respuesta
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            //Defino como voy a registrar un user
            const { first_name, last_name, age } = req.body

            try {
                let user = await userModel.findOne({ email: username })
                if (user) {
                    //done es como si fuera un return de un callback
                    return done(null, false)
                }
                const passwordHash = createHash(password)
                const userCreated = await userModel.create({
                    first_name: first_name,
                    last_name: last_name,
                    email: username,
                    age: age,
                    password: passwordHash
                })
                console.log(userCreated)
                return done(null, userCreated)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if (!user) {
                return done(null, false)
            }
            if (validatePassword(password, user.password)) {
                console.log("es un usuario valido");
                return done(null, user) //Usuario y contraseña validos
            }
            return done(null, false) //Contraseña no valida
        } catch (error) {
            return done(error)
        }

    }))

    passport.use('github', new GithubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL

    }, async (accessToken, refreshToken, profile, done) => {

        try {
            let user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                let userCreated = await userModel.create({
                    first_name: profile._json.name,
                    last_name: ' ',
                    email: profile._json.email,
                    age: 18, //Edad por defecto,
                    password: createHash('password')
                })
                console.log("cree un usuario");
                done(null, userCreated)
            } else {
                done(null, user)
            }

        } catch (error) {
            done(error)
        }

    }))

    //Inicializar la session del usr
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    //Eliminar la session del usr
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })

}

export default initializePassport
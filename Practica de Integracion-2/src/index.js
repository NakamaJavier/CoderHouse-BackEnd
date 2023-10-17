import express from "express"
import mongoose from "mongoose"
import 'dotenv/config'
import { engine } from "express-handlebars"
import path from "path"
import { __dirname } from "./path.js"
import { Server } from 'socket.io'
import router from './routes/index.routes.js'
import front from "./routes/static.routes.js"
import cookieParser from "cookie-parser"
import session from "express-session"
import MongoStore from "connect-mongo"
import passport from 'passport'
import initializePassport from './config/passport.js'


let mensajes = []

//Configuracion del Servidor

const app = express()
const PORT = 4000
const server = app.listen(PORT, () => {
    console.log(`Server on Port ${PORT}`);
})

//Configuracion de la BD (en MOGODB Atlas)

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB conectada"))
    .catch((error) => console.error("Error en coexion con MongoDB Atlas: ", error))

//Middlewares

app.use(express.json()) //para procesar datos en formato JSON que se envian en las solicitudes HTTP
app.use(express.urlencoded({extended: true})) //para hacer pedidos mas extensos los datos enviados en la url
app.use(cookieParser(process.env.JWT_SECRET)) //para firmar las cookies
app.use(session({ //Configuracion de la sesion de mi app
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 90
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//configuracion del handlebars como las plantillas para renderizar
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views')) //ubico donde estan las plantillas a renderizar
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

//Conexion de Socket.io
const io = new Server(server)
io.on("connection", async (socket) => {
    console.log("Conexion con Socket.io")
    socket.on('mensaje', info => {
        mensajes.push(info)
        io.emit('mensajes', mensajes)
    })
    socket.on('mensajesDB', info => {
        if (mensajes.length <= 0) {
            mensajes.push(...info)
            io.emit('mensajes', mensajes)
        }
    })
})


//Routes

app.use('/', front)
app.use('/', router)


//Cookies

app.get('/setCookie', (req, res) =>
    res.cookie('CookieCoockie', 'Esto es el valor de una cookie', {
        maxAge: 30000,
        signed: true
    }).send('Cookie creada')) //cookie de 1 minuto con firma

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies)
})


//SESSIONS





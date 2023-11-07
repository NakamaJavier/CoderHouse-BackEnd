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
import cors from 'cors'
import nodemailer from 'nodemailer'




//Configuracion del Servidor

const app = express()
const PORT = 4000
const server = app.listen(PORT, () => {
    console.log(`Server on Port ${PORT}`)
})

//Configuracion de la BD (en MOGODB Atlas)

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB conectada"))
    .catch((error) => console.error("Error en coexion con MongoDB Atlas: ", error))


    //Configuracion CORS para fetch (NO SE ESTA USANDO)

const whiteList = ['http://localhost:4000']

const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) != -1 || !origin) { //Existe dentro de whitelist
            callback(null, true)
        } else {
            callback(new Error("Acceso denegado"))
        }
    }
}
//Middlewares

app.use(cors(corsOptions))
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
let mensajes = []
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

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'jnakamatesting@gmail.com',
        pass: process.env.PASSWORD_EMAIL,
        authMethod: 'LOGIN'
    },
    tls: {
        rejectUnauthorized: false
    }
});

app.get('/mail', async (req, res) => {
    const resultado = await transporter.sendMail({
        from: 'TEST Fran jnakamatesting@gmail.com',
        to: 'jnakamatesting@gmail.com',
        subject: 'Saludo de buenas tardes',
        html:
            `
            <div>
                <h1> Hola,buenas noches as sido ackeado </h1>
            </div>
        `,
        attachments: []
    })
    console.log(resultado)
    res.send('Mail enviado')
})




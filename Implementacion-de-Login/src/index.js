import express from "express"
import mongoose from "mongoose"
import 'dotenv/config'
import {
    engine
} from "express-handlebars"
import path from "path"
import {
    __dirname
} from "./path.js"
import {
    Server
} from 'socket.io'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/carts.routes.js'
import messageRouter from './routes/message.routes.js'
import cookieParser from "cookie-parser"
import session from "express-session"
import MongoStore from "connect-mongo"
import sessionRouter from "./routes/session.routes.js"
import userRouter from "./routes/users.routes.js"
//import FileStorage from 'session-file-store'

function auth(req, res, next) {
    console.log(req.session.email)
    if (req.session.email == "admin@admin.com" && req.session.password == "1234") {
        return next()
    }
    return res.send("No tenes acceso a este contenido")
}

let mensajes = []
//Configuracion del Servidor
const app = express()
//const fileStorage = FileStorage(session)
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
app.use(express.urlencoded({
    extended: true
})) //para hacer pedidos mas extensos los datos enviados en la url
app.use(cookieParser(process.env.SIGNED_COOKIE))
app.use(session({
    //store: new fileStorage({path: './session', ttl:10000, retries: 1}),
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 900 //en segundos
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,

}))
//configuracion del handlebars como las plantillas para renderizar
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views')) //ubico donde estan las plantillas a renderizar


//Conexion de Socket.io
const io = new Server(server)
io.on("connection", async (socket) => {
    console.log("Conexion con Socket.io")
    socket.on('mensaje', info => {
        mensajes.push(info)
        io.emit('mensajes', mensajes)
    })
    socket.on('mensajesDB', info => {
        if(mensajes.length<=0){
            mensajes.push(...info)
            io.emit('mensajes', mensajes)
        }
    })
})


//Routes

app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/api/product', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/messages', messageRouter)
app.use('/api/session', sessionRouter)
app.use('/api/user', userRouter)


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

app.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++
        res.send(`Has entrado ${req.session.counter} veces a mi pagina`)
    } else {
        req.session.counter = 1
        res.send("hola, por primera vez")
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.send("Salio de la sesion")
    })
})

app.get('/login', (req, res) => {
    const {
        email,
        password
    } = req.body
    const validation = true
    if (validation) {
        req.session.email = email
        req.session.password = password
        return res.send("Usuario Logueado")
    }
    return res.send("Usario Incorrecto")
})

app.get('/admin', auth, (req, res) => {
    res.send("Sos admin")
})
//HandleBars

app.get('/static', async (req, res) => {
    try {
        // await productManager.getProducts();
        // const productos = productManager.products;

        res.render("home", {
            rutaCSS: "home",
            rutaJS: "home",
            //productos: productos
        });
    } catch (error) {
        console.log(error);
    }
})

app.get('/static/chat', (req, res) => {

    res.render('chat', {
        rutaJS: "chat",
        rutaCSS: "chat"
    })
})

app.get('/static/userlog', (req, res) => {
    res.render('userlog', {
        rutaJS: "userlog",
        rutaCSS: "userlog"
    })
})

app.get('/static/register', (req, res) => {
    res.render('register', {
        rutaJS: "register",
        rutaCSS: "register"
    })
})

// app.get('/static/realtimeproducts', async (req,res) =>{
//     try {
//         await productManager.getProducts();
//         const productos = productManager.products;
//         res.render("realTimeProducts", {
//             rutaCSS: "realtimeproducts",
//             rutaJS: "realTimeProducts",
//             productos: productos
//         })
//     } catch (error) {
//         console.log(error);
//     }
// })
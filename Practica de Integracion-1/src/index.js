import express from 'express'
import mongoose from 'mongoose'
import { __dirname } from './path.js'
import {engine} from 'express-handlebars'
import { Server } from 'socket.io'
import path from 'path'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/carts.routes.js'
import messageRouter from './routes/message.routes.js'

//configuro el servidor donde se aloja el sitio
const app = express()
const PORT = 4000
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

//configuro la conectividad con la base de datos en MongoDB Atlas
mongoose.connect('mongodb+srv://JavierNakama:Inicio1*@cluster0.u1gtor9.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log("DB conectada"))
    .catch((error) => console.log("Error en conexion con MongoDB ATLAS: ", error))


//Middlewares

app.use(express.json()) //para procesar datos en formato SON que se envian en las solicitudes HTTP
app.use(express.urlencoded({ extended: true })) //para hacer pedidos mas extensos los datos enviados en la url
//configuracion del handlebars como las plantillas para renderizar
app.engine('handlebars', engine()) 
app.set('view engine', 'handlebars') 
app.set('views', path.resolve(__dirname,'./views')) //ubico donde estan las plantillas a renderizar
const mensajes = []


//Conexion de Socket.io
const io = new Server(server)
io.on("connection", (socket) => {
    console.log("Conexion con Socket.io")
    socket.on('mensaje', info => {
        console.log(info)
        mensajes.push(info)
        io.emit('mensajes', mensajes)
    })
})

//Routes
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/api/product', productRouter)
app.use('/api/carts',cartRouter)
app.use('api/messages',messageRouter)

//HandleBars


app.get('/static', async (req,res) =>{
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
        rutaCSS: "style"
    })
})

app.get('/static/realtimeproducts', async (req,res) =>{
    try {
        await productManager.getProducts();
        const productos = productManager.products;
        res.render("realTimeProducts", {
            rutaCSS: "realtimeproducts",
            rutaJS: "realTimeProducts",
            productos: productos
        })
    } catch (error) {
        console.log(error);
    }
})

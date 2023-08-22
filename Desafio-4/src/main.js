import express from 'express'
import multer from 'multer'
import routerProd from './routes/products.routes.js'
import routerCart from './routes/cart.routes.js'
import { __dirname } from './path.js'
import {engine} from 'express-handlebars'
import { Server } from 'socket.io'
import path from 'path'
import { ProductManager } from './controllers/ProductManager.js';
const productManager = new ProductManager('src/models/');


const PORT = 4000
const app = express()

//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server)
//Config
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req,file,cb) =>{
        cb(null, `${file.originalname}${Date.now()}`) //Me aseguro de que no se pisen los nombres de diferentes archivos
    }
})

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname,'./views'))

const upload = multer({ storage: storage })

//Conexion de Socket.io

io.on("connection", (socket) => {
    console.log("Conexion con Socket.io")
    socket.on('nuevoProducto', async (prod) => {
        console.log(prod)
        //Deberia agregarse al txt o json mediante addProduct
        await productManager.addProduct(prod)
        socket.emit("mensajeProductoCreado", "El producto se creo correctamente")
    })
})
//Routes
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/api/product', routerProd)
app.use('/api/carts',routerCart)

//HandleBars


app.get('/static', async (req,res) =>{
    try {
        await productManager.getProducts();
        const productos = productManager.products;

        res.render("home", {
            rutaCSS: "home",
            rutaJS: "home",
            productos: productos
        });
    } catch (error) {
        console.log(error);
    }
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

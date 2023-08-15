import express from 'express'
import multer from 'multer'
import routerProd from './routes/products.routes.js'
import routerCart from './routes/cart.routes.js'
import { __dirname } from './path.js'
import path from 'path'
const PORT = 4000
const app = express()

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
const upload = multer({ storage: storage })

//Routes
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/api/product', routerProd)
app.use('/api/carts',routerCart)

//Server
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
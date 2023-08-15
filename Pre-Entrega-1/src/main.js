import express from 'express'
import multer from 'multer'
import routerProd from './router/products.routes.js'
import { __diraname } from './path.js'
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


//Server
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
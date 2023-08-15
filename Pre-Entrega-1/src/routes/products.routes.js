import { Router } from 'express'
import { ProductManager } from '../controllers/ProductManager.js'

const productManager = new ProductManager('src/models/productos.txt')

const routerProd = Router()


import { Router } from 'express'
import { Product, ProductManager } from '../controllers/ProductManager.js';

const productManager = new ProductManager('src/models/')

const routerProd = Router()

routerProd.get('/', async (req, res) => {
    const { limit } = req.query
    await productManager.getProducts()
    const products = productManager.products.slice(0, limit)
    res.status(200).send(products)
})
routerProd.get('/:pid', async (req, res) => {
    const { pid } = req.params
    await productManager.getProducts()
    const prod = await productManager.getProductById(parseInt(pid))
    if (prod)
        res.status(200).send(prod)
    else
        res.status(404).send("Error 404: El producto no existente")
})
routerProd.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock, category } = req.body;
    const newProduct = new Product(title, description, price, thumbnail, code, stock, category);
    console.log(newProduct);
    await productManager.getProducts()
    console.log(productManager.products);
    const confirmacion = await productManager.addProduct(newProduct)
    if (confirmacion){
        res.status(200).send("Producto creado correctamente")
        console.log(req.body);
    }
    else
        res.status(400).send("Producto ya existente")
})

routerProd.put('/:pid', async (req, res) => {
    await productManager.getProducts()
    const confirmacion = await productManager.updateProduct(parseInt(req.params.pid), req.body)
    console.log(req.params.pid, req.body);
    if (confirmacion)
        res.status(200).send("Producto actualizado correctamente")
    else
        res.status(404).send("Error 404: Producto no encontrado")
})

routerProd.delete('/:pid', async (req, res) => {
    await productManager.getProducts()
    const confirmacion = await productManager.deleteProduct(parseInt(req.params.pid))
    if (confirmacion)
        res.status(200).send("Producto eliminado correctamente")
    else    
        res.status(404).send("Error 404: Producto no encontrado")
})
export default routerProd

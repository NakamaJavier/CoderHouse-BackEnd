import { Router } from 'express'
import { CartsManager } from '../controllers/CartManager.js'
import { ProductManager } from '../controllers/ProductManager.js';

const productManager = new ProductManager('src/models/')
const cartsManager = new CartsManager('src/models/')
const routerCart = Router()

routerCart.get('/:cid', async (req, res) => {
    const { cid } = req.params
    await cartsManager.getCart()
    const idCart = await cartsManager.getCartById(cid)
    res.status(200).send(idCart)
})

routerCart.post('/', async (req, res) => {
    await cartsManager.getCart()
    const confirmacion = cartsManager.addCart()
    if (confirmacion){
        res.status(200).send("Carrito creado correctamente")
    }
    else
        res.status(400).send("Error al crear carrito") //Por ahora no hay forma de que pase esto, lo dejo por posible condicion futura
})

routerCart.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid} = req.params;
    await productManager.getProducts()
    console.log(productManager.products);
    await cartsManager.getCart()
    const newProduct = await productManager.getProductById(pid)
    let confirmacion
    if(newProduct){
        console.log("El producto con esa ID existe y es: ", newProduct);
        confirmacion = await cartsManager.addProductToCart(cid,pid)
    }
    else{
        console.log("El producto con esa ID no existe");
        confirmacion = false
    }
        if (confirmacion){
            res.status(200).send("Producto agregado correctamente al carrito")
        }
        else
            res.status(404).send("Error el carrito y/o el producto no existe")

})

export default routerCart
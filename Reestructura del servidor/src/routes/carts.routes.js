import { Router } from "express"
import cartModel from "../models/carts.models.js"
import productModel from "../models/products.models.js"
import { getCart, postProdToCart, putProdQuantityInCart, putProdsToCart } from "../controllers/carts.controllers.js"

const cartRouter = Router()

cartRouter.get("/:cid", getCart)

cartRouter.post("/:cid/products/:id_prod", postProdToCart)

cartRouter.put("/:cid/products/:id_prod", putProdQuantityInCart)

cartRouter.put("/:cid", putProdsToCart)

cartRouter.delete("/:cid/products/:id_prod", async (req,res)=>{
    const {cid, id_prod } = req.params
    try{
        const cart = await cartModel.findById(cid)
        if(!cart)//me aseguro que exista el carrito
            res.status(404).send({resultado: "Cart Not Found", message: cart})
        else{
            const prodVerify = await productModel.findById(id_prod)
            if(prodVerify){//me aseguro que exista el producto
                const productIndex = cart.products.findIndex((product) => product.id_prod.equals(id_prod))
                if(productIndex>=0){//si el producto existe en el carrito
                    cart.products.splice(productIndex,1)
                    const respuesta = await cartModel.findByIdAndUpdate(cid,{products: cart.products})
                    res.status(200).send({resultado: "OK", message: `Producto eliminado del carrito:`,respuesta})
                }else{
                    res.status(404).send({resultado: "Product not Found", message: "El producto no fue encontrado en el carrito"})
                }
            }else
                res.status(404).send({resultado:"Product not Found", message: `El producto con esa ID: ${id_prod} no existe`})
        }
    }catch (error){
        res.status(400).send({error: `Error al agregar producto: ${error}`})
    }
})

cartRouter.post("/", async (req,res)=>{
    try{
        const respuesta = await cartModel.create({})
        res.status(200).send({resultado: "OK", message: respuesta})
    }catch (error){
        res.status(400).send({error: `Error al agregar producto: ${error}`})
    }
})

cartRouter.delete("/:cid", async (req, res) => {
    const {cid} = req.params
    try{
        const cart = await cartModel.findByIdAndUpdate(cid, {products : []})
        if(cart)
            res.status(200).send({resultado: "OK", message: "Carrito vaciado"})
        else    
            res.status(404).send({resultado: "Cart Not Found", message: cart})
    }catch (error){
        res.status(400).send({error: `Error al consultar productos: ${error}`})
    }
})

export default cartRouter


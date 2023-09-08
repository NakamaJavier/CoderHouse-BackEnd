import { Router } from "express"
import cartModel from "../models/carts.models.js"
import productModel from "../models/products.models.js"

const cartRouter = Router()

cartRouter.get("/:cid", async (req, res) => {
    const { cid } = req.params
    try{
        const cart = await cartModel.find()
        res.status(200).send({resultado: "OK", message: cart})
    }catch (error){
        res.status(400).send({error: `Error al consultar productos: ${error}`})
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

cartRouter.put("/:id_cart/product/:id_prod/:quantity", async (req,res)=>{
    const {id_cart , id_prod , quantity} = req.params
    try{
        const cart = await cartModel.findById(id_cart)
        if(cart){
            const prod = await productModel.findById(id_prod)
            if(prod){
                const existingProductIndex = cart.products.findIndex(product => product.id_prod.toString() === id_prod)
                console.log(cart);
                if(existingProductIndex !== -1){ //existe el producto en el carrito
                    cart.products[existingProductIndex].quantity = cart.products[existingProductIndex].quantity + parseInt(quantity)
                    console.log("cart actualizado",cart);
                    const respuesta = await cartModel.findByIdAndUpdate(id_cart,cart)
                    res.status(200).send({resultado: "OK", message: `producto actualizado: ${cart.products[existingProductIndex]}`})
                }else{
                    cart.products.push({
                        id_prod: id_prod,
                        quantity: parseInt(quantity)
                    })
                    const respuesta = await cartModel.findByIdAndUpdate(id_cart,cart)
                    res.status(200).send({resultado: "OK", message: `producto agregado: ${respuesta}`})
                }
            }else{
                res.status(404).send({resultado: "Product not Found", message: prod})
            }
        }else
            res.status(404).send({resultado:"Cart not Found", message: prod})
    }catch (error){
        res.status(400).send({error: `Error al agregar producto: ${error}`})
    }
})


export default cartRouter
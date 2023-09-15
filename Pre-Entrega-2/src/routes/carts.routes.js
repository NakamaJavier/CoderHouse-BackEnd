import { Router } from "express"
import cartModel from "../models/carts.models.js"
import productModel from "../models/products.models.js"

const cartRouter = Router()

cartRouter.get("/:cid", async (req, res) => {
    const {cid} = req.params
    try{
        const cart = await cartModel.findById(cid)
        console.log(JSON.stringify(cart));
        if(cart)
            res.status(200).send({resultado: "OK", message: cart})
        else    
            res.status(404).send({resultado: "Cart Not Found", message: cart})
    }catch (error){
        res.status(400).send({error: `Error al consultar productos: ${error}`})
    }
})

cartRouter.post("/:cid/products/:id_prod", async (req,res)=>{
    const {cid, id_prod } = req.params
    const {quantity} = req.body
    try{
        const cart = await cartModel.findById(cid)
        if(!cart)//me aseguro que exista el carrito
            res.status(404).send({resultado: "Cart Not Found", message: cart})
        else{
            const prodVerify = await productModel.findById(id_prod)
            if(prodVerify){//me aseguro que exista el producto
                const productIndex = cart.products.findIndex((product) => product.id_prod==id_prod)
                if(productIndex>=0){//si el producto ya existe en el carrito
                    cart.products[productIndex].quantity += quantity
                    const respuesta = await cartModel.findByIdAndUpdate(cid,{products: cart.products})
                    res.status(200).send({resultado: "OK, se actualizo el producto", message: respuesta})
                }else{
                    cart.products.push({id_prod:id_prod, quantity: quantity})
                    const respuesta = await cartModel.findByIdAndUpdate(cid,{products: cart.products})
                    res.status(200).send({resultado: "OK, se agrego el producto", message: respuesta})
                }
            }else
                res.status(404).send({resultado:"Product not Found", message: `El producto con esa ID: ${id_prod} no existe`})
        }
    }catch (error){
        res.status(400).send({error: `Error al agregar producto: ${error}`})
    }
})

cartRouter.put("/:cid/products/:id_prod", async (req,res)=>{
    const {cid, id_prod } = req.params
    const {quantity} = req.body
    try{
        const cart = await cartModel.findById(cid)
        if(!cart)//me aseguro que exista el carrito
            res.status(404).send({resultado: "Cart Not Found", message: cart})
        else{
            const prodVerify = await productModel.findById(id_prod)
            if(prodVerify){//me aseguro que exista el producto
                const productIndex = cart.products.findIndex((product) => product.id_prod.equals(id_prod))
                if(productIndex>=0){//si el producto ya existe en el carrito
                    cart.products[productIndex].quantity = quantity
                    const respuesta = await cartModel.findByIdAndUpdate(cid,{products: cart.products})
                    res.status(200).send({resultado: "OK", message: "se actualizo el producto",respuesta})
                }else{
                    res.status(404).send({resultado: "El producto no fue encontrado en el carrito", message: respuesta})
                }
            }else
                res.status(404).send({resultado:"Product not Found", message: `El producto con esa ID: ${id_prod} no existe`})
        }
    }catch (error){
        res.status(400).send({error: `Error al agregar producto: ${error}`})
    }
})

cartRouter.put("/:cid", async (req,res)=>{
    const {cid} = req.params
    const {productos} = req.body
    try{
        const cart = await cartModel.findById(cid)
        if(!cart)//me aseguro que exista el carrito
            res.status(404).send({resultado: "Cart Not Found", message: cart})
        else{
            let error=false
            for ( let i=0;i < productos.length;i++){
                let prodVerify = await productModel.findById(productos[i].id_prod)
                if(prodVerify){//me aseguro que exista el producto
                    console.log("hola");
                    console.log(productos[i]._id);
                    let productIndex = cart.products.findIndex((product) => product.id_prod==productos[i].id_prod)
                    console.log("chau");
                    if(productIndex>=0){//si el producto ya existe en el carrito
                        cart.products[productIndex].quantity += productos[i].quantity
                    }else{
                        cart.products.push({id_prod:productos[i].id_prod, quantity: productos[i].quantity})
                    }
                }else
                    error=true
            }
            if(error)
                res.status(404).send({resultado:"Product/s not Found", message: `Uno de los productos no exisen`})
            else{
                const respuesta = await cartModel.findByIdAndUpdate(cid,{products: cart.products})
                res.status(200).send({resultado: "OK", message: "Se actualizo el carrito con los productos"})
            }
        }
    }catch (error){
        res.status(400).send({error: `Error al agregar producto: ${error}`})
        
    }
})

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
        const respuesta = await cartModel.create({
        })
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


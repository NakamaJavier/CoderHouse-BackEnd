import { Router } from "express"
import cartModel from "../models/carts.models.js"
import productModel from "../models/products.models.js"

const cartRouter = Router()

cartRouter.get("/", async (req, res) => {
    try{
        const cart = await cartModel.find()
        res.status(200).send({resultado: "OK", message: cart})
    }catch (error){
        res.status(400).send({error: `Error al consultar productos: ${error}`})
    }
})

cartRouter.post("/:id_prod/:quantity", async (req,res)=>{
    const {id_prod , quantity } = req.params
    try{
        const prodVerify = await productModel.findById(id_prod)
        if(prodVerify){
            const prod = await cartModel.findOne({_id: id_prod})
            if(!prod){
                const respuesta = await cartModel.create({
                    id_prod , quantity
                })
                res.status(200).send({resultado: "OK", message: respuesta})
            }else{
                await cartModel.updateOne({_id: id_prod},{quantity: +quantity})
                res.status(200).send({resultado: "OK", message: respuesta})
            }
            
        }else
            res.status(404).send({resultado:"Product not Found", message: prod})
    }catch (error){
        res.status(400).send({error: `Error al agregar producto: ${error}`})
    }
})

cartRouter.post("/", async (req,res)=>{
    const {id_prod , quantity } = req.body
    try{
        const respuesta = await cartModel.create({
            id_prod , quantity
        })
        res.status(200).send({resultado: "OK", message: respuesta})
    }catch (error){
        res.status(400).send({error: `Error al agregar producto: ${error}`})
    }
})

export default cartRouter
import { Router } from "express"
import productModel from "../models/products.models.js"

const productRouter = Router()

productRouter.get("/", async (req,res)=>{
    let {limit,page,sort,category,status} = req.query
    console.log(limit,page,sort,category,status);
    const filter = {}
    if(status)
        filter.status = status
    if(category)
        filter.category = category
    let sortBy = {} 
    if(sort=="asc"||sort=="desc")
        sortBy.price = sort
    if(!limit || limit<=0)
        limit = 10
    if(!page)
        page = 1
    console.log(limit,page,sort,category,status);
    try{
        const prods = await productModel.paginate(filter,{limit: limit, page:page, sort:sortBy })
        console.log(prods);
        res.status(200).send({resultado: "OK", message: prods})
    }catch (error){
        res.status(400).send({error: `Error al consultar productos: ${error}`})
    }
})

productRouter.get("/:id", async (req,res)=>{
    const {id} = req.params
    try{
        const prod = await productModel.findById(id)
        if(prod)
            res.status(200).send({resultado: "OK", message: prod})
        else
            res.status(404).send({resultado:"Not Found", message: prod})
        
    }catch (error){
        res.status(400).send({error: `Error al consultar producto: ${error}`})
    }
})

productRouter.post("/", async (req,res)=>{
    const {title, description, category, code, price, stock } = req.body
    try{
        const prod = await productModel.create({
            title, description, category, code, price, stock
        })
        res.status(200).send({resultado: "OK", message: prod})
    }catch (error){
        res.status(400).send({error: `Error al crear producto: ${error}`})
    }
})

productRouter.put("/:id", async (req,res)=>{
    const { id } = req.params
    const {title, description, category, code, price, status , stock } = req.body
    try{
        const prod = await productModel.findByIdAndUpdate(id, {title, description, category, code, price,status, stock }) //si no paso en el body alguno de los parametros esos parametros se mantendran sin modificar
        if(prod)
            res.status(200).send({resultado: "OK", message: prod})
        else
            res.status(404).send({resultado:"Not Found", message: prod})
        
    }catch (error){
        res.status(400).send({error: `Error al actualizar producto: ${error}`})
    }
})

productRouter.delete("/:id", async (req,res)=>{
    const {id} = req.params
    try{
        const respuesta = await productModel.findByIdAndRemove(id)
        if(respuesta)
            res.status(200).send({resultado: "OK", message: respuesta})
        else
            res.status(404).send({resultado:"Not Found", message: respuesta})
        
    }catch (error){
        res.status(400).send({error: `Error al eliminar producto: ${error}`})
    }
})

export default productRouter
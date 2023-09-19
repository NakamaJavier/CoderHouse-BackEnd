import { Router } from "express"
import productModel from "../models/products.models.js"

const productRouter = Router()

productRouter.get("/", async (req,res)=>{
    let {limit,page,sort,category,status} = req.query
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
    console.log(`limit: ${limit}, page: ${page}, sort: ${sort}, category: ${category}, status: ${status}`);
    try{
        const prods = await productModel.paginate(filter,{limit: limit, page:page, sort:sortBy })
        //console.log(prods);
        //Armo los links:

        const linkBuilder = (req, pageVerifier, page)=>{
            let link
            if(pageVerifier){ //revisa si existe la pagina contigua 
                if (req.originalUrl.includes("page=")) { //verifica si en la url del request, entre los query params se haya "page"
                    link = req.originalUrl.replace(/page=[^&]+/, `page=${page}`); //reemplaza de la url el valor que seguía a "page=" por el valor de page
                }
                else {
                    link = `${req.originalUrl}${req.originalUrl.includes("?") ? "&" : "?"}page=${page}`; //si no esta el "page" entre los query params, lo agrego al final de la url (si no había un query param agrega el '?' y si no el '&') concatenado con el valor de page
                }
            }
            else
                link = null
            return link
            }
        const nextLink = linkBuilder(req,prods.hasNextPage,prods.nextPage)
        const prevLink = linkBuilder(req,prods.hasPrevPage,prods.prevPage)
        
        const statusRes = res.statusCode == 200 ? "success" : "error"
        const formatedProds = {
            status: statusRes,
            payload: prods.docs,
            totalPages: prods.totalPages,
            prevPage: prods.prevPage,
            nextPage: prods.nextPage,
            page: prods.page,
            hasPrevPage: prods.hasPrevPage,
            hasNextPage: prods.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink,
        }
        console.log(formatedProds);
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
import cartModel from "../models/carts.models.js"
import productModel from "../models/products.models.js"
import ticketModel from "../models/ticket.models.js"

export const getCart = async (req, res) => {
    const {cid} = req.params
    try{
        const cart = await cartModel.findById(cid)
        console.log(JSON.stringify(cart));
        if(cart)
            return res.status(200).send({resultado: "OK", message: cart})
        else    
            return res.status(404).send({error:"Carrito no encontrado"})
    }catch (error){
        return res.status(500).send({error: `Error al consultar productos: ${error}`})
    }
}

export const postProdToCart = async (req, res) => {
    const {cid, id_prod } = req.params
    const {quantity} = req.body
    try{
        const cart = await cartModel.findById(cid)
        if(!cart){//me aseguro que exista el carrito
            return res.status(404).send({ error: "Carrito no encontrado", message: `El carrito con ID: ${cid} no existe` })
        }
        const prodVerify = await productModel.findById(id_prod)
        if (!prodVerify) {
            return res.status(404).send({ error: "Producto no encontrado", message: `El producto con ID: ${id_prod} no existe` })
        }
        console.log("El cart Products es:", cart.products);
        const productIndex = cart.products.findIndex((product) => product.id_prod._id == id_prod)
        if (productIndex >= 0) {
            cart.products[productIndex].quantity += quantity
        } else {
            cart.products.push({ id_prod: id_prod, quantity: quantity })
        }
        const respuesta = await cartModel.findByIdAndUpdate(cid, { products: cart.products },{ new: true })
        const status = productIndex >= 0 ? "Actualizado" : "Agregado"
        const statusCode = productIndex >= 0 ? 200 : 201
        return res.status(statusCode).send({ resultado: "OK", status: status, message: respuesta })
    }catch (error){
        return res.status(500).send({error: `Error al consultar productos: ${error}`})
    }
}

export const putProdQuantityInCart = async (req, res) => {
    const {cid, id_prod } = req.params
    const {quantity} = req.body
    try{
        const cart = await cartModel.findById(cid)
        if(!cart){//me aseguro que exista el carrito
            return res.status(404).send({ error: "Carrito no encontrado", message: `El carrito con ID: ${cid} no existe` })
        }else{
            const prodVerify = await productModel.findById(id_prod)
            if(prodVerify){//me aseguro que exista el producto
                const productIndex = cart.products.findIndex((product) => product.id_prod.equals(id_prod))
                if(productIndex>=0){//si el producto ya existe en el carrito
                    cart.products[productIndex].quantity = quantity
                    const respuesta = await cartModel.findByIdAndUpdate(cid,{products: cart.products},{ new: true })
                    return res.status(200).send({resultado: "OK", message: "se actualizo el producto",respuesta})
                }else{
                    return res.status(404).send({ error: "Producto no encontrado dentro del carrito" })
                }
            }else
                return res.status(404).send({ error: "Producto no encontrado", message: `El producto con ID: ${id_prod} no existe` })
        }
    }catch (error){
        return res.status(500).send({error: `Error al agregar producto: ${error}`})
    }
}

export const putProdsToCart = async (req, res) => {
    const {cid} = req.params
    const {productos} = req.body
    try{
        const cart = await cartModel.findById(cid)
        if(!cart)//me aseguro que exista el carrito
            return res.status(404).send({ error: "Carrito no encontrado", message: `El carrito con ID: ${cid} no existe` })
        else{
            let error=false
            for ( let i=0;i < productos.length;i++){
                let prodVerify = await productModel.findById(productos[i].id_prod)
                if(prodVerify){//me aseguro que exista el producto
                    console.log(productos[i]._id);
                    let productIndex = cart.products.findIndex((product) => product.id_prod._id == productos[i].id_prod)
                    if(productIndex>=0){//si el producto ya existe en el carrito
                        cart.products[productIndex].quantity += productos[i].quantity
                    }else{
                        cart.products.push({id_prod:productos[i].id_prod, quantity: productos[i].quantity})
                    }
                }else
                    error=true
            }
            if(error)
                return res.status(404).send({error:"Product/s not Found", message: `Al menos uno de los productos no existe`})
            else{
                const respuesta = await cartModel.findByIdAndUpdate(cid,{products: cart.products},{ new: true })
                return res.status(200).send({resultado: "OK", message: `Se actualizo el carrito con los siguientes productosÑ ${respuesta}`})
            }
        }
    }catch (error){
        return res.status(500).send({error: `Error al consultar productos: ${error}`})
        
    }
}

export const deleteProdInCart = async (req, res) => {
    const {cid, id_prod } = req.params
    try{
        const cart = await cartModel.findById(cid)
        if(!cart)//me aseguro que exista el carrito
            return res.status(404).send({resultado: "Cart Not Found", message: cart})
        else{
            const prodVerify = await productModel.findById(id_prod)
            if(prodVerify){//me aseguro que exista el producto
                const productIndex = cart.products.findIndex((product) => product.id_prod.equals(id_prod))
                if(productIndex>=0){//si el producto existe en el carrito
                    cart.products.splice(productIndex,1)
                    const respuesta = await cartModel.findByIdAndUpdate(cid,{products: cart.products},{new:true})
                    return res.status(200).send({resultado: "OK", message: `Producto eliminado del carrito:`,respuesta})
                }else{
                    return res.status(404).send({resultado: "Product not Found", message: "El producto no fue encontrado en el carrito"})
                }
            }else
                return res.status(404).send({resultado:"Product not Found", message: `El producto con esa ID: ${id_prod} no existe`})
        }
    }catch (error){
        return res.status(500).send({error: `Error al agregar producto: ${error}`})
    }
}

export const postCart = async (req, res) => {
    try {
        const respuesta = await cartModel.create({});
        return res.status(201).send({ resultado: "OK", message: respuesta });
    } catch (error) {
        return res.status(500).send({ error: `Error al crear el carrito: ${error}` });
    }
}

export const deleteEmptyCart = async (req, res) => {
    const {cid} = req.params
    try{
        const cart = await cartModel.findByIdAndUpdate(cid, {products : []})
        if(cart)
            return res.status(200).send({resultado: "OK", message: "Carrito vaciado"})
        else    
            return res.status(404).send({resultado: "Carrito no Encontrado", message: cart})
    }catch (error){
        return res.status(500).send({error: `Error al consultar productos: ${error}`})
    }
}

export const postPurchase = async (req, res) => {
    const {cid} = req.params
    let totalPrice = 0
    try{
        const cart = await cartModel.findById(cid)
        if(cart){
            if(cart.products.length>0){
                const productsToBuy = [];
                const productsNotAvailable = []
                for (const item of cart.products) {
                    const product = await productModel.findById(item.id_prod);
                    if (product){
                        if( product.stock >= item.quantity) {
                        totalPrice += (product.price*item.quantity)
                        productsToBuy.push({
                            id_prod: product._id,
                            quantity: item.quantity
                        })
                        }else{
                            productsNotAvailable.push({id_prod: product._id})
                        }
                    } else {
                    return res.status(404).send({
                        error: `Un producto no fue encontrado: ${item.id_prod}`});
                    }
                }
                //hago de nuevo un for aca y no descuento antes, porque si hay un error en alguno de los productos del carrito la compra nunca se realiza y estaria mal restar el stock
                for (const item of productsToBuy) {
                    await productModel.findByIdAndUpdate(item.id_prod,{ $inc: { stock: -item.quantity } })
                }
                if(productsToBuy.length>0){
                    const ticket = await ticketModel.create({
                        amount: totalPrice,
                        purchaser: req.user.user.email,
                        detail: productsToBuy
                    })
                    await cartModel.findByIdAndUpdate(cid, {products : []})
                    if(productsToBuy.length == cart.products.length)
                        return res.status(200).send({ resultado: "OK", message: "Compra realizada exitosamente", productsToBuy, ticket});
                    else
                    return res.status(200).send({ resultado: "OK", message: `Compra realizada parcialmente, no se pudo concretar la compra en los siguientes productos por falta de stock: ${productsNotAvailable}`, productsToBuy, productsNotAvailable, ticket});
                }else
                    return res.status(400).send({ resultado: "Error", message: `No se pudo comprar ningun producto por falta de stock`});
            }else
                return res.status(400).send({ error: `Carrito vacio`});
        }else {
            return res.status(404).send({
                error: `Carrito no encontrado: ${cid}`
            });
        }
    }catch (error){
        return res.status(500).send({error: `Error al Realizar la compra: ${error}`})
    }
}
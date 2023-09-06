import { Router } from "express"
import cartModel from "../models/carts.models.js"

const cartRouter = Router()

cartRouter.get("/", async (req, res) => {
    try{
        const cart = await cartModel.find()
        res.status(200).send({resultado: "OK", message: cart})
    }catch (error){
        res.status(400).send({error: `Error al consultar productos: ${error}`})
    }
})

//crea
cartRouter.post("/", async (req, res) => {
    const { id_prod, quantity } = req.body;
    try {
        // Buscar si el producto ya existe en el carrito
        const existingCart = await cartModel.findOne({ "products.id_prod": id_prod });

        if (existingCart) {
            // Si el producto existe, actualiza la cantidad
            existingCart.products.forEach((product) => {
                if (product.id_prod === id_prod) {
                    product.quantity += quantity;
                }
            });

            // Guarda la actualización en la base de datos
            await existingCart.save();

            res.status(200).send({ resultado: "OK", message: existingCart });
        } else {
            // Si el producto no existe, crea una nueva entrada en el carrito
            const newCart = await cartModel.create({
                products: [{ id_prod, quantity }]
            });

            res.status(200).send({ resultado: "OK", message: newCart });
        }
    } catch (error) {
        res.status(400).send({ error: `Error al agregar producto: ${error}` });
    }
});


export default cartRouter
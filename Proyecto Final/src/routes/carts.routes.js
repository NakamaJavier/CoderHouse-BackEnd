import { Router } from "express"
import { deleteEmptyCart, deleteProdInCart, getCart, postCart, postProdToCart, postPurchase, putProdQuantityInCart, putProdsToCart } from "../controllers/carts.controllers.js"
import { passportError, authorization } from "../utils/messageErrors.js"

const cartRouter = Router()

cartRouter.get("/:cid", getCart)
cartRouter.post("/:cid/products/:id_prod",passportError('jwt'), authorization('user'), postProdToCart)
cartRouter.put("/:cid/products/:id_prod",passportError('jwt'), authorization('user'), putProdQuantityInCart)
cartRouter.put("/:cid",passportError('jwt'), authorization('user'), putProdsToCart)
cartRouter.delete("/:cid/products/:id_prod",passportError('jwt'), authorization('user'),deleteProdInCart)
//cartRouter.post("/", postCart)    //No se usa mas porque se crea un carrito cuando se crea un usuario
cartRouter.delete("/:cid",passportError('jwt'), authorization('user'), deleteEmptyCart)
cartRouter.post("/:cid/purchase",passportError('jwt'), authorization('user'), postPurchase)
export default cartRouter


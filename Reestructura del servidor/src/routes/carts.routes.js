import { Router } from "express"
import { deleteEmptyCart, deleteProdInCart, getCart, postCart, postProdToCart, putProdQuantityInCart, putProdsToCart } from "../controllers/carts.controllers.js"

const cartRouter = Router()

cartRouter.get("/:cid", getCart)
cartRouter.post("/:cid/products/:id_prod", postProdToCart)
cartRouter.put("/:cid/products/:id_prod", putProdQuantityInCart)
cartRouter.put("/:cid", putProdsToCart)
cartRouter.delete("/:cid/products/:id_prod",deleteProdInCart)
cartRouter.post("/", postCart)
cartRouter.delete("/:cid", deleteEmptyCart)

export default cartRouter


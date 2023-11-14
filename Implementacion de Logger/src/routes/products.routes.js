import { Router } from "express"
import { deleteProduct, getProduct, getProducts, postProduct, putProduct } from "../controllers/products.controller.js"

const productRouter = Router()

productRouter.get("/", getProducts)
productRouter.get("/:id",getProduct)
productRouter.post("/", postProduct)
productRouter.put("/:id", putProduct)
productRouter.delete("/:id", deleteProduct)

export default productRouter
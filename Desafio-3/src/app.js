import express from 'express'
//importo libreria del desafio 2
import ProductManager from "./ProductManager.js";

//creo una instancia de la clase ProductManager
const Products = new ProductManager("./src/")

//app va a poder ejecutar todos los metodos de express
const app = express()
const PORT = 4000

//Por si se requieren queries complejas
//app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("Desafio-3")
})

app.get('/productos/:id', async (req, res) => {
    await Products.getProducts()
    const prod = Products.products.find(prod => prod.id === parseInt(req.params.id))
    if (prod)
        res.send(prod)
    else
    res.send("Producto no encontrado")
})

app.get('/productos', async (req, res) => {
    await Products.getProducts()
    const { limit } = req.query
    if(limit){
        const prods = Products.products.slice(0,parseInt(limit))
        res.send(prods)
    }
    else
    res.send(Products.products)
})

//Ruta 404 es la ultima que se define
app.get('*', (req, res) => {
    res.send("Error 404")
})


app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

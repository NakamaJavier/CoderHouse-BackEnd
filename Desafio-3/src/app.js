import express from 'express'
//importo libreria del desafio 2
import ProductManager from "./ProductManager.js";

//creo una instancia de la clase ProductManager
const Products = new ProductManager("./src/")

//cargo los productos del archivo products.json, que fue generado en el desafio-2 y cargado directamente
await Products.getProducts()
//console.log("\n\nImpresion de la lista de preductos del getProducts:\n",Products.products);

//app va a poder ejecutar todos los metodos de express
const app = express()
const PORT = 4000

//Poder ejecutar queries complejas
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("Hola desde el sur")
})

//res.send() actua como un return implicito
app.get('/productos/:id', async (req, res) => {
    const prod = productos.find(prod => prod.id === parseInt(req.params.id))
    if (prod)
        res.send(prod)
    res.send("Producto no encontrado")
})

app.get('/productos', async (req, res) => {
    const { categoria } = req.query
    const prods = productos.filter(prod => prod.categoria === categoria)
    res.send(prods)
})

//Ruta 404 es la ultima que se define
app.get('*', (req, res) => {
    res.send("Error 404")
})


app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

//POR FAVOR PARA DEVOLVER POR LIMITE EN EL ARRAY USEN SLICE Y NO SPLICE
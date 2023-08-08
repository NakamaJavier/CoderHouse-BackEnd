import {promises as fs} from "fs"

class Product{
    constructor(title,description,price,thumbnail,code,stock){
            this.id = null
            this.title = title
            this.description= description
            this.price = price
            this.thumbnail = thumbnail
            this.code = code
            this.stock = stock
    }
}

class ProductManager {
    constructor(rute){
        this.products = []
        this.path = rute
    }
    //Genera el id del producto nuevo en la lista de productos, verificando cual es el menor valor de id faltante en la lista
    idGenerator(){
        let smallestId = 1
        if(this.products && this.products.length > 0){
            console.log("Entre al idgenrator");
            const ids = this.products.map((product)=> product.id)
            ids.sort((a,b)=> a-b)
            ids.forEach(id => {
                if(id==smallestId)
                smallestId++
            })
        }
        return smallestId
    }

    async addProduct (product){
        if(product.title && product.description && product.price && product.thumbnail && product.code && product.stock){
            if(!this.products.some((item)=>item.code==product.code)){
            product.id = this.idGenerator()
            this.products.push(product)
            const productsJson = JSON.stringify(this.products)
            await fs.writeFile(`${this.path}products.json`, productsJson)
            console.log("\n\nSe agrego el producto:", product, "\nCon exito a la lista" );
        }else
        console.log("\n\nError: No se agrego el producto",product, " porque el codigo: ",product.code, "ingresado ya existe en la lista");
        }else
        console.log("\n\nError: No se agrego el producto",product, " porque el producto no posee uno de sus atributos");
    }

    async getProducts(){
        try{
        let contenido = await fs.readFile(`${this.path}products.json`,"utf-8")
        const contenidoParseado = JSON.parse(contenido)
        this.products = contenidoParseado
        } catch(error){
            console.error("\n\nError al leer el archivo: el archivo no existe")
        }
    }

    async getProductById(id){
        const idProduct = this.products.find((product)=>product.id==id)
        if(!idProduct){
            return "Error: Product by ID not found"
        }
        else
            return idProduct
    }

    async deleteProduct(id){
        if(this.products.some((product)=> product.id ==id)){
            const updatedProducts = this.products.filter((product) => product.id !== id);
            this.products = updatedProducts
            const updatedProductsJson = JSON.stringify(updatedProducts)
            await fs.writeFile(`${this.path}products.json`, updatedProductsJson)
            console.log("\n\nSe borro correctamente el producto. La lista de productos actual es:", this.products);
        }else
        console.log("\n\nNo se pudo eliminar porque el producto con esa ID no existe");
    }

    async updateProduct(id,newProduct){
        if(this.products.some((product)=> product.id ==id)){
            const index = this.products.findIndex((product) => product.id === id);
            if (index !== -1) {
            newProduct.id = id;
            this.products[index] = newProduct;
            const productsJson = JSON.stringify(this.products)
            await fs.writeFile(`${this.path}products.json`, productsJson)
            console.log("\n\nSe actualizo el el producto:",this.products[index]);
            }
        }else
        console.log("\n\nNo se puede modificar porque el producto con esa ID no existe");

    }


}

//Creo tres instancias del la clase Product para crear 4 productos, 2 validos y 2 invalidos (por tener null en un atributo o por repetirse el code):
const prod1 = new Product("avena quaker","avena instantanea",600,"www.asfdsafdsa.com/asdgsd.jpg",1123,123)
console.log("\n\nEl primer producto es:\n",prod1);
const prod2 = new Product("Dulce de leche Serenisima","Dulce de leche tipo colonial",800,"www.asfasfsafsa.com/sfdasfsa.jpg",6456,634)
console.log("\n\nEl segundo producto es :\n",prod2);
const prod3 = new Product("Termo Lumilagro",12000,null,"www.fdhfdhjdf.com/afsag.jpg",4431,5)
console.log("\n\nEl tercer producto es :\n",prod3);
const prod4 = new Product("Termo Lumilagro","Termo doble capa de acero inoxidable",12000,"www.fdhfdhjdf.com/afsag.jpg",6456,5)
console.log("\n\nEl cuarto producto es :\n",prod4);
const prod6 = new Product("Pate Swift","Pate de foie",500,"www.asfdsafdsa.com/aghdshg.jpg",13679,250)
console.log("\n\nEl primer producto es:\n",prod6);
const prod7 = new Product("Pepas Futuro","Galletita dulce con relleno de membrillo",1000,"www.asfdsafdsa.com/qwtsd.jpg",8647,100)
console.log("\n\nEl primer producto es:\n",prod7);
const prod8 = new Product("Yerba Mate Playadito","Yerba mate",1100,"www.asfdsafdsa.com/sdfgh.jpg",8520,200)
console.log("\n\nEl primer producto es:\n",prod8);
const prod9 = new Product("Termo Lumilagro","Termo doble capa de acero inoxidable",12000,"www.fdhfdhjdf.com/ertre.jpg",2739,5)
console.log("\n\nEl primer producto es:\n",prod9);
const prod10 = new Product("Yogurt Yogurisimo","Yogurt entero firme de vainilla",500,"www.asfdsafdsa.com/asdgsd.jpg",2046,100)
console.log("\n\nEl primer producto es:\n",prod10);
const prod11 = new Product("Queso cremoso Paulina","Queso cremoso",3120,"www.asfdsafdsa.com/dfshgdf.jpg",3214,15)
console.log("\n\nEl primer producto es:\n",prod11);
const prod12 = new Product("Leche Serenisima","Leche descremada",420,"www.asfdsafdsa.com/qwhgcjd.jpg",5436,120)
console.log("\n\nEl primer producto es:\n",prod12);

//Se crea una instancia de la clase ProductManager
const Products = new ProductManager("./")
await Products.getProducts()
//Se prueba la funcion addProduct para los distintos productos creados
await Products.addProduct(prod1)
await Products.addProduct(prod2)
await Products.addProduct(prod3)
await Products.addProduct(prod4)
await Products.addProduct(prod6)
await Products.addProduct(prod7)
await Products.addProduct(prod8)
await Products.addProduct(prod9)
await Products.addProduct(prod10)
await Products.addProduct(prod11)
await Products.addProduct(prod12)

//Se muestra la funcionalidad de getProducts()
await Products.getProducts()
console.log("\n\nImpresion de la lista de preductos del getProducts:\n",Products.products);

//Se prueba la funcion getProductById con un ID valido y otro invalido
const productById1 = await Products.getProductById(3)
console.log("\n\nPrueba de getProductByID con ID no valido:\n", productById1);
const productById2 = await Products.getProductById(1)
console.log("\n\nPrueba de getProductByID con ID valido:\n",productById2);

//Se prueba la funcion updateProduct, a partir de un nuevo producto (se modificaro uno viejo en verdad)
const prod5 = new Product("avena quaker","avena instantanea",750,"www.asfdsafdsa.com/asdgsd.jpg",1123,234)
await Products.updateProduct(1,prod5)

//Se prueba la funcion feleteProduct con un ID valido y otro invalido
//await Products.deleteProduct(1)
//await Products.deleteProduct(3)
await Products.getProducts()
console.log("\n\nImpresion de la lista de preductos del getProducts:\n",Products.products);
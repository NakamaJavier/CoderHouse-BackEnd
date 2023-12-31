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

export default ProductManager;
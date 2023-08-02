import {promises as fs} from "fs"

class Product{
    constructor(title,description,price,thumbnail,code,stock){
        //Me aseguro que se pasen como parametros todas las variables con un valor
        if(title&&description&&price&&thumbnail&&code&&stock){
            this.id = Product.idGenerator()
            this.title = title
            this.description= description
            this.price = price
            this.thumbnail = thumbnail
            this.code = code
            this.stock = stock
        }else
            throw new Error("Todos los parámetros del constructor deben tener un valor.");
    }
    static idGenerator(){
        if(this.idGen){
            this.idGen++
        }
        else
            this.idGen = 1
        return this.idGen
    }
}

class ProductManager {
    constructor(rute){
        this.products = []
        this.path = rute
    }

    async addProduct (product){
            if(!this.products.some((item)=>item.code==product.code)){
            this.products.push(product)
            const productsJson = JSON.stringify(this.products)
            await fs.writeFile("./products.txt", productsJson)
        }else
        console.log("El codigo ingresado ya existe");
    }

    async getProducts(){
        let contenido = await fs.readFile("./products.txt","utf-8")
        console.log(contenido);
    }

    getProductById(id){
        const idProduct = this.products.find((product)=>product.id==id)
        if(idProduct)
        console.log(idProduct);
        else
        console.log("Not Found");
    }


}
const prod1 = new Product("avena quaker","avena instantanea",600,"www.asfdsafdsa.com/asdgsd.jpg",1123,123)
console.log(prod1);
const prod2 = new Product("Dulce de leche Serenisima","Dulce de leche tipo colonial",800,"www.asfasfsafsa.com/sfdasfsa.jpg",6456,634)
console.log(prod2);
const listProducts = new ProductManager("./")
listProducts.addProduct(prod1)
listProducts.addProduct(prod2)
listProducts.getProducts()


// const consultarTXT = async () => {
//     await fs.writeFile("./ejemplo.txt", "Hola,buenas noches")
//         let contenido = await fs.readFile("./ejemplo.txt","utf-8")
//         console.log(contenido);
//         await fs.appendFile("./ejemplo.txt", "\nHola, buenas tardes")
//         await fs.unlink("./ejemplo.txt")

// }

// consultarTXT()
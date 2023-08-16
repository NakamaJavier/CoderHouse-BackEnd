import {promises as fs} from "fs"

export class Cart{
    constructor(id){
        this.id = id
        this.products = []
    }
}

export class CartsManager{
    constructor(rute){
        this.carts = []
        this.path = rute
    }
    idGenerator(){
        let smallestId = 1
        if(this.carts && this.carts.length > 0){
            console.log("Entre al idgenrator");
            const ids = this.carts.map((cart)=> cart.id)
            ids.sort((a,b)=> a-b)
            ids.forEach(id => {
                if(id==smallestId)
                smallestId++
            })
        }
        else
            console.log("No hay carritos existentes");
        return smallestId
    }
    async addCart (){
        const newCart = new Cart(this.idGenerator())
        this.carts.push(newCart)
        const cartsJson = JSON.stringify(this.carts)
        await fs.writeFile(`${this.path}carts.json`, cartsJson)
        console.log("\n\nSe agrego el carrito con exito a la lista" );
        return true
    }
    async getCart(){
        try{
            let contenido = await fs.readFile(`${this.path}carts.json`,"utf-8")
            const contenidoParseado = JSON.parse(contenido)
            this.carts = contenidoParseado
            } catch(error){
                console.error("\n\nError al leer el archivo: el archivo no existe")
            }
    }
    async getCartById(id){
        const idCart = this.carts.find((cart)=> cart.id==id)
        if(!idCart){
            console.log("Error: Cart by ID not found");
            return false
        }
        else
            return idCart
    }
    async addProductToCart (cid,pid){
        const idCart = this.carts.find((cart)=> cart.id==cid)
        if(idCart){
            const anyIdProduct = idCart.products.some((product)=> product.id == pid)
            if(!anyIdProduct){
                const newCartProduct = { id:pid, quantity:0 }
                console.log("El producto nuevo es:",newCartProduct);
                idCart.products.push(newCartProduct)
            }else{
                const addProductQuantity = idCart.products.find((product)=> product.id == pid)
                addProductQuantity.quantity++
                console.log(addProductQuantity.quantity);
                console.log("Se agrego cantidad al producto");
            }
            const cartsJson = JSON.stringify(this.carts)
            await fs.writeFile(`${this.path}carts.json`, cartsJson)
            return true
        }else{
            console.log("\n\nError: No se agrego el producto porque no hay carrito con esa id");
            return false
        }
    
    }
    
}
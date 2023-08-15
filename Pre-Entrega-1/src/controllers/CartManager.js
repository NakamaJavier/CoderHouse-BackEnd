import {promises as fs} from "fs"

export class Cart{
    constructor(products){
        this.id = null
        this.products = []
    }
}

export class Carts{
    constructor(rute){
        this.carts = []
        this.path = rute
    }

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

    
}
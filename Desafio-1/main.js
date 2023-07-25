class ProductManager {
    constructor(){
        this.products = []
    }

    addProduct(title,description,price,thumbnail,code,stock){
        //Me aseguro que se pasen como parametros todas las variables con un valor
        if(title&&description&&price&&thumbnail&&code&&stock){
            if(!this.products.some((product)=>product.code==code)){
            const newProduct = {
                id : this.products.length +1,
                title: title,
                description: description,
                price : price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
            }
            this.products.push(newProduct)
        }else
        console.log("El codigo ingresado ya existe");
    }else
        console.log("Uno de los datos del producto no fue ingresado");
    }

    getProducts(){
        console.log(this.products);
    }

    getProductById(id){
        const idProduct = this.products.find((product)=>product.id==id)
        if(idProduct)
        console.log(idProduct);
        else
        console.log("Not Found");
    }
}

const listProducts = new ProductManager()
//Producto correcto
listProducts.addProduct("EQ21","Zapatilla Adidas",35000,"www.....",12,5)
//Producto incorrecto por repetir el code
listProducts.addProduct("pegasus","Zapatilla Nike",45000,"www.....",12,7)
//Producto correcto.
listProducts.addProduct("tornado","Paleta Head",35000,"www.....",15,2)
//Producto incorrecto por no especificar titulo
listProducts.addProduct("","Zapatilla Nike",45000,"www.....",4,7)
//Producto correcto
listProducts.addProduct("REDMI 10","Celular Xiomi",200000,"www.....",5,3)
//Muestro los datos, deberian ser 3 los almacenados
listProducts.getProducts()
//Muestro correctamente un produto por ID
listProducts.getProductById(2)
//Muestro correctamente un produto por ID
listProducts.getProductById(1)
//Intento acceder a un producto cuya ID no exise.
listProducts.getProductById(4)

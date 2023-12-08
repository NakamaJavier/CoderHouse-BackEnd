export const generateProductErrorInfo = (product) => {
    return ` Una o mas propiedades estan incompletas o no son validas.
    Los requisitos de las propiedades son las siguietnes:
    * title         : necesita ser un String, fue recibido : ${product.title}
    * description   : necesita ser un String, fue recibido : ${product.description}
    * category      : necesita ser un String, fue recibido : ${product.category}
    * code          : necesita ser un String y ser unico, fue recibido : ${product.code}
    * price         : necesita ser un Number, fue recibido : ${product.price}
    * status        : necesita ser un Boolean, fue recibido (no requerido, dafault true) : ${product.status}
    * stock         : necesita ser un String, fue recibido : ${product.title}
    `
}
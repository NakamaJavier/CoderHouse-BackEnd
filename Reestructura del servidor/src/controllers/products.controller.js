import productModel from "../models/products.models.js";

export const getProducts = async (req, res) => {
    let {
        limit,
        page,
        sort,
        category,
        status
    } = req.query
    const filter = {}
    if (status)
        filter.status = status
    if (category)
        filter.category = category
    let sortBy = {}
    if (sort == "asc" || sort == "desc")
        sortBy.price = sort
    if (!limit || limit <= 0)
        limit = 10
    if (!page)
        page = 1
    try {
        const prods = await productModel.paginate(filter, {
            limit: limit,
            page: page,
            sort: sortBy
        })
        const linkBuilder = (req, pageVerifier, page) => {
            let link
            if (pageVerifier) { //revisa si existe la pagina contigua 
                if (req.originalUrl.includes("page=")) { //verifica si en la url del request, entre los query params se haya "page"
                    link = req.originalUrl.replace(/page=[^&]+/, `page=${page}`); //reemplaza de la url el valor que seguía a "page=" por el valor de page
                } else {
                    link = `${req.originalUrl}${req.originalUrl.includes("?") ? "&" : "?"}page=${page}`; //si no esta el "page" entre los query params, lo agrego al final de la url (si no había un query param agrega el '?' y si no el '&') concatenado con el valor de page
                }
            } else
                link = null
            return link
        }
        const nextLink = linkBuilder(req, prods.hasNextPage, prods.nextPage)
        const prevLink = linkBuilder(req, prods.hasPrevPage, prods.prevPage)
        const statusRes = res.statusCode == 200 ? "success" : "error"
        const formatedProds = {
            status: statusRes,
            payload: prods.docs,
            totalPages: prods.totalPages,
            prevPage: prods.prevPage,
            nextPage: prods.nextPage,
            page: prods.page,
            hasPrevPage: prods.hasPrevPage,
            hasNextPage: prods.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink,
        }
        if (!prods.docs.length<1) {
            return res.status(200).send({resultado: "OK", message: formatedProds})
        }
        return res.status(404).send({
            error: "Productos no encontrados"
        })

    } catch (error) {
        return res.status(500).send({
            error: `Error en consultar productos ${error}`
        })
    }

}

export const getProduct = async (req, res) => {
    const {
        id
    } = req.params
    try {
        const product = await productModel.findById(id)
        if (product) {
            return res.status(200).send({resultado: "OK", message: product})
        }
        return res.status(404).send({
            error: "Producto no encontrado"
        })
    } catch (error) {
        return res.status(500).send({
            error: `Error en consultar producto ${error}`
        })
    }
}

export const postProduct = async (req, res) => {
    const {
        title,
        description,
        code,
        price,
        stock,
        category
    } = req.body
    try {
        const product = await productModel.create({
            title,
            description,
            code,
            price,
            stock,
            category
        })
        if (product) {
            return res.status(201).send({resultado: "OK", message: product})
        }
    } catch (error) {
        if (error.code == 11000) {
            return res.status(400).send({
                error: `Llave duplicada`
            })
        }
        return res.status(500).send({
            error: `Error en consultar producto ${error}`
        })
    }
}

export const putProduct = async (req, res) => {
    const { id } = req.params
    const { title,description,code,price,stock,category } = req.body
    try {
        const product = await productModel.findByIdAndUpdate(id, {
            title,
            description,
            code,
            price,
            stock,
            category
        },{ new: true })
        if (product) {
            return res.status(200).send({resultado: "OK", message: product})
        }
        return res.status(404).send({
            error: "Producto no encontrado"
        })
    } catch (error) {
        return res.status(500).send({
            error: `Error en actualizar producto ${error}`
        })
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await productModel.findByIdAndDelete(id)
        if (product) {
            return res.status(200).send({resultado: "OK", message: product})
        }
        res.status(404).send({
            error: "Producto no encontrado"
        })
    } catch (error) {
        res.status(500).send({
            error: `Error en eliminar producto ${error}`
        })
    }
}
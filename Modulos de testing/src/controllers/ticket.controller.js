import ticketModel from "../models/ticket.models.js"

export const postTicket = async (req, res) => {
    const { code } = req.body
    try {
        const product = await ticketModel.create( { code } )
        if (product) {
            return res.status(201).send({resultado: "OK", message: product})
        }
    } catch (error) {
        return res.status(500).send( { error: `Error en consultar producto ${error}` } )
    }
}

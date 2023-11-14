import userModel from "../models/users.models.js"

export const postUsers = async (req, res) => {
    try {
        console.log("usuario:",req.user);
        if (!req.user) {
            return res.status(400).send({ message: 'Usuario ya existente' })
        }
        return res.status(201).send({ message: `Usuario creado: ${req.user}` })
    } catch (error) {
        return res.status(500).send({ message: `Error al crear usuario ${error}` })
    }
}

export const getUserByEmail = async (req,res)=> {
    const { email } = req.params
    try {
        const user = await userModel.findOne({
            email: email
        })
        if (user) {
            return res.status(200).send({ response: 'OK', message: user})
        } else {
            return res.status(404).send({ error: 'Not Found' })
        }
    } catch (error) {
        res.status(500).send({ error: `Error al obtener usuario: ${error}` })
    }
}
import { generateToken } from "../utils/jwt.js";

export const postLocalLoginSession = async (req, res) => {
    try {
        console.log(req.user);
        if (!req.user) {
            return res.status(401).send({
                mensaje: "Invalidate user"
            })
        }
        //PARA EL USO DE SESSION
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            rol: req.user.rol
        }
        const token = generateToken(req.user) 
        res.cookie('jwtCookie', token, {      
            maxAge: 43200000
        })
        return res.status(200).send({resultado: 'OK', message: `Se logró logearse con el mail: ${req.user.email}`})
    } catch (error) {
        res.status(500).send({ error: `Error al obtener usuario: ${error}` })
    }
}
export const getLogoutSession = async (req, res) => {
    try {
        //PARA EL USO DE SESSIONS
        if (req.session) {
            console.log("Elimino el session");
            req.session.destroy()
        }
        res.clearCookie('jwtCookie') 
        return res.status(200).redirect("/static/userlog")
    } catch (error) {
        return res.status(500).send({ error: `Error al desloguearse: ${error}` })
    }
}
export const getGithubLoginSession = async (req,res) => {
    try{
        return res.status(200).send({ resultado: 'OK', message: 'Usuario creado o logueado' })
    } catch (error) {
        return res.status(500).send({ error: `Error al desloguearse: ${error}` })
    }
}
export const getCreateGithubSession = async (req,res) => {
    try{
        console.log(req.user);
        //PARA EL USO DE SESSIONS
        req.session.user = req.user
        const token = generateToken(req.user)
            res.cookie('jwtCookie', token, {
                maxAge: 43200000
            })
        return res.redirect('/static/realtimeproducts')
        //return res.status(200).send({ resultado: 'OK', message: 'Session creada' }) //Por ahora no devuelve status para que la pagina funcione, hasta que no sepa como solucionar el tema del cors cuando consumo esta api desde el front
    }catch {
        return res.status(500).send({ error: `Error al desloguearse: ${error}` })
    }
}
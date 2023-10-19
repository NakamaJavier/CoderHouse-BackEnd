import { Router } from "express";
import express from "express"
import path from "path"
import { __dirname } from "../path.js";
import { passportError, authorization } from "../utils/messageErrors.js"

const front = Router()

////PARA EL USO DE SESSIONS
// function auth(requiredRoleLvl) {
//     return function(req, res, next) {
//         let authLvl =2
//         if(req.session.user){
//             switch(req.session.user.rol){
//                 case 'admin':
//                     authLvl = 0
//                     break;
//                 case 'user':
//                     authLvl = 1
//                     break;
//                 default:
//                     authLvl = 2
//                     break;
//             }
//         }
//         if (authLvl <= requiredRoleLvl) {
//             return next();
//         }
//         return res.redirect('/static/userlog');
//     }
// }


front.use('/static', express.static(path.join(__dirname, '/public')))

//HandleBars

front.get('/static',
    //auth(1), //PARA EL USO DE SESSIONS
    passportError('jwt'), authorization('user'), //PARA EL USO DE JWT
    (req, res) => {
        res.render("home", {
            rutaCSS: "home",
            rutaJS: "home",
        })
})

front.get('/static/chat',
    //auth(1), //PARA EL USO DE SESSIONS
    passportError('jwt'), authorization('user'), //PARA EL USO DE JWT
    (req, res) => {
        res.render('chat', {
            rutaJS: "chat",
            rutaCSS: "chat"
        })
})

front.get('/static/userlog',
    //auth(2), //PARA EL USO DE SESSIONS
    (req, res) => {
        //if (!req.session.user) {
        if(!req.cookies.jwtCookie){
            res.render('userlog', {
                rutaJS: "userlog",
                rutaCSS: "userlog"
            })
        } else {
            res.redirect('/static/realtimeproducts')
        }
})

front.get('/static/profile', 
    //auth(1), //PARA EL USO DE SESSIONS
    passportError('jwt'), authorization('user'), //PARA EL USO DE JWT
    (req, res) => {
        res.render('profile', {
            rutaJS: "profile",
            rutaCSS: "profile",
            email: req.session.user.email
        })
})

front.get('/static/register', 
    //auth(2), //PARA EL USO DE SESSIONS
    (req, res) => {
        res.render('register', {
            rutaJS: "register",
            rutaCSS: "register"
        })
})

front.get('/static/admin', 
    //auth(0), //PARA EL USO DE SESSIONS
    passportError('jwt'), authorization('admin'), //PARA EL USO DE JWT
    (req, res) => {
        res.send("Sos admin")
})

front.get('/static/realtimeproducts',
    //auth(1), //PARA EL USO DE SESSIONS
    passportError('jwt'), authorization('user'), //PARA EL USO DE JWT
    async (req, res) => {
        res.render("realTimeProducts", {
            rutaCSS: "realtimeproducts",
            rutaJS: "realTimeProducts",
            email: req.session.user.email,
        })
})

export default front
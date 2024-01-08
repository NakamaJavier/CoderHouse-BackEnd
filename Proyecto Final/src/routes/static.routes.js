import { Router } from "express";
import express from "express"
import path from "path"
import { __dirname } from "../path.js";
import { passportError, authorization } from "../utils/messageErrors.js"
import { requestLogger } from "../utils/logger.js";

const front = Router()



front.use('/static', express.static(path.join(__dirname, '/public')))

//HandleBars

front.get('/static',
    passportError('jwt'), authorization('user'), //PARA EL USO DE JWT
    (req, res) => {
        let email = req.session.user ? req.session.user.email : null;
        res.render("home", {
            rutaCSS: "home",
            rutaJS: "home",
            email: email,
        })
})

front.get('/static/chat',
    passportError('jwt'), authorization('user'), //PARA EL USO DE JWT
    (req, res) => {
        let email = req.session.user ? req.session.user.email : null;
        res.render('chat', {
            rutaJS: "chat",
            rutaCSS: "chat",
            email: email,
        })
})

front.get('/static/userlog',
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
    passportError('jwt'), authorization('user'), //PARA EL USO DE JWT
    (req, res) => {
        let email = req.session.user ? req.session.user.email : null;
        res.render('profile', {
            rutaJS: "profile",
            rutaCSS: "profile",
            email: email,
        })
})

front.get('/static/register', 
    (req, res) => {
        res.render('register', {
            rutaJS: "register",
            rutaCSS: "register"
        })
})

front.get('/static/admin', 
    passportError('jwt'), authorization('admin'), //PARA EL USO DE JWT
    (req, res) => {
        res.send("Sos admin")
})

front.get('/static/realtimeproducts',

    passportError('jwt'), authorization('user'), //PARA EL USO DE JWT
    async (req, res) => {
        console.log(req.session.user);
        let email = req.session.user ? req.session.user.email : null;
        res.render("realTimeProducts", {
            rutaCSS: "realtimeproducts",
            rutaJS: "realTimeProducts",
            email: email,
        });
});
export default front
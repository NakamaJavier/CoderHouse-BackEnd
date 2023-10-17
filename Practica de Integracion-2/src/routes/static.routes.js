import { Router } from "express";
import express from "express"
import path from "path"
import { __dirname } from "../path.js";

const front = Router()

function auth(requiredRoleLvl) {
    return function(req, res, next) {
        let authLvl =2
        if(req.session.user){
            switch(req.session.user.rol){
                case 'admin':
                    authLvl = 0
                    break;
                case 'user':
                    authLvl = 1
                    break;
                default:
                    authLvl = 2
                    break;
            }
        }
        if (authLvl <= requiredRoleLvl) {
            return next();
        }
        return res.redirect('/static/userlog');
    }
}

front.use('/static', express.static(path.join(__dirname, '/public')))

//HandleBars

front.get('/static', auth(1), (req, res) => {
    res.render("home", {
        rutaCSS: "home",
        rutaJS: "home",
    })
})

front.get('/static/chat', auth(1), (req, res) => {

    res.render('chat', {
        rutaJS: "chat",
        rutaCSS: "chat"
    })
})

front.get('/static/userlog', auth(2), (req, res) => {
    if (!req.session.user) {
        res.render('userlog', {
            rutaJS: "userlog",
            rutaCSS: "userlog"
        })
    } else {
        res.redirect('/static/realtimeproducts')
    }
})

front.get('/static/profile', auth(1), (req, res) => {
    res.render('profile', {
        rutaJS: "profile",
        rutaCSS: "profile",
        email: req.session.user.email
    })
})

front.get('/static/register', auth(2), (req, res) => {
    res.render('register', {
        rutaJS: "register",
        rutaCSS: "register"
    })
})

front.get('/static/admin', auth(0), (req, res) => {
    res.send("Sos admin")
})
front.get('/static/realtimeproducts',auth(1), async (req, res) => {
    res.render("realTimeProducts", {
        rutaCSS: "realtimeproducts",
        rutaJS: "realTimeProducts",
        email: req.session.user.email,
    })

})

export default front
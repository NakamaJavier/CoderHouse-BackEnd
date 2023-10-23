import { Router } from "express"
import passport from "passport"
import { getUserByEmail, postUsers } from "../controllers/users.controller.js"

const userRouter = Router()

userRouter.post('/', passport.authenticate('register'), postUsers)
userRouter.get('/:email', getUserByEmail)

export default userRouter
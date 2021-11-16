const Router = require("express").Router()
const authRouter = require("./auth.routes")
const userRouter = require("./user.routes")


// /api/auth
Router.use("/auth", authRouter)
// /api/user
Router.use("/user", userRouter)

module.exports = Router
const apiRouter = require("./api.routes")

const route = (app)=>{

    // Các route api
    app.use("/api", apiRouter)

    // Các route không yêu cầu phiên đăng nhập của user
    app.get("/login", (req,res)=>{
        res.render("login")
    })

    

    // Các route yêu cầu phiên đăng nhập của user
    app.get("/", (req,res)=>{
        res.render("home")
    })


    // 404
    app.use((req,res)=> res.redirect("/404"))
}

module.exports = route
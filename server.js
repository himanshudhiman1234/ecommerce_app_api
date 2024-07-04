    const express = require("express")
    const app = express();
    require("dotenv").config()
    const connectDB = require("./config/db")
    const rateLimit = require("express-rate-limit")
    connectDB();
    app.use(express.json())
    const userRoutes = require("./routes/userRoutes")
    const categoryRoutes = require("./routes/categoryRoutes");
    const productRoutes = require("./routes/productRoutes");
    const cartRoutes = require("./routes/cartRoutes");
    const orderRoutes = require("./routes/orderRoutes")



    const loginLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // Limit each IP to 5 login requests per windowMs
        message: "Too many login attempts from this IP, please try again after 15 minutes"
    });

    // Apply rate limiter to login route
    app.use('/api/v1/auth/login', loginLimiter);




    app.use("/api/login",userRoutes)
    app.use("/api/admin",categoryRoutes)
    app.use("/api/admin",productRoutes)
    app.use("/api/cart",cartRoutes)
    app.use("/api/order",orderRoutes)


    app.listen(process.env.PORT,(req,res)=>{
    console.log("hello to this port")
    })
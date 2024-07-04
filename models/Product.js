const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    description:{
        type:String
    },
    price:{
        type:String
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    }
})

const Product =  mongoose.model("Product",productSchema)
module.exports = Product
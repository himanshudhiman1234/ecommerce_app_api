const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
    orderId:{type:String,required:true,unique:true},
    orderDate:{type:Date,default:Date.now},
    status:{type:String,enum:['pending','confirmed','shipped','delivered','cancel']},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},

    items:[{
        productId:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},
        productName:{type:String,required:true},
        quantity:{type:Number,required:true},
        price:{type:Number,required:true},
        total:{type:Number,required:true}
    }],
    paymentMethod:{type:String,required:true},
    paymentStatus:{type:String,enum:['pending',"completed"],default:"pending"},
    transactionId:{type:String},
    shippingAddress:{
        street:{type:String,required:true},
        city:{type:String,required:true},
        state:{type:String,required:true},
        zipCode:{type:String,required:true},
        country:{type:String,required:true}
    },
    shippingMethod:{type:String,required:true},
    shippingCost:{type:Number,required:true},
    trackingNumber:{type:Number,default:''},
    tax:{type:Number,required:true},
    total:{type:Number,required:true}
})


const Order = mongoose.model('Order',orderSchema);

module.exports = Order;
const express = require("express");

const {addToCart,getCart,updateCart,removeFromCart,deleteCart} = require("../controller/cartController");

const router= express.Router();


router.post("/cart",addToCart);
router.get("/getCart",getCart)
router.put("/update-cart/:userId",updateCart)
router.delete("/remove-cart/:userId",removeFromCart)
router.delete("/delete-cart",deleteCart )


module.exports = router
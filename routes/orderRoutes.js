const express = require("express");
const router = express.Router();

const {createOrder, getUserOrder, getOrderDetail, cancelOrder} = require("../controller/orderController")


router.post("/create-order",createOrder)
router.get("/get-order",getUserOrder)
router.get("/orders",getOrderDetail)
router.post("/orders/:id/cancel",cancelOrder)


module.exports = router
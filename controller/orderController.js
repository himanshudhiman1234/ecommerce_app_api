const express = require("express")
const mongoose = require("mongoose")

const Order = require("../models/Order")


const createOrder = async(req,res)=>{
    try{
        const {userId,items,paymentMethod ,shippingAddress ,name,email,phone,shippingMethod,shippingCost} =req.body;
        
        // Validate that items is defined and is an array
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: "Items must be a non-empty array" });
        }
       
        // Calculate total for each item
        items.forEach(item => {
            item.total = item.price * item.quantity;
        });

        const subTotal = items.reduce((sum, item) => sum + item.total, 0);
        const tax = subTotal * 0.1; // Assuming 10% tax rate
        const total = subTotal + tax + shippingCost;

        const order = new Order({
            orderId: new mongoose.Types.ObjectId().toString(),
            userId,
            name,
            email,
            phone,
            items,
            paymentMethod,
            shippingAddress,
            shippingMethod,
            shippingCost,
            subTotal,
            tax,
            total,
            trackingNumber: '', // Provide a default empty string for trackingNumber
            status: 'pending', // Set default status if not already set in schema
            paymentStatus: 'pending' // Set default payment status if not already set in schema
        });

        await order.save();

        res.status(201).json({
            message:"Order Created successfully",
            order
        })
    }catch(error){
        console.log("Error creating order",error)

        res.status(500).json({
            message:"Failed to create order",
            error:error.message
        })
    }
}

const getUserOrder = async(req,res)=>{
    try{
            const {userId} = req.query;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: "Invalid user ID" });
            }

            const orders = await Order.find({userId}).populate('items.productId','name price')
            if(!orders || orders.length ==0){
                return res.status(404).json({error:"No order found for this users"})
            }

            res.status(200).json({
                message:"Order retrived successfully",
                orders
            })
    }
    catch(error){
        console.error("Error retrieving user orders:", error);
        res.status(500).json({
            message: "Failed to retrieve user orders",
            error: error.message
        });
    }
}


const getOrderDetail = async(req,res)=>{
    const { orderId } = req.query;
    console.log("Received orderId:", orderId);

    // Validate orderId
    if (!orderId) {
        console.log("Invalid order ID");
        return res.status(400).json({ error: "Invalid order ID" });
    }

    try {
        // Find the order by orderId field
        const order = await Order.findOne({ orderId }).populate('items.productId', 'name price');
        console.log("Order found:", order);

        // If the order does not exist, return 404
        if (!order) {
            console.log("Order not found");
            return res.status(404).json({ error: "Order not found" });
        }

        // Return the order details
        res.json(order);
    } catch (err) {
        console.error("Error retrieving order:", err);
        res.status(500).json({ error: "Server error" });
    }
}

const cancelOrder = async(req,res)=>{
    const orderId = req.params.id;
    console.log("Received request to cancel order:", orderId);

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        console.log("Invalid Order ID");
        return res.status(400).json({ error: "Invalid Order ID" });
    }

    try {
        console.log("Finding order by orderId field:", orderId);
        const order = await Order.findOne({ orderId: orderId });
        console.log("Order found:", order);

        if (!order) {
            console.log("Order not found for orderId:", orderId);
            return res.status(404).json({ error: "Order not found" });
        }

        console.log("Updating order status to 'cancelled' for orderId:", orderId);
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            { status: "cancelled" },
            { new: true }
        );
        console.log("Updated order:", updatedOrder);

        if (!updatedOrder) {
            console.log("Order not found for orderId after update:", orderId);
            return res.status(404).json({ error: "Order not found" });
        }

        console.log("Order cancelled successfully:", updatedOrder);
        res.json(updatedOrder);
    } catch (err) {
        console.error("Error cancelling order:", err);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = {createOrder,getUserOrder,getOrderDetail,cancelOrder}
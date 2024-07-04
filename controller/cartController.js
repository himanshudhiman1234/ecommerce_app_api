const { default: mongoose } = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product")

const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "Quantity must be a positive integer" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        let cart = await Cart.findOne({ userId });
        if (cart) {
            if (!Array.isArray(cart.products)) {
                cart.products = [];
            }
            const productIndex = cart.product.findIndex(p => p.productId.toString() === productId);
            if (productIndex > -1) {
                cart.product[productIndex].quantity += quantity;
            } else {
                cart.product.push({ productId, quantity });
            }
        } else {
            cart = new Cart({
                userId,
                products: [{ productId, quantity }]
            });
        }

        await cart.save();
        res.status(201).json({
            message: "Product added to cart successfully",
            cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to add product to cart",
            error: error.message
        });
    }
};




const getCart = async (req, res) => {
    try {
        const { userId } = req.query;
        console.log(userId)
       
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log("Invalid user ID:", userId);
            return res.status(400).json({ error: "Invalid user ID" });
        }

        console.log("Querying cart for userId:", userId);

        const cart = await Cart.findOne({ userId }).populate('product.productId', 'name price');

        if (!cart) {
            console.log("Cart not found for userId:", userId);
            return res.status(404).json({ error: "Cart not found" });
        }

        console.log("Cart found:", cart);

        let totalPrice = 0;
        cart.product.forEach(item => {
            if (item.productId && item.productId.price) {
                totalPrice += item.productId.price * item.quantity;
            }
        });

        res.status(200).json({
            message: "Cart retrieved successfully",
            cart,
            totalPrice
        });
    } catch (error) {
        console.error("Error retrieving cart:", error);
        res.status(500).json({
            message: "Failed to retrieve cart",
            error: error.message
        });
    }
};
const updateCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, quantity } = req.body;

        console.log(`userId: ${userId}, productId: ${productId}, quantity: ${quantity}`);

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        // Validate quantity
        if (!Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({ error: "Quantity must be a non-negative integer" });
        }

        // Find the cart for the user
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        // Ensure product array is initialized
        if (!Array.isArray(cart.product)) {
            cart.product = [];
        }

        // Find the index of the product in the cart
        const productIndex = cart.product.findIndex(p => p.productId.toString() === productId);

        console.log(`productIndex: ${productIndex}`);

        if (productIndex === -1) {
            if (quantity > 0) {
                console.log("Adding new product to cart");
                cart.product.push({ productId, quantity });
            } else {
                return res.status(404).json({ error: "Product not found in cart" });
            }
        } else {
            if (quantity > 0) {
                console.log("Updating product quantity in cart");
                cart.product[productIndex].quantity = quantity;
            } else {
                console.log("Removing product from cart");
                cart.product.splice(productIndex, 1);
            }
        }

        await cart.save();

        res.status(200).json({
            message: "Cart updated successfully",
            cart
        });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({
            message: "Failed to update cart",
            error: error.message
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId } = req.body;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        // Find the cart for the user
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        // Ensure product array is initialized
        if (!Array.isArray(cart.product)) {
            cart.product = [];
        }

        // Find the index of the product in the cart
        const productIndex = cart.product.findIndex(p => p.productId.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ error: "Product not found in cart" });
        } else {
            // Remove the product from the cart
            cart.product.splice(productIndex, 1);
        }

        await cart.save();

        res.status(200).json({
            message: "Product removed from cart successfully",
            cart
        });
    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({
            message: "Failed to remove product from cart",
            error: error.message
        });
    }
};


const deleteCart = async(req,res) =>{
    try{
        const {userId} = req.query;
          // Validate userId
          console.log(userId)
          if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const cart = await Cart.findOneAndDelete(userId)
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        res.status(200).json({
            message: "Cart deleted successfully"
        });
    }catch(error){
        console.error("Error deleting cart:", error);
        res.status(500).json({
            message: "Failed to delete cart",
            error: error.message
        });
    }
}

module.exports = {addToCart,getCart,updateCart,removeFromCart,deleteCart}
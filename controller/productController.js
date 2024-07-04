const Product = require("../models/Product");
const Category = require("../models/category");
const mongoose = require("mongoose");

const createProduct = async (req, res) => {
    try {
        const { title, image, description, price, categoryId } = req.body;
        
        // Validate the category ID 
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                error: "Invalid category ID"
            });
        }

        // Check if the category exists
        const category = await Category.findById(categoryId);
        console.log(category)
        if (!category) {
            return res.status(404).send({ error: "Category not found" });
        }

        // Create a new product
        const product = new Product({
            title,
            image,
            description,
            price,
            categoryId
        });

        // Save the product
        await product.save();

        res.status(201).json({
            message: "Product saved successfully",
            product: product
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed uploading product",
            error: error.message
        });
    }
};

const getAllproduct = async(req,res) =>{
    try{
        const getAllproduct = await Product.find({});

        res.status(201).json({
            message: "Get all Product",
            product: getAllproduct
        });
    }catch(error){
        res.status(400).json({
            message: "Failed uploading product",
            error: error.message
        });
    }
}
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, image, description, price, categoryId } = req.body;

        // Validate the category ID if it's provided
        if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                error: "Invalid category ID"
            });
        }

        // Validate the product ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "Invalid product ID"
            });
        }

        // Check if the category exists if categoryId is provided
        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({ error: "Category not found" });
            }
        }

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { title, image, description, price, categoryId },
            { new: true }
        );

        console.log(updatedProduct);

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        console.error('Failed to update product:', error.message);
        res.status(400).json({
            message: "Failed updating product",
            error: error.message
        });
    }
};


const deleteProduct = async(req,res)=>{
    try{

        const {id} = req.params;
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.status(201).json({
            message: "Get all Product",
            product: deleteProduct
        });
    }catch(error){
        res.status(400).json({
            message: "Failed uploading product",
            error: error.message
        });
    }
}

//Get property with categories

const productWithCategories = async(req,res) =>{
   try{
       const product = await Product.find().populate('categoryId','name description');
     

       res.status(200).json({
        product:"Product fetched Successfully",
        products:product
       })

   }catch(error){
    res.status(400).json({
        message:"Failed to fetch products",
        error:err.message
    })
   } 
    
}
module.exports = { createProduct ,updateProduct , getAllproduct,deleteProduct,productWithCategories};

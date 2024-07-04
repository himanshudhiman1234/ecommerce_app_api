const express  = require("express");
const {createProduct, updateProduct, getAllproduct, deleteProduct, productWithCategories} = require("../controller/productController")  ;
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")

router.post("/product",authMiddleware,createProduct)
router.get('/all-products',authMiddleware,getAllproduct)
router.put("/update-product/:id",authMiddleware,updateProduct)
router.delete('/delete-product/:id',authMiddleware,deleteProduct)
router.get('/product-categories',productWithCategories)
module.exports = router
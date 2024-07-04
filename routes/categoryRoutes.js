const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")

const {createCategory,allCategory, updateCategory,deleteCategory} = require("../controller/categoryController")


router.post("/add-category",authMiddleware,createCategory)
router.get("/category",authMiddleware,allCategory)
router.put("/update-category/:id",authMiddleware,updateCategory)
router.delete("/delete-category/:id",authMiddleware,deleteCategory)

module.exports =router
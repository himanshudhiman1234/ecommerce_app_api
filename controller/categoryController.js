const Category = require("../models/category")



const createCategory = async(req,res) =>{
    try{
            const {name,description} = req.body
            if(!name || !description){
                return res.status(400).json({
                    message:"All field are required"
                })
            }

            const category =  new Category({
                name,
                description
            })

          const categories = await category.save();
          
            res.status(201).json({
                message:"Category saved Successfully",
                category: categories   
            })
    }catch(error){
    
        res.status(500).json({
            message:"Failed to save Category",
            error:error.message
           })
    }
}

const allCategory =async(req,res) =>{
    try{
        const getCategory = await Category.find({});
        res.status(201).json({
            category :getCategory
        })
    }catch(err){
        res.status(500).json({
            message:"Failed to save Category",
            error:error.message
           })
    }
}


const updateCategory = async(req,res)=>{
    try{
        const {id} = req.params;
        const {name,description} = req.body;

        // if(!name || !description){
        //     return res.status(400).json({
        //         message:"All fields are required"
        //     })
        // }

        const updateCategory = await Category.findByIdAndUpdate(
            id,
            {name,description},
            {new:true,runValidators:true}
        )

        if(!updateCategory){
            return res.status(404).json({
                message:"category not found"
            })
        }

        res.status(200).json({
            message:"Category updated successfully",
            category:updateCategory
        })
    }catch(err){
        res.status(500).json({
            message:"Failed to save Category",
            error:error.message
           })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category deleted successfully",
            category: deletedCategory
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete category",
            error: err.message
        });
    }
};

module.exports = {createCategory,allCategory,updateCategory,deleteCategory}
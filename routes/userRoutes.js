const express = require("express")
const router =express.Router();
const User = require("../models/user")
const {loginUser,loged, loggedinuser, getAllUser, UpdateUser, deleteUser ,refreshUserToken, logoutUser} = require("../controller/userController")
const authMiddleware = require("../middleware/authMiddleware")


router.post("/user",loginUser)
router.post("/logedinuser",loggedinuser)
router.get("/get-user",authMiddleware,getAllUser)
router.put("/update-user/:id",authMiddleware,UpdateUser)
router.delete("/delete-user/:id",authMiddleware,deleteUser)
router.post("/refresh-token", authMiddleware,refreshUserToken);

router.post("/logout", logoutUser);


module.exports = router
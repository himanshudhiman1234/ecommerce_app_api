const User = require("../models/user")
const bcrypt = require("bcryptjs")


const loginUser = async(req,res) =>{
    try{

        const {username,email,phoneno,password} = req.body;

       
        
        const missingFields = [] ;
        if(!username){
            missingFields.push("username")
        }
        if(!email){
            missingFields.push("email")
        }
        if(!phoneno){
            missingFields.push("phoneno")
        }
        if(!password){
            missingFields.push("password")
        }

                if(missingFields.length > 0){
                    return res.status(400).json({
                        message:`Missing fields ${missingFields.join(",")}`
                    })
                }


                const hashedPasswords = await bcrypt.hash(password,10)

        const loginUser = new User({
            username,
            email,
            password:hashedPasswords,
            phoneno
        })

        const token = loginUser.createJWT();
        const refreshToken = loginUser.createRefreshToken();

        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite : 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })


        if(!username || !email || !password || !phoneno){
        return res.status(400).json({
            message:"All field are required"
        })
        }   

        await loginUser.save();
        res.status(201).json({
            message:"User saved Successfully",
            loginUser: loginUser,
            token,
            refreshToken 
        })
    }catch(error){
       res.status(500).json({
        message:"Failed to save user",
        error:error.message
       })
    }
}
const loggedinuser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const missingFields = [];

        // Check for missing fields
        if (!email) {
            missingFields.push("email");
        }
        if (!password) {
            missingFields.push("password");
        }

        // If any fields are missing, return a 400 Bad Request response
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing fields: ${missingFields.join(", ")}`
            });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        // If the user does not exist, return a 401 Unauthorized response
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Check if the provided password matches the stored password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        // If the password is incorrect, return a 401 Unauthorized response
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const token = user.createJWT();
        const refreshToken = user.createRefreshToken();

        if(user.role == "admin"){
            res.status(200).json({
                message: "Login successful",
                redirectTo:"/admin-dashboard",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    phoneno: user.phoneno
                },
                token,
                refreshToken
            });
        }else{
            res.status(200).json({
                message: "Login successful",
                redirectTo:"/user-dashboard",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    phoneno: user.phoneno
                },
                token,
                refreshToken
            });
        }
        // If the email and password are correct, return a 200 OK response with user details
       
    } catch (error) {
        res.status(500).json({
            message: "Failed to login user",
            error: error.message
        });
    }
};


const getAllUser =  async(req,res)=>{
    try{

        const allUser = await User.find({});
        res.status(200).json({
            
            users:allUser
    })
    }catch(error){
        res.status(500).json({
            message:"Failed to fetch errors",
            error:error.message
        })
    }
}


const UpdateUser =  async(req,res)=>{
    try{

        const {id} = req.params;

        const {username,email,phoneno,password} = req.body;

        const updateUser = await User.findByIdAndUpdate(
            id,
            {username,email,password,phoneno},
            {new:true}
        )

        if(!updateUser){
            return res.status(404).json({
                message:"User not found"
            })
        }
    
        res.status(200).json({
            message:"User updated successfully",
            user:updateUser
        })
    }catch(error){
        res.status(500).json({
            message:"Failed to fetch errors",
            error:error.message
        })
    }
}

const deleteUser = async(req,res) => {
    try{

        const {id} = req.params;
        const deletedUser = await User.findByIdAndDelete(id)
        
        if (!deletedUser) {
            return res.status(404).json({
                message: "user not found"
            });
        }
        
        res.status(200).json({
            message: "User deleted successfully",
            User: deletedUser
        });
    }catch(error){
        res.status(500).json({
            message: "Failed to delete category",
            error: error.message
        });
    }
}



const refreshUserToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(403).json({ message: "Refresh token not found" });
        }

        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(payload.id);

        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = user.createJWT();
        const newRefreshToken = user.createRefreshToken();

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({ token: newAccessToken });
    } catch (error) {
        res.status(500).json({ message: "Failed to refresh token", error: error.message });
    }
};

const logoutUser = (req, res) => {
    try {
        res.cookie('refreshToken', '', { maxAge: 0 });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Failed to logout user", error: error.message });
    }
};


module.exports = {loginUser,loggedinuser,getAllUser,UpdateUser,deleteUser,refreshUserToken,logoutUser}
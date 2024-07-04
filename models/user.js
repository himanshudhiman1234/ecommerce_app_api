const mongoose = require("mongoose")
const JWT = require("jsonwebtoken")
const UserSchema =  new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please enter username"],
        unique:true

    },email:{
        type:String,
        required:[true,"Please enter email"],
        unique:true
    },
    phoneno:{
        type:String,
        required:[true,"Please enter phoneno"]
    },password:{
        type:String,
        required:[true,"Please enter password"]
    },role:{
        type:String,
        default:"user"
    }
},{
    timestamps: true
})



UserSchema.methods.createJWT = function () {
    return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.createRefreshToken = function () {
    return JWT.sign({ userId: this._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    });
};

const User = mongoose.model("User",UserSchema);

module.exports = User;
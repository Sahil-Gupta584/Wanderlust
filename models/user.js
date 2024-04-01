const mongoose = require("mongoose")
const passposrtLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true
    }
});

userSchema.plugin(passposrtLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
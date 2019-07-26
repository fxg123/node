var  mongoose = require('./connection');

var userSchema = new mongoose.Schema({
    chatheads:String,
    username:String,
    password:String,
    repassword:String,
    birthday:Date,
    gender:String,
    email:String,
    individual:String
});

var User = mongoose.model('user',userSchema);
module.exports = User;
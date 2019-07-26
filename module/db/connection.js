var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/blog',{useNewUrlParser:true},(err)=>{
    if(err){
        console.log('mongodb error');
    }
    else{
        console.log('mongodb success');
    }
});

module.exports = mongoose;
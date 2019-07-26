var mongoose  =require ('./connection');

var msgSchema = new mongoose.Schema({
    title:String,
    labels:Array,
    content:String,
    count:Number,
    time:Object,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    reples:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'reply'
    }]
})

var Message = mongoose.model('message',msgSchema);
module.exports = Message;
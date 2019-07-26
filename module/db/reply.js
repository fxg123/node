var mongoose =require('./connection');

var replySchema = new mongoose.Schema({
    content:String,
    time:Object,
    username:String
});

var Reply = mongoose.model('reply',replySchema);
module.exports = Reply;
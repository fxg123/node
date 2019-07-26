var express = require('express');
var fs = require('fs');
var route = express.Router();
var multer = require('multer');

var User = require('../module/db/user');

var uploadpath = './public/img/';
var headername;

var stroage = multer.diskStorage({


    destination:function(req,file,cb){
        cb(null, uploadpath);
    },
   
    filename:function(req,file,cb){

        console.log(file);
       
        var arr = file.originalname.split('.')
        var ext = arr[arr.length-1];
     
        headername = req.session.user.username+'-'+Date.now()+'.'+ext;
        console.log(headername);
        cb(null, headername);
    }
});

var upload = multer({
    storage:stroage,
    limits:{
        fileSize:1024*1024*10
    },
    fileFilter:function(req,file,cb){
        if (file.mimetype.startsWith('image')) {
            cb(null, true);//是图片接收
        } else {
            // cb(null, false);
            cb('只能上传图片', false);//拒绝这个文件
        }
    }
});



route.post('/upload/header',upload.single('chatheads'),(req,res)=>{
    // console.log(req.file);
    console.log('旧头像：'+req.session.user.chatheads);

    var headerurl = '/img/'+headername;
    console.log('新头像：'+headerurl);
    if (fs.existsSync(uploadpath+headername)) {
        User.findOne({_id:req.session.user._id},(err,user)=>{
        console.log(user);
            if (user.chatheads != '/img/02.jpeg') {
                fs.unlinkSync('./public'+user.chatheads);
                console.log(user.chatheads+'123345');
                
            } 
            user.chatheads = headerurl;
            user.save(()=>{
                req.session.user.chatheads = headerurl;
                res.redirect('/')
            });
        });
    } else {
        res.send('上传失败');
    }
    
});

module.exports = route;
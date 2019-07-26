var express = require('express');
var User = require('../module/db/user');
var router = express.Router();
var md5 = require('md5');

// 注册
router.get('/regist',(req,res)=>{
    res.render('regist');
});
router.post('/regist',(req,res)=>{
    User.findOne({username:req.body.username},(err,data)=>{
        if (data) {
            // 在flash暂存器中添加一个 error 信息
            req.flash('error','用户名已被抢注');
            res.redirect('/regist')
        } else {
            if(req.body.password!=req.body.repassword){
                req.flash('error','两次密码不一致');
                res.redirect('/regist');
            }else{
                // 对密码进行MD5加密
                req.body.password = md5(req.body.password);
                req.body.repassword = md5(req.body.repassword);

                var userUrl = Object.assign(req.body,{
                    // 默认的头像url路径
                    chatheads:'/img/02.jpeg'
                });

                var user = new User(req.body);
                // console.log(user);
                user.save(err=>{
                    res.redirect('/login');
                });
            }
        }
    });
});

module.exports= router;
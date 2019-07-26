
var express = require('express');
var User = require('../module/db/user');
var router = express.Router();
var md5 = require('md5');

router.get('/login',(req,res)=>{
    res.render('login');
});
router.post('/login',(req,res)=>{
    User.findOne({username:req.body.username},(err,user)=>{
        if (!user) {
            req.flash('error','用户名不存在');
            res.redirect('/login');
        } else {
            if (md5(req.body.password) == user.password) {
                // 每次登录时，在session对象中添加user，user会被自动的保存或者更新到session中
                req.session.user = user;
                res.redirect('/');
            } else {
                req.flash('error','密码错误');
                res.redirect('/login');
            }
        }
    });
});

module.exports = router;
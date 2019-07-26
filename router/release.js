
var express = require('express');
var Message = require('../module/db/message');
var Reply = require('../module/db/reply');
var router = express.Router();
var tools = require('../module/tools');

//发布
router.get('/release',(req,res)=>{
    res.render('release');
});
router.post('/release',(req,res)=>{
    // console.log(req.session);
    if (!req.session.user) {
        req.flash('error','请登录');
        res.redirect('/login');
        return;
    }
    var msg = new Message({
        title:req.body.title,
        labels:req.body.labels,
        content:req.body.content,
        count:0,
        author:req.session.user._id,
        time: tools.times(),
        reples:[]
    });
    msg.save(err=>{
        res.redirect('/');
    });
});

//回复
router.post('/reply/:id',(req,res)=>{
    var reply = new Reply({
        content:req.body.content,
        username:req.session.user.username,
        time:tools.dateFormat(new Date())
    });
    var page = (req.query.page || 1)*1;
    //每页显示的信息条数
    var show_count = 4;
    reply.save(()=>{
        Message.findOne({_id:req.params.id})
        .limit(show_count)
        .exec((err,msgs)=>{
            console.log(msgs);
            msgs.reples.push(reply._id);
            // console.log(reply.id);
            
            console.log(show_count);
            
            msgs.save(()=>{
                // damsgsta.countDocuments((count)=>{
                //     res.render('/detail/'+req.params.id,{
                //         msgs,
                //         page,
                //         allPages,
                //         show_count
                //     })
                // });
                res.redirect('/detail/'+req.params.id);

            });
        });
    });
});

module.exports = router;



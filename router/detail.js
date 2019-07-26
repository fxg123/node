// 详情页面
var express = require('express');
var Message = require('../module/db/message');
var router = express.Router();

router.get('/detail/:id',(req,res)=>{
     // 当天的页码
     var page = (req.query.page || 1)*1;
     //每页显示的信息条数
     var show_count = 4;
     Message.findOne({_id:req.params.id})
    .skip((page-1)*show_count)
    .limit(show_count)
    .populate('author')
    .populate('reples').exec((err,data)=>{
        var msgs = JSON.parse(JSON.stringify(data));
        // console.log(msgs)
        // msgs.count ++;
        Message.countDocuments((count)=>{
            var allPages = Math.ceil(count/show_count);
            res.render('detail',{
                msgs,
                page,
                allPages,
                show_count
            });

        });
    });
});

module.exports = router;

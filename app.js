var express =require('express');
var app = express();
var fs = require('fs');

app.use(express.static('public'));

app.use(express.urlencoded({extended:false}));

var artTmpEngine = require('./module/art-tem-config');
artTmpEngine(app);
//引入表
var Message = require('./module/db/message');
var User = require('./module/db/user');
var Reply = require('./module/db/reply');

var tools  = require('./module/tools');

//提示消息
var flash = require('connect-flash');
app.use(flash());

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


var favicon = require('serve-favicon');
var logger = require('morgan');
var path = require('path');
// 设置站点小图标
app.use(favicon(path.join(__dirname,'public/img/favicon.ico')));

// 设置日志打印
// app.use(logger('dev')); //打印日志到控制台 short dev common
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logger.log'), {flags: 'a'});
app.use(logger('short',{stream: accessLogStream})); //打印日志到access.log 文件

app.use(session({
    //添加session的配置信息
    secret:'mylogin',
    resave:true,
    saveUninitialized:true,
    rolling:true,
    cookie:{
        maxAge:1000*60*60
    },
    store: new MongoStore({
        // 连接数据库
        url:'mongodb://127.0.0.1/blog'
    })
}));

//模板渲染的变量
app.use((req,res,next)=>{
    //在session 加载后才能调用 
    res.locals.user = req.session.user;
    // console.log(res.locals.user);
    res.locals.error = req.flash('error').toString();
    next();
});


// 首页
app.get('/',(req,res)=>{

    // 当天的页码
    var page = (req.query.page || 1)*1;
    //每页显示的信息条数
    var show_count = 5;
    Message
    .find()
    .skip((page-1)*show_count)
    .limit(show_count).sort({'times.minute':-1})
    .populate('author')
    .populate('reples')
    .exec((err,data)=>{
        var msgs = JSON.parse(JSON.stringify(data));
        // console.log(msgs);
        // console.log(msgs[0].reples);
        Message.countDocuments((err,count)=>{
            var  allPages = Math.ceil(count/show_count);
            res.render('index',{
                msgs,
                page,
                allPages,
                show_count
            });
        });
    });
    
});

//存档
 app.get('/archive',(req,res)=>{
     // 当天的页码
    var page = (req.query.page || 1)*1;
    //每页显示的信息条数
    var show_count = 5;
     Message
     .find()
     .sort({'time.minute':-1})
     .populate('author')
     .skip((page-1)*show_count)
     .limit(show_count).exec((err,data)=>{
        var msg = JSON.parse(JSON.stringify(data));
         Message.countDocuments((err,count)=>{
             var allPages = Math.ceil(count/show_count);
             res.render('archive',{
                 msg,
                lastYear:-1,
                 page,
                 allPages,
                 show_count
        });
    });

        //  res.render('archive',{msg});
     });
});
// //标签
 app.get('/tally',(req,res,next)=>{
     Message.find().exec((err,blogs)=>{
        var blog = JSON.parse(JSON.stringify(blogs));
        blog.forEach(element => {
            res.render('tally',{blog});
        });
        // var labels= []
        // blog.forEach(lab=>{
        //     //数据去重
        //     lab.labels.forEach(l =>{
        //         if(l != ''){
        //             lab.includes(l) ? lab.push() : lab.push(l);
        //         }
        //     });
        // })
     });
});

//个人信息
app.get('/personalInfo',(req,res)=>{
    user=req.session.user;
    res.render('personalInfo',{user,tools});
});
app.post('/personalInfo',(req,res)=>{
    user=req.session.user;
    res.render('personalInfo',{user,tools});
   console.log(user);
})

// 注册
app.use(require('./router/regist'));
// 登录
app.use(require('./router/login'));
//发布和回复
app.use(require('./router/release'));
// 详情页面
app.use(require('./router/detail'));
//上传头像
app.use(require('./router/uploads'));

// 编辑用户信息
app.get('/editpersonalInfo',(req,res)=>{
    res.render('userinfo');
    console.log('编辑489465/78946523')
});
// app.post('/editpersonalInfo',(req,res)=>{
//     // res.send('xxx');
//     console.log('编辑4894655123')
// });
// 编辑用户头像
app.get('/editpersonalInfo/:id',(req,res)=>{
    res.render('editpersonalInfo');
    console.log('编辑48946515')
});

//修改
app.get('/edit/:id',(req,res)=>{
    Message
    .findOne({_id:req.params.id})
    .exec((err,data)=>{
    var msgs = JSON.parse(JSON.stringify(data));
        res.render('edit',{msgs});
    // console.log(data+'编辑');
    });
});
app.post('/edit/:id',(req,res)=>{
    Message.findOneAndUpdate({
        // 查找条件
        _id:req.params.id
    },{
            title:req.body.title,
            labels:req.body.labels,
            content:req.body.content,
            time: tools.dateFormat(new Date()),
    },err=>{
        res.redirect('/detail/'+req.params.id);
    });
});


//删除
app.get('/delete/:id',(req,res)=>{
    Message
    .findOneAndDelete({_id:req.params.id})
    .exec((err,data)=>{
        if(err){
            res.send('删除失败');
        }
        else{
            res.redirect('/');
        }
    });
});


//搜索
app.get('/search',(req,res,next)=>{
    var keyword = req.query.keyword
    Message.find({
        // 多条件模糊查询
            $or:[  
                {title:{$regex:keyword,$options:'$i'}}, 
                {content:{$regex:keyword,$options:'$i'}},
            ]
    }).exec((err,data)=>{
        console.log(data);
        var mags = JSON.parse(JSON.stringify(data));
        // console.log(mags);
            res.render('search',{
                mags,
                keyword
            });
    });
});

// 退出登录
app.get('/logout',(req,res)=>{
    req.session.user = null;
    res.redirect('/');
});
//启动服务
app.listen(3000,()=>{
    console.log('node runing');
});
//package.json은 외장모듈 관리를 위해 사용(npm init)
var http = require('http')
var express = require('express')
var static = require('serve-static')
var path = require('path')
var bodyParser = require('body-parser')
var multer = require('multer')
var fs = require('fs')
var cors = require('cors') // 다른 서버로 접근하기위해서 사용
var mysql = require('mysql');
var crypto = require('crypto'); //비밀번호 암호화
var mysqlDB = require('./mysql-db');
var hostname = '0.0.0.0';
let {PythonShell} = require('python-shell')
//var PythonShell = require('python-shell'); 
var session = require('express-session');
var query;


mysqlDB.connect();

var app = express();
app.set('port', process.env.PORT || 3000); //포트 지정
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //post방식으로 데이터 받기위해 2줄 적어야한다
app.use(cors());
app.use(session({
    secret: '@#@$MYSIGN#@$#$',//임시 세션키값
    resave: false,//세션 상시 저장할지 정하는 flag
    saveUninitialized: true
}));
app.use('node_modules',express.static(path.join(__dirname,'/node_modules')))
app.set('views',__dirname + '/views');
app.set('views engin','ejs');
app.engine('html',require('ejs').renderFile);

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = './public'
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
})
var upload = multer({
    storage: storage,
    limit: {
        files: 12,
        filesize: 1024 * 1024 * 50
    }
});




var router = express.Router();
app.use('/', router);

app.use(function (req, res, next) {
   //res.writeHead(200, { 'Content-Type': 'text/html;charset=utf8' })
   //res.write(`<h3>해당하는 내용이 없습니다</h3>`)
   //res.end();
    sess = req.session;
	res.render('index.html');
})

http.createServer(app).listen(app.get('port'),  function () {
    console.log("익스프레스로 웹 서버를 실행함 : " + app.get('port'));
}) //express를 이용해 웹서버 만든다

router.route("/login").get(function (req, res){
	res.render("login.html");
})

router.route("/projPage").get(function (req, res){
	res.render("projPage.html");
})

router.route("/signup").get(function (req, res){
	res.render("signup.html");
})
///
//router.route("/main").get(function (req, res){
//	res.render("main.html");
//})
///
router.route("/create").get(function(req,res){
    sess=req.session;
    res.render("create.html",{username:sess.name,useremail:sess.email,admit:" "});
})

router.route("/search").get(function(req,res){
    sess=req.session;
    res.render("search.html",{username:sess.name});
})

router.route("/table").get(function(req,res){
    sess = req.session; 
    mysqlDB.query('SELECT PROJ_NAME, PROJECT.PROJ_MGR_UID, PROJECT.PROJ_NAME, PROJECT.PROJ_PROGRESS, PROJECT.PROJ_START, PROJECT.PROJ_END, PROJECT.PROJ_DESC FROM ATTENDENCE, USER, PROJECT WHERE USER.NAME= ? AND USER.USER_ID=ATTENDENCE.USER_ID AND ATTENDENCE.PROJ_ID = PROJECT.PROJ_ID', [sess.name], function (err,rows, fields) {
        if (err) {
            console.log(err);
            res.end();
        }
        else {
       
            console.log(rows);
            console.log(rows.length);
           // console.log(rows[0]);
          //  console.log(JSON.stringify(rows[0]));
            var project = JSON.stringify(rows);   
            var size = rows.length;        
            project = project.replace(/\\r/gi, '').replace(/\\n/gi, ' ').replace(/\\t/gi, ' ').replace(/\\f/gi, ' ');    
            console.log(project);         
            res.render("table.html",{pro:project,len:size});
        }        
    }); 
  
    
})
//search_project
router.route("/search/project").post(function(req,res){
    var pid = req.body.p_name;
    var mname = req.body.m_name;
    var sdate = req.body.s_date;
    var edate = req.body.e_date;
    var inputIsNothing =1;   // 검색조건이 하나도 안 들어왔음을 체크하는 변수,   1이면 empty, 0이면 입력 있음
    console.log(pid+""+mname+""+sdate+""+edate);
 
     var sql="SELECT PROJECT.PROJ_NAME, PROJECT.PROJ_PROGRESS, PROJECT.PROJ_START, PROJECT.PROJ_END, PROJ_DESC FROM PROJECT WHERE 1=1 ";
     if (pid !== '') {sql = sql.concat("AND PROJ_NAME = '" + pid + "' "); inputIsNothing=0;}
     if (mname !== '') {sql = sql.concat("AND PROJ_MGR_UID = '" + mname + "' "); inputIsNothing=0;}
     if (sdate !== '') {sql = sql.concat("AND DATE_FORMAT(PROJ_START, '%Y-%m-%d') >= '" + sdate + "' "); inputIsNothing=0;}
     if (edate !== '') {sql = sql.concat("AND DATE_FORMAT(PROJ_END, '%Y-%m-%d') <= '" + edate + "'"); inputIsNothing=0;}
 
     if ( (inputIsNothing) ) {   // 검색조건을 하나도 입력 안한경우 경고창만 띄우고 밑의 query는 실행하지 않는다.
         // alert:true -> searchtbl.html 에서 alert를 띄운다.
         res.render("searchtbl.html",{pro:"", len:0,name:sess.name, alert:true});
         return 0;
     }
     
     console.log("pid : " + pid);
     console.log("mname : " + mname);
     console.log("sdate : " + sdate);
     console.log("edate : " + edate);
     console.log("pid !== '' : " +(pid !== ''));
     console.log("mname !== '' : " +(mname !== ''));
     console.log("sdate !== '' : " +(sdate !== ''));
     console.log("edate !== '' : " +(edate !== ''));
 
     console.log(sql);
     //mysqlDB.query("SELECT PROJECT.PROJ_NAME, PROJECT.PROJ_PROGRESS, PROJECT.PROJ_START, PROJECT.PROJ_END, PROJ_DESC FROM PROJECT WHERE PROJ_NAME = ? AND PROJ_MGR_UID = ? AND DATE_FORMAT(PROJ_START, '%Y-%m-%d') >= ? AND DATE_FORMAT(PROJ_END, '%Y-%m-%d') <= ?", [pid,mname,sdate,edate], function (err,rows, fields) {
     mysqlDB.query(sql, function(err, rows) {
     if (err) {
         console.log(err);
         res.end();
     }
     else {
         console.log(rows);
         console.log("row length : " + rows.length);
        // console.log(rows[0]);
       //  console.log(JSON.stringify(rows[0]));
         var project = JSON.stringify(rows);
        
         var size = rows.length;
        // console.log(project);
         res.render("searchtbl.html",{pro:project,len:size, alert:false});
     }        
 }); 
 })

//search_table
router.route("/search/table").get(function(req,res){
    sess=req.session;
    res.render("searchtbl.html",{pro:"",len:0,name:sess.name, alert:false});    
})

// SIGNUP
router.route("/user/register").post(function (req, res) {
    var email = req.body.email;
    var inputPassword = req.body.password;
    var u_name = req.body.name;
    var department = req.body.department;
    var u_salt = Math.round((new Date().valueOf() * Math.random())) + "";
    var hashPassword = crypto.createHash("sha512").update(inputPassword + u_salt).digest("hex");
    console.log(`email : ${email} , password : ${inputPassword}, hashPassword : ${hashPassword}, name : ${u_name} , department : ${department}, salt : ${u_salt}`);

    var data = { USER_ID: email, USER_PW: hashPassword, NAME: u_name, DEPT: department, TOKEN: "t", SALT: u_salt };
    mysqlDB.query('INSERT INTO USER set ?', data, function (err, results) {
        var admit;
        if (!err) {
            admit = { "register": "success" };
            console.log("Create user success");
            res.write(JSON.stringify(admit));
            res.end();
            console.log(results);
            
        } else {
            console.log("USER INSERT ERROR");
            admit = { "register": "deny" };
            res.write(JSON.stringify(admit));
            res.end();
        }
    })
})

// SIGNUP_pc
router.route("/user_pc/register").post(function (req, res) {
    var email = req.body.email;
    var inputPassword = req.body.password;
    var u_name = req.body.name;
    var department = req.body.department;
    var u_salt = Math.round((new Date().valueOf() * Math.random())) + "";
    var hashPassword = crypto.createHash("sha512").update(inputPassword + u_salt).digest("hex");
    console.log(`email : ${email} , password : ${inputPassword}, hashPassword : ${hashPassword}, name : ${u_name} , department : ${department}, salt : ${u_salt}`);

    var data = { USER_ID: email, USER_PW: hashPassword, NAME: u_name, DEPT: department, TOKEN: "t", SALT: u_salt };
    mysqlDB.query('INSERT INTO USER set ?', data, function (err, results) {
        var admit;
        if (!err) {
            admit = { "register": "success" };
            console.log("Create user success");
            console.log(results);
            res.redirect('/login');
            
        } else {
            console.log("USER INSERT ERROR");
            admit = { "register": "deny" };
            res.redirect('/signup');            
        }
    })
})

// LOGIN
router.route("/user/login").post(function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log("email : " + email);
    console.log("password : " + password);

    mysqlDB.query('select * from USER where USER_ID=?', [email], function (err, results) {
        var login;
        var login_data;
        
        if (err) {
            login = { "login": "error" };
            console.log("LOGIN ERROR");
            console.log(err);
            console.log(JSON.stringify(login));
            res.write(JSON.stringify(login));
            res.end();
            return;
        }

        if (results.length > 0) {
            console.log(results);            
            var user = results[0];
            
            var hashPassword = crypto.createHash("sha512").update(password + user.SALT).digest("hex");            

            if (hashPassword === user.USER_PW) {
                console.log("login success");
                login = { "login": "success" };  
                console.log("name = "+user.NAME);  
                 //세션 처리 해야한다// 
                sess = req.session;
                sess.email = email;
                sess.state = 't';  
                sess.name = user.NAME;  
                console.log(sess.email + sess.name);
                //권한 세션 입력해야한다.-> 디비처리//      
            } else {
                console.log("WRONG ID or PASSWORD");
                login = { "login": "wrong" }
            }
            login_data = JSON.stringify(login);
            console.log(login_data);
            res.write(login_data);              
            res.end();
        }
        else {
            login = { "login": "wrong" };
            console.log("WRONG ID")
            login_data = JSON.stringify(login);
            console.log(login_data);
            res.write(login_data);  
            res.end();
        }
    })
})

//login_pc
router.route("/user_pc/login").post(function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log("email : " + email);
    console.log("password : " + password);
    mysqlDB.query('select * from USER where USER_ID=?', [email], function (err, results) {
        var login;
        var login_data;
        if (err) {
            login = { "login": "error" };
            console.log("LOGIN ERROR");
            console.log(err);
            console.log(JSON.stringify(login));
            res.redirect('/login');
            return;
        }
        if (results.length > 0) {
            console.log(results);
            var user = results[0];
            var hashPassword = crypto.createHash("sha512").update(password + user.SALT).digest("hex");

            if (hashPassword === user.USER_PW) {
                console.log("login success");
                login = { "login": "success" };    
                 //세션 처리 해야한다// 
                sess = req.session;
                sess.email = email;
                sess.state = 't'; //권한  
                sess.name = user.NAME;  
                console.log(sess.email + sess.name);
                //권한 세션 입력해야한다.-> 디비처리//      
                 
                mysqlDB.query('select * from INVITE where RECV_USER_ID=?', [sess.email], function (err, results) {
                    console.log(results);
                })
                req.session.save(function(){
                    res.render('main.html',{username:sess.name});
                });           
               
                
            } else {
                console.log("WRONG ID or PASSWORD");
                login = { "login": "wrong" };
                res.redirect('/login');
            }
            
        }
        else {
            login = { "login": "wrong" };
            console.log("WRONG ID");
            res.redirect('/login'); 
        }
    })
})

router.route("/task/createBIG").post(upload.array('userFiles', 12), function (req, res) {
    if (req.files != null)
        files = req.files;
    else
        files = [];
    var projectID = req.body.ProjectID;
    var BigLevel = req.body.BigLevel;
    var BigTitle = req.body.BigTitle;
    var BigStart = req.body.BigStart;
    var BigEnd = req.body.BigEnd;
    var BigDesc = req.body.BigDesc;
    var BigAttach = req.body.BigAttach;
    var BigStatus = req.body.BigStatus;
    var BigAuthor = req.body.BigAuthor;
    var BigCreated = req.body.BigCreated;
    var BigWeight = req.body.BigWeight;
    var BigProgress = req.body.BigProgress;

    console.log(`projectID : ${projectID} , BigLevel : ${BigLevel}, BigTitle : ${BigTitle}, BigStart : ${BigStart} , BigEnd : ${BigEnd}, BigDesc : ${BigDesc}, 
            BigStatus : ${BigStatus}, BigAuthor : ${BigAuthor}, BigCreated : ${BigCreated} , BigWeight : ${BigWeight}, BigProgress : ${BigProgress}`);

    var data = {
        PROJ_ID: projectID, BIG_LEVEL: BigLevel, BIG_TITLE: BigTitle, BIG_START: BigStart, BIG_END: BigEnd, BIG_DESC: BigDesc, BIG_ATTACHMENT: BigAttach,
        BIG_STATUS: BigStatus, BIG_AUTHOR: BigAuthor, BIG_CREATED: BigCreated, BIG_WEIGHT: BigWeight, BIG_PROGRESS: BigProgress
    };

    mysqlDB.query('INSERT INTO POST_BIG set ?', data, async function (err, results) {
        var admit;
        if (!err) {
            var result_id = results["insertId"];
            var dir = "./public/" + projectID + "/" +result_id;

            if (!fs.existsSync(dir))
                fs.mkdirSync(dir);
                
            for (var i = 0; i < files.length; ++i) {
                fs.renameSync("./public/" + files[i].originalname, dir + "/" + files[i].originalname);
                var extension = path.extname(files[i].originalname);    // move

                if (extension == '.pdf' || extension == '.pptx' || extension == '.docx')
                    var options = {
                        mode: 'text',
                        pythonPath: '/usr/bin/python',//doesn't matter
                        pythonOptions: ['-u'],
                        scriptPath: '', //doesn't matter
                        args: [dir + "/" + files[i].originalname] // SET THIS !!!!!  sample.docx  
                    };
                var fpath = dir + '/' + files[i].originalname;
                pythonShell(fpath, options, projectID);
            }

            var result_attach = BigAttach.split('*');
            console.log("result_attach" + result_attach);
            var attaches='';
            for(var i = 0; i<result_attach.length-1; i++){
                attaches += dir +'/' + result_attach[i] +'*';
            }

            mysqlDB.query('UPDATE POST_BIG set BIG_ATTACHMENT = ? where BIG_ID = ?', [attaches, result_id] , function(err,rows,field){
                if(err){
                    console.log(err);
                    admit = { "create": "deny" };
                }else{
                    console.log("post update 성공")
                    admit = { "create": "success" };
                }
                res.write(JSON.stringify(admit));
                res.end();
            });         
  
        } else {
            console.log(err);
            console.log("TASK INSERT ERROR");
            admit = { "create": "deny" };
            res.write(JSON.stringify(admit));
            res.end();
        }
    })
})

function pythonShell(fpath, options, projectID){
    console.log("path: "+fpath);
    console.log("options: "+options);

    PythonShell.run('./public/extract_word/extract_text_from_file.py', options, function (err, extract_results) {
        if (err) throw err;
        else{
            console.log('results: %j', extract_results);
            for(var j = 0; j< extract_results.length; j++){
                searchQueries(fpath, extract_results[j], projectID);
            }   
        }
    });
}

function searchQueries(fpath, word, projectID){
    console.log("sub path: "+fpath);
    console.log("sub word: "+word);

    mysqlDB.query('select * from SEARCH where PROJ_ID=? and WORD = ?', [projectID, word], function (err, select_results) {
        if (err) {
            var res_word = { "word": "error" };
            console.log("word select ERROR");
            console.log(err);
            console.log(JSON.stringify(res_word));
        }
        else if (select_results.length > 0) {
            console.log(select_results);
            var new_path = select_results[0]['FILE_PATHS'] + '*' + fpath; 
            mysqlDB.query('UPDATE SEARCH set FILE_PATHS = ? where PROJ_ID = ? and WORD = ?', [new_path, projectID, word],
             function(err,rows,field){
                if(err){
                    console.log(err);
                    console.log("SEARCH UPDATE 실패");
                }else{
                    console.log("SEARCH UPDATE 성공")
                }
            });         
        }
        else {
            var search_data = {
                PROJ_ID: projectID,
                WORD: word,
                FILE_PATHS: fpath
            }
            console.log(search_data);
            mysqlDB.query('INSERT INTO SEARCH set ?', search_data, function(err,results){
                if(err){
                    console.log(err);
                    console.log("SEARCH insert 실패");
                }else{
                    console.log(results);
                    console.log("SEARCH insert 성공")
                }
            });   
        }
    })
}


// GENERATE-TASK-Middle
router.route("/task/createMID").post(upload.array('userFiles', 12), function (req, res) {
    if (req.files != null)
        files = req.files;
    else
        files = [];    
    var projectID = req.body.ProjectID;
    var BigID = req.body.BigID;
    var MidLevel = req.body.MidLevel;
    var MidTitle = req.body.MidTitle;
    var MidStart = req.body.MidStart;
    var MidEnd = req.body.MidEnd;
    var MidDesc = req.body.MidDesc;
    var MidAttach = req.body.MidAttach;
    var MidStatus = req.body.MidStatus;
    var MidAuthor = req.body.MidAuthor;
    var MidCreated = req.body.MidCreated;

    console.log(`BigID : ${BigID} , MidLevel : ${MidLevel}, MidTitle : ${MidTitle}, MidStart : ${MidStart} , MidEnd : ${MidEnd}, MidDesc : ${MidDesc}, `
        + `MidAttach : ${MidAttach} , MidStatus : ${MidStatus}, MidAuthor : ${MidAuthor}, MidCreated : ${MidCreated}`);

    var data = {
        BIG_ID: BigID, MID_LEVEL: MidLevel, MID_TITLE: MidTitle, MID_START: MidStart, MID_END: MidEnd, MID_DESC: MidDesc,
        MID_ATTACHMENT: MidAttach, MID_STATUS: MidStatus, MID_AUTHOR: MidAuthor, MID_CREATED: MidCreated
    };
    mysqlDB.query('INSERT INTO POST_MID set ?', data, function (err, results) {
        var admit;
        if (!err) {
            var result_id = results["insertId"];
            var dir = `./public/${projectID}/${BigID}/${result_id}`;
            
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir);
                
            for (var i = 0; i < files.length; ++i){
                fs.rename("./public/" + files[i].originalname, dir + "/" + files[i].originalname, function (err) { });
                var extension = path.extname(files[i].originalname);    // move

                if (extension == '.pdf' || extension == '.pptx' || extension == '.docx')
                    var options = {
                        mode: 'text',
                        pythonPath: '/usr/bin/python',//doesn't matter
                        pythonOptions: ['-u'],
                        scriptPath: '', //doesn't matter
                        args: [dir + "/" + files[i].originalname] // SET THIS !!!!!  sample.docx  
                    };
                var fpath = dir + '/' + files[i].originalname;
                pythonShell(fpath, options, projectID);
            }

            var result_attach = MidAttach.split('*');
            var attaches='';
            for(var i = 0; i<result_attach.length-1; i++){
                attaches += dir +'/' + result_attach[i] +'*';
            }
            mysqlDB.query('UPDATE POST_MID set MID_ATTACHMENT = ? where MID_ID = ?', [attaches, result_id] , function(err,rows,field){
                if(err){
                    console.log(err);
                    admit = { "create": "deny" };
                }else{
                    console.log("post update 성공");
                    admit = { "create": "success" };
                }
                res.write(JSON.stringify(admit));
                res.end();
            });            
        } else {
            console.log(err);
            admit = { "create": "deny" };
            res.write(JSON.stringify(admit));
            res.end();
        }
    })
})

// GENERATE-TASK-Small
router.route("/task/createSML").post(upload.array('userFiles', 12), function (req, res) {
    if (req.files != null)
        files = req.files;
    else
        files = [];
    var projectID = req.body.ProjectID;
    var BigID = req.body.BigID;
    var MidID = req.body.MidID;
    var SmlTitle = req.body.SmlTitle;
    var SmlStart = req.body.SmlStart;
    var SmlEnd = req.body.SmlEnd;
    var SmlDesc = req.body.SmlDesc;
    var SmlAttach = req.body.SmlAttach;
    var SmlStatus = req.body.SmlStatus;
    var SmlAuthor = req.body.SmlAuthor;
    var SmlCreated = req.body.SmlCreated;

    console.log(`MidID : ${MidID} , SmlTitle : ${SmlTitle}, SmlStart : ${SmlStart} , SmlEnd : ${SmlEnd}, SmlDesc : ${SmlDesc}, `
        + `SmlAttach : ${SmlAttach} , SmlStatus : ${SmlStatus}, SmlAuthor : ${SmlAuthor}, SmlCreated : ${SmlCreated}`);

    var data = {
        MID_ID: MidID, SML_TITLE: SmlTitle, SML_START: SmlStart, SML_END: SmlEnd, SML_DESC: SmlDesc,
        SML_ATTACHMENT: SmlAttach, SML_STATUS: SmlStatus, SML_AUTHOR: SmlAuthor, SML_CREATED: SmlCreated
    };
    mysqlDB.query('INSERT INTO POST_SML set ?', data, function (err, results) {
        var admit;
        if (!err) {
            var result_id = results["insertId"];
            var dir = `./public/${projectID}/${BigID}/${MidID}/${result_id}`;
            
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir);
                
            for (var i = 0; i < files.length; ++i){
                fs.rename("./public/" + files[i].originalname, dir + "/" + files[i].originalname, function (err) { });
                var extension = path.extname(files[i].originalname);    // move
                
                if (extension == '.pdf' || extension == '.pptx' || extension == '.docx')
                    var options = {
                        mode: 'text',
                        pythonPath: '/usr/bin/python',//doesn't matter
                        pythonOptions: ['-u'],
                        scriptPath: '', //doesn't matter
                        args: [dir + "/" + files[i].originalname] // SET THIS !!!!!  sample.docx  
                    };
                var fpath = dir + '/' + files[i].originalname;
                pythonShell(fpath, options, projectID);
            }

            var result_attach = SmlAttach.split('*');
            var attaches='';
            for(var i = 0; i<result_attach.length-1; i++){
                attaches += dir +'/' + result_attach[i] +'*';
            }
            mysqlDB.query('UPDATE POST_SML set SML_ATTACHMENT = ? where SML_ID = ?', [attaches, result_id] , function(err,rows,field){
                if(err){
                    console.log("post update 실패");
                    admit = { "create": "deny" };
                }else{
                    console.log("post update 성공")
                    admit = { "create": "success" };
                }
                res.write(JSON.stringify(admit));
                res.end();
            });   
        } else {
            console.log("TASK INSERT ERROR");
            admit = { "create": "deny" };
            res.write(JSON.stringify(admit));
            res.end();
        }
    })
})
// NOTI create
router.route("/create/noti").post(function (req, res) {
    console.log(req.body);
    var proj_id = req.body.proj_id;
    var title = req.body.title;
    var desc = req.body.desc;
    var status = 0;
    var author = req.body.author;
    var created = req.body.created;

    var data = {
        PROJ_ID: proj_id,
        NOTI_TITLE: title,
        NOTI_DESC: desc,
        NOTI_STATUS: status,
        NOTI_AUTHOR: author,
        NOTI_CREATED: created
    };
    console.log(data);
    mysqlDB.query('INSERT INTO POST_NOTI set ?', data, function (err, results) {
        var admit;
        if (!err) {
            admit = { "create": "success" };
        } else {
            console.log(err);
            admit = { "create": "deny" };
        }
        res.write(JSON.stringify(admit));
        res.end();
    })
})
// PROJECT Create
router.route("/project/create").post(function (req, res) {
    var mgr_id = req.body.mgr_id;
    var title = req.body.title;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var desc = req.body.desc;
    var user_id = req.body.user_id;
    var pm_id = req.body.pm_id;
    var p_salt = Math.round((new Date().valueOf() * Math.random())) + "";
    var hashURL = crypto.createHash("sha512").update(mgr_id + p_salt).digest("hex");
    console.log(req.body);
    var data = {
        PROJ_MGR_UID: mgr_id,
        PROJ_NAME: title,
        PROJ_START: start_date,
        PROJ_END: end_date,
        PROJ_DESC: desc,
        PROJ_PROGRESS: 0.00,
        PROJ_STATUS: 0,
        PROJ_URL: hashURL,
        SALT: p_salt
    };
    console.log(data);
    mysqlDB.query('INSERT INTO PROJECT set ?', data, function (err, results) {
        var admit;
        if (!err) {
            var projectID = results["insertId"];
            var dir = `./public/${projectID}`;
            if(!fs.existsSync(dir))
                fs.mkdirSync(dir);
            
            console.log("PROJECT create success");
            console.log(results);

            // 현재 프로젝트 생성하는 유저는 반드시 이 프로젝트에 참가한다. PM 자격도 가진다.
            data = {
                PROJ_ID: results.insertId,
                USER_ID: mgr_id,
                ISPM: true
            };
            console.log(data);

            mysqlDB.query('INSERT INTO ATTENDENCE set ?', data, function (err, results) {
                var admit;
                if (!err) {
                    console.log("mgr_id ATTENDENCE create success");
                }else {
                    console.log("mgr_id ATTENDENCE create fail");
                    admit = { "create": "mgr_id ATTENDENE create fail." };
                    res.write(JSON.stringify(admit));
                    res.end();
                }
            })
            
            /****************************
             * user invite table insert
             ****************************/
            console.log('user_id :'+user_id);
            if ( typeof(user_id) === 'undefined' ) {   // 참가할 팀원에 한명도 추가 안했을 시
                console.log('user_id: undefined');
            }
            else if (Array.isArray(user_id)) {   // 만약 user_id가 array이다 : array 요소 하나하나에 대해 따로 처리한다.
                // user_id 배열 요소 하나씩 Invite db에 넣는다.
                for(var i=0; i<user_id.length; i++) {
                    data = {
                        PROJ_ID: results.insertId,
                        SEND_USER_ID: mgr_id,
                        RECV_USER_ID: user_id[i],
                        ISPM: false
                    };
                    console.log(data); 

                    mysqlDB.query('INSERT INTO INVITE set ?', data, function (err, results) {
                        var admit;
                        if (!err) {
                            console.log("INVITE user create success");
                            /*if (i == user_id.length-1) {
                                admit = { "create": "success" };
                                res.write(JSON.stringify(admit));
                                res.end();
                            }*/
                        }else {
                            console.log("INVITE user create fail");
                            admit = { "create": "INVITE user create fail." };
                            res.write(JSON.stringify(admit));
                            res.end();
                        }
                    })
                }
            }else { // user_id가 배열이 아닌 경우 입력이 1개만 된 경우이므로 따로 처리한다.
                data = {
                    PROJ_ID: results.insertId,
                    SEND_USER_ID: mgr_id,
                    RECV_USER_ID: user_id,
                    ISPM: false
                };
                console.log(data); 

                mysqlDB.query('INSERT INTO INVITE set ?', data, function (err, results) {
                    var admit;
                    if (!err) {
                        console.log("INVITE user create success");
                        /*if (i == user_id.length-1) {
                            admit = { "create": "success" };
                            res.write(JSON.stringify(admit));
                            res.end();
                        }*/
                    }else {
                        console.log("INVITE user create fail");
                        admit = { "create": "INVITE user create fail." };
                        res.write(JSON.stringify(admit));
                        res.end();
                    }
                })
            }

            /********************
             * pm invite insert
             ********************/
            console.log('pm_id :'+pm_id);
            if ( typeof(pm_id) === 'undefined' ) {   // 참가할 팀원에 한명도 추가 안했을 시
                sess = req.session;
                console.log('pm_id: undefined');
                //res.render('main.html', {username:sess.name});
                res.redirect('/table');
                return 0;
            }
            else if (Array.isArray(pm_id)) {   // 만약 user_id가 array이다 : array 요소 하나하나에 대해 따로 처리한다.
                // user_id 배열 요소 하나씩 INVITE db에 넣는다.
                for(var i=0; i<pm_id.length; i++) {
                    data = {
                        PROJ_ID: results.insertId,
                        SEND_USER_ID: mgr_id,
                        RECV_USER_ID: pm_id[i],
                        ISPM: true
                    };
                    console.log(data); 

                    mysqlDB.query('INSERT INTO INVITE set ?', data, function (err, results) {
                        var admit;
                        if (!err) {
                            sess = req.session;
                            console.log("INVITE pm create success");
                           //res.render('main.html', {username:sess.name});
                            res.redirect('/table');
                            /*if (i == user_id.length-1) {
                                admit = { "create": "success" };
                                res.write(JSON.stringify(admit));
                                res.end();
                            }*/
                        }else {
                            console.log("INVITE pm create fail");
                            admit = { "create": "INVITE pm create fail." };
                            res.write(JSON.stringify(admit));
                            res.send('<script type="text/javascript">alert("프로젝트 생성에 실패했습니다.");</script>');
                            res.end();
                        }
                    })
                }
            }else { // user_id가 배열이 아닌 경우 입력이 1개만 된 경우이므로 따로 처리한다.
                data = {
                    PROJ_ID: results.insertId,
                    SEND_USER_ID: mgr_id,
                    RECV_USER_ID: pm_id,
                    ISPM: true
                };
                console.log(data); 

                mysqlDB.query('INSERT INTO INVITE set ?', data, function (err, results) {
                    var admit;
                    if (!err) {
                        sess = req.session;
                        console.log("INVITE pm create success");
                        //res.render('main.html', {username:sess.name});
                         res.redirect('/table');
                        /*if (i == user_id.length-1) {
                            admit = { "create": "success" };
                            res.write(JSON.stringify(admit));
                            res.end();
                        }*/
                    }else {
                        console.log("INVITE pm create fail");
                        admit = { "create": "INVITE pm create fail." };                        
                        res.write(JSON.stringify(admit));
                        res.send('<script type="text/javascript">alert("프로젝트 생성에 실패했습니다.");</script>');
                        res.end();
                    }
                })
            }

        } else {    // err of query(INSERT INTO PROJECT set ?)
            console.log(err);

            console.log("PROJECT create fail");
            admit = { "create": "PROJECT create fail." };
            res.write(JSON.stringify(admit));
            res.end();
        }
    })
})

//project list select
router.route("/project/select").get(function (req, res) {
    var user_id = req.query.user_id;
    console.log("======= Proejct Select =======\n");
    console.log("user_id: " + user_id);

    mysqlDB.query('select * from PROJECT pj where PROJ_STATUS=0 AND EXISTS ( select * from ATTENDENCE at where at.USER_ID = ? AND pj.PROJ_ID = at.PROJ_ID)', [user_id], function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.end();
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows));
            res.end();
        }
    })
})




//get Project name
router.route("/projectName/select").get(function (req, res) {
    var proj_id = req.query.proj_id;
    console.log("======= project Name Select =======\n");
    console.log("proj_id: " + proj_id);

    mysqlDB.query('select PROJ_NAME from PROJECT where PROJ_ID = ?', [proj_id], function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.end();
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows[0]));
            res.end();
        }
    })
})


//get Project Info
router.route("/projectInfo/select").get(function (req, res) {
    var proj_url = req.query.proj_url;
    console.log("======= project Name Select =======\n");
    console.log("proj_url: " + proj_url);

    mysqlDB.query('select PROJ_ID, PROJ_NAME, PROJ_MGR_UID, PROJ_DESC from PROJECT where PROJ_URL = ?', [proj_url], function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.end();
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows[0]));
            res.end();
        }
    })
})



//big list select alert list
router.route("/taskView/Big/select").get(function (req, res) {
    var proj_id = req.query.proj_id;
    console.log("======= Big Task Select =======\n");

    mysqlDB.query('select * from POST_BIG where PROJ_ID = ? and (BIG_STATUS=0 or BIG_STATUS=1) order by BIG_LEVEL', [proj_id], function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.end();
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows));
            res.end();
        }
    })
})
//middle list select alert list
router.route("/taskView/Mid/select").get(function (req, res) {
    var big_id = req.query.big_id;
    console.log("======= Mid Task Select =======\n");

    mysqlDB.query('select * from POST_MID where BIG_ID = ? and (MID_STATUS=0 or MID_STATUS=1) order by MID_LEVEL', [big_id], function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.end();
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows));
            res.end();
        }
    })
})

//small list select 
router.route("/taskView/Sml/select").get(function (req, res) {
    var mid_id = req.query.mid_id;
    console.log("======= Sml Task Select =======\n");

    mysqlDB.query('select * from POST_SML where MID_ID = ? and (SML_STATUS=0 or SML_STATUS=1) order by SML_CREATED', [mid_id], function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.end();
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows));
            res.end();
        }
    })
})


//notilist list 
router.route("/notification/select").get(function (req, res) {
    var proj_id = req.query.proj_id;
    console.log("======= Notification Select =======\n");

    mysqlDB.query('select * from POST_NOTI where proj_id = ? and (NOTI_STATUS=0 or NOTI_STATUS=1)', [proj_id], function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.end();
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows));
            res.end();
        }
    })
})


// Attend-project-member
router.route("/attend/member").post(function (req, res) {
    var projectID = req.body.proj_id;
    var userID = req.body.user_id;
    console.log(`projectID : ${projectID} , userID : ${userID}`);

    var data = {
        PROJ_ID: projectID, USER_ID: userID
    };
    mysqlDB.query('INSERT INTO ATTENDENCE set ?', data, function (err, results) {
        var admit;
        if (!err) {
            admit = { "attend": "success" };
            console.log("Add member success");
            res.write(JSON.stringify(admit));
            res.end();
        } else {
            console.log("Add member ERROR");
            admit = { "attend": "deny" };
            res.write(JSON.stringify(admit));
            res.end();
        }
    })
})
router.route("/update-status/noti").get(function(req,res){ //NOTI 상태 변경
    var id = req.query.id;
    var status = req.query.status;
    mysqlDB.query('update POST_NOTI set NOTI_STATUS = ? where NOTI_ID=?',[status,id],function(err,rows,fields){
        var project;
        if(err){
            console.log(err);
            project = {"check":"no"}
            res.send(JSON.stringify(project))
        }else{
            console.log("상태변경 성공");
            project = {"check":"yes"}
            res.send(JSON.stringify(project))
        }
    })
});
router.route("/update-status/big").get(function(req,res){ //BIG 상태 변경
    var id = req.query.id;
    var status = req.query.status;
    mysqlDB.query('update POST_BIG set BIG_STATUS = ? where BIG_ID=?',[status,id],function(err,rows,fields){
        var project;
        if(err){
            console.log(err);
            project = {"check":"no"}
            res.send(JSON.stringify(project))
        }else{
            console.log("상태변경 성공");
            project = {"check":"yes"}
            res.send(JSON.stringify(project))
        }
    })
});
router.route("/update-status/mid").get(function(req,res){ //MID 상태 변경
    var id = req.query.id;
    var status = req.query.status;
    mysqlDB.query('update POST_MID set MID_STATUS = ? where MID_ID=?',[status,id],function(err,rows,fields){
        var project;
        if(err){
            console.log(err);
            project = {"check":"no"}
            res.send(JSON.stringify(project))
        }else{
            console.log("상태변경 성공");
            project = {"check":"yes"}
            res.send(JSON.stringify(project))
        }
    })
});
router.route("/update-status/sml").get(function(req,res){ //SML 상태 변경
    var id = req.query.id;
    var status = req.query.status;
    mysqlDB.query('update POST_SML set SML_STATUS = ? where SML_ID=?',[status,id],function(err,rows,fields){
        var project;
        if(err){
            console.log(err);
            project = {"check":"no"}
            res.send(JSON.stringify(project))
        }else{
            console.log("상태변경 성공");
            project = {"check":"yes"}
            res.send(JSON.stringify(project))
        }
    })
});

router.route("/update-status/project").get(function(req,res){ //프로젝트 상태 변경
    var projectID = req.query.proj_id;
    var projectSTATUS = req.query.proj_status;
    mysqlDB.query('update PROJECT set PROJ_STATUS = ? where PROJ_ID=?',[projectSTATUS,projectID],function(err,rows,fields){
        var project;
        if(err){
            console.log(err);
            project = {"check":"no"}
            res.send(JSON.stringify(project))
        }else{
            console.log("상태변경 성공");
            project = {"check":"yes"}
            res.send(JSON.stringify(project))
        }
    })
});
router.route("/update-progress/project").get(function(req,res){ //프로젝트 상태 변경
    var projectID = req.query.proj_id;
    var projectProgress = req.query.proj_progress;
    console.log(projectID +' '+ projectProgress)
    mysqlDB.query('update PROJECT set PROJ_PROGRESS = ? where PROJ_ID=?',[projectProgress, projectID],function(err,rows,fields){
        var project;
        if(err){
            console.log(err);
            project = {"check":"no"}
            res.send(JSON.stringify(project))
        }else{
            console.log("상태변경 성공");
            project = {"check":"yes"}
            res.send(JSON.stringify(project))
        }
    })
});

router.route('/download').get(function(req, res){
  const file = req.query.path;
  res.download(file);
});


router.route("/insert/big-comment").get(function (req, res) {
    var BigID = req.query.BigID;
    var BigCoAuthor = req.query.BigCoAuthor;
    var BigComment = req.query.BigComment;
    var BigTime = req.query.BigTime;
    var BigCoStatus = req.query.BigCoStatus;
    console.log(`BigID : ${BigID} , BigCoAuthor : ${BigCoAuthor}, BigComment : ${BigComment}, BigTime : ${BigTime} , BigCoStatus : ${BigCoStatus}`);

    var data = { BIG_ID: BigID, BIGC_AUTHOR: BigCoAuthor, BIGC_COMMENT: BigComment, BIGC_TIME: BigTime, BIGC_STATUS: BigCoStatus };
    mysqlDB.query('INSERT INTO COMMENT_BIG set ?', data, function (err, results) {
        var admit;
        if (!err) {
            admit = { "insert": "success" };
            console.log("Insert comment success");
            res.write(JSON.stringify(admit));
            res.end();
            console.log(results);
        } else {
            console.log("INSERT ERROR");
            admit = { "insert": "deny" };
            res.write(JSON.stringify(admit));
            res.end();
        }
    })
})

router.route("/insert/mid-comment").get(function (req, res) {
    var MidID = req.query.MidID;
    var MidCoAuthor = req.query.MidCoAuthor;
    var MidComment = req.query.MidComment;
    var MidTime = req.query.MidTime;
    var MidCoStatus = req.query.MidCoStatus;
    console.log(`MidID : ${MidID} , MidCoAuthor : ${MidCoAuthor}, MidComment : ${MidComment}, MidTime : ${MidTime} , MidCoStatus : ${MidCoStatus}`);

    var data = { MID_ID: MidID, MIDC_AUTHOR: MidCoAuthor, MIDC_COMMENT: MidComment, MIDC_TIME: MidTime, MIDC_STATUS: MidCoStatus };
    mysqlDB.query('INSERT INTO COMMENT_MID set ?', data, function (err, results) {
        var admit;
        if (!err) {
            admit = { "insert": "success" };
            console.log("Insert comment success");
            res.write(JSON.stringify(admit));
            res.end();
            console.log(results);
        } else {
            console.log("INSERT ERROR");
            admit = { "insert": "deny" };
            res.write(JSON.stringify(admit));
            res.end();
        }
    })
})


router.route("/insert/small-comment").get(function (req, res) {
    var SmlID = req.query.SmlID;
    var SmlCoAuthor = req.query.SmlCoAuthor;
    var SmlComment = req.query.SmlComment;
    var SmlTime = req.query.SmlTime;
    var SmlCoStatus = req.query.SmlCoStatus;
    console.log(`SmlID : ${SmlID} , SmlCoAuthor : ${SmlCoAuthor}, SmlComment : ${SmlComment}, SmlTime : ${SmlTime} , SmlCoStatus : ${SmlCoStatus}`);

    var data = { SML_ID: SmlID, SMLC_AUTHOR: SmlCoAuthor, SMLC_COMMENT: SmlComment, SMLC_TIME: SmlTime, SMLC_STATUS: SmlCoStatus };
    mysqlDB.query('INSERT INTO COMMENT_SML set ?', data, function (err, results) {
        var admit;
        if (!err) {
            admit = { "insert": "success" };
            console.log("Insert comment success");
            res.write(JSON.stringify(admit));
            res.end();
            console.log(results);
        } else {
            console.log("INSERT ERROR");
            admit = { "insert": "deny" };
            res.write(JSON.stringify(admit));
            res.end();
        }
    })
})



router.route("/insert/noti-comment").get(function (req, res) {
    var NotiID = req.query.NotiID;
    var NotiCoAuthor = req.query.NotiCoAuthor;
    var NotiComment = req.query.NotiComment;
    var NotiTime = req.query.NotiTime;
    var NotiCoStatus = req.query.NotiCoStatus;
    console.log(`NotiID : ${NotiID} , NotiCoAuthor : ${NotiCoAuthor}, NotiComment : ${NotiComment}, NotiTime : ${NotiTime} , NotiCoStatus : ${NotiCoStatus}`);

    var data = { NOTI_ID: NotiID, NOTIC_AUTHOR: NotiCoAuthor, NOTIC_COMMENT: NotiComment, NOTIC_TIME: NotiTime, NOTIC_STATUS: NotiCoStatus };
    mysqlDB.query('INSERT INTO COMMENT_NOTI set ?', data, function (err, results) {
        var admit;
        if (!err) {
            admit = { "insert": "success" };
            console.log("Insert comment success");
            res.write(JSON.stringify(admit));
            res.end();
            console.log(results);
        } else {
            console.log("INSERT ERROR");
            admit = { "insert": "deny" };
            res.write(JSON.stringify(admit));
            res.end();
        }
    })
})


router.route("/select/big-comment").get(function (req, res) {
    var BigID = req.query.big_id;
    console.log("=======Big Comment Select =======\n");
    console.log("BigID: " + BigID);

    mysqlDB.query('select * from COMMENT_BIG where BIG_ID = ?', [BigID], function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows));
            res.end();
        }
    })
})

router.route("/select/mid-comment").get(function (req, res) {
    var MidID = req.query.mid_id;
    console.log("=======Mid Comment Select =======\n");
    console.log("MidID: " + MidID);

    mysqlDB.query('select * from COMMENT_MID where MID_ID = ?', [MidID], function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows));
            res.end();
        }
    })
})

router.route("/select/sml-comment").get(function (req, res) {
    var SmlID = req.query.sml_id;
    console.log("=======Sml Comment Select =======\n");
    console.log("SmlID: " + SmlID);

    mysqlDB.query('select * from COMMENT_SML where SML_ID = ?', [SmlID], function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows));
        }
        res.end();
    })
})


router.route("/select/noti-comment").get(function (req, res) {
    var NotiID = req.query.noti_id;
    console.log("=======Noti Comment Select =======\n");
    console.log("NotiID: " + NotiID);

    mysqlDB.query('select * from COMMENT_NOTI where NOTI_ID = ?', [NotiID], function (err, rows, fields) {
        if (err) {
            console.log("error입니다")
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows));
            res.end();
        }
    })
})

router.route("/delete/big-comment").get(function (req, res) {
    var BigCID = req.query.bigc_id;
    console.log("=======Big Comment Delete =======\n");
    console.log("BigCID: " + BigCID);

    mysqlDB.query('delete from COMMENT_BIG where BIGC_ID = ?', [BigCID], function (err, results, fields) {
        if (err) {
            admit = {"delete" : "error"};
            console.log("Delete comment error");
            res.write(JSON.stringify(admit));
            res.end();
        }
        else {
            admit = { "delete": "success" };
            console.log("Delete comment success");
            res.write(JSON.stringify(admit));
            res.end();
        }
    })
})

router.route("/delete/mid-comment").get(function (req, res) {
    var MidCID = req.query.midc_id;
    console.log("=======Mid Comment Delete =======\n");
    console.log("MidCID: " + MidCID);

    mysqlDB.query('delete from COMMENT_MID where MIDC_ID = ?', [MidCID], function (err, results, fields) {
        if (err) {
            admit = {"delete" : "error"};
            console.log("Delete comment error");
            res.write(JSON.stringify(admit));
            res.end();
        }
        else {
            admit = { "delete": "success" };
            console.log("Delete comment success");
            res.write(JSON.stringify(admit));
            res.end();
        }
    })
})

router.route("/delete/sml-comment").get(function (req, res) {
    var SmlCID = req.query.smlc_id;
    console.log("=======Sml Comment Delete =======\n");
    console.log("SmlCID: " + SmlCID);

    mysqlDB.query('delete from COMMENT_SML where SMLC_ID = ?', [SmlCID], function (err, results, fields) {
        if (err) {
            admit = {"delete" : "error"};
            console.log("Delete comment error");
            res.write(JSON.stringify(admit));
            res.end();
        }
        else {
            admit = { "delete": "success" };
            console.log("Delete comment success");
            res.write(JSON.stringify(admit));
            res.end();
        }
    })
})

router.route("/delete/noti-comment").get(function (req, res) {
    var NotiCID = req.query.notic_id;
    console.log("=======Noti Comment Delete =======\n");
    console.log("NotiCID: " + NotiCID);

    mysqlDB.query('delete from COMMENT_NOTI where NOTIC_ID = ?', [NotiCID], function (err, results, fields) {
        if (err) {
            admit = {"delete" : "error"};
            console.log("Delete comment error");
            res.write(JSON.stringify(admit));
            res.end();
        }
        else {
            admit = { "delete": "success" };
            console.log("Delete comment success");
            res.write(JSON.stringify(admit));
            res.end();
        }
    })
})


//project one select
router.route("/one-project/select").get(function (req, res) {
    var proj_id = req.query.proj_id;
    console.log("======= Proejct Select =======\n");
    console.log("proj_id: " + proj_id);

    mysqlDB.query('select * from PROJECT where PROJ_ID = ?)', [proj_id], function (err, rows, fields) {
        if (err) {
            console.log("error입니다")
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows));
            res.end();
        }
    })
})


//postbig one select
router.route("/one-postbig/select").get(function (req, res) {
    var big_id = req.query.big_id;
    console.log("======= Post Big Select =======\n");
    console.log("big_id: " + big_id);

    mysqlDB.query('select * from POST_BIG where BIG_ID = ?)', [big_id], function (err, rows, fields) {
        if (err) {
            console.log("error입니다")
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows));
            res.end();
        }
    })
})


//postmid one select
router.route("/one-postmid/select").get(function (req, res) {
    var mid_id = req.query.mid_id;
    console.log("======= Post Mid Select =======\n");
    console.log("mid_id: " + mid_id);

    mysqlDB.query('select * from POST_MID where MID_ID = ?)', [mid_id], function (err, rows, fields) {
        if (err) {
            console.log("error입니다")
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows));
            res.end();
        }
    })
})


//postsml one select
router.route("/one-postsml/select").get(function (req, res) {
    var sml_id = req.query.sml_id;
    console.log("======= Post Sml Select =======\n");
    console.log("sml_id: " + sml_id);

    mysqlDB.query('select * from POST_SML where SML_ID = ?)', [sml_id], function (err, rows, fields) {
        if (err) {
            console.log("error입니다")
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows));
            res.end();
        }
    })
})


//postnoti one select
router.route("/one-postnoti/select").get(function (req, res) {
    var noti_id = req.query.noti_id;
    console.log("======= NOTI Select =======\n");
    console.log("noti_id: " + noti_id);

    mysqlDB.query('select * from POST_NOTI where NOTI_ID = ?)', [noti_id], function (err, rows, fields) {
        if (err) {
            console.log("error입니다")
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows));
            res.end();
        }
    })
})

router.route("/select/search").get(function (req, res) {
    var id = req.query.proj_id;

    mysqlDB.query('select * from SEARCH where PROJ_ID = ?', [id], function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(rows);
            res.write(JSON.stringify(rows));
            res.end();
        }
    })
})


//postnoti one select
router.route("/extract/word").get(function (req, res) {
    var options = {
        mode: 'text', 
        pythonPath: '/usr/bin/python',//doesn't matter
        pythonOptions: ['-u'],
        scriptPath: '', //doesn't matter
        args: ['./public/extract_word/sample.docx'] // SET THIS !!!!!  sample.docx  
    };

    PythonShell.run('./public/extract_word/extract_text_from_file.py', options, function (err, results) {

        if (err) throw err;
      
        console.log('results: %j', results);
      
    });
});

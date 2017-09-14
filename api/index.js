var express = require('express');
var app = express();
var path = require('path');
var Q = require("q");
var engines = require('consolidate');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require("passport");
var MongoClient = require('mongodb').MongoClient;
var nodemailer  = require('nodemailer');
var cookieParser = require('cookie-parser');
var session = require("express-session");
var hash = require('./pass').hash;
var pathroute = require('./routes/path.js')
var btoa = require('btoa')
var jwt = require('jsonwebtoken');
var validate = require('./validator');
var config = require('./config');
var _  = require("lodash");
var sendmail = require('sendmail')();
var jsSHA = require("jssha");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '../web/public_html')));

app.use(session({secret:config.secret,saveUninitialized: true,
  resave: true,cookie:{maxAge:2000*3000*30000,httpOnly: false}}));

app.post("/login", function(req, res, next){
     res.set("Access-Control-Allow-Origin", "*");
     MongoClient.connect('Xxx', function(err, db){
           if (err) {
               return res.send({
                   errorCode: "ERROR",
                   msg: err.message
               });
           }
           app.set("dbs",db);
           db= req.db = app.get("db1");
           next();
       });
},authenticate);

app.post("/logout", function(req, res){
  res.set("Access-Control-Allow-Origin", "*");
  req.session.destroy();
  req.logout();
  return res.json({"resCode":"OK","msg":"logging out"})   
});

function authenticate(req,res,next){
   var db = app.get("dbs");
   var collection_name = db.collection("users");
   collection_name.findOne({"username":req.body.username,"password":req.body.password},function(err,record){
          if(record !== null){
             var token = jwt.sign(record,config.secret, {
                  expiresIn : 1500
              });
             req.session.store = record;
              res.json({
                  "resCode":"OK",
                  "msg": 'Validation successful!',
                  "token": token,
                  "role_id":record.role_id,
                  "emp_name":record.emp_name
              });
          }
           else{
            return res.send({"resCode":"ERROR","msg":"user not authenticated!"});
           } 
   });         
};

app.use('/path',pathroute);
//app.all('/*',validate)

app.post("/createemployee",function(req,res,next){
  var db = app.get("dbs");
  var record = req.session.store
  console.log(req.body.format1,"999",req.body.format2)
  if(req.body.format1 && req.body.format2){
    if(req.body.format1){
        var collection_name = db.collection("regular_data_emp");
        var insertobj = req.body.format1;
        insertobj.dob = new Date(insertobj.dob);
        insertobj.joining_date = new Date(insertobj.joining_date);
        collection_name.findOne({"emp_no":insertobj.emp_no},function(err,user){
               if(user === null){
                   console.log("employee does not exist");
                   return insertop(req,res,next,collection_name,insertobj)
               }else 
               {
                 console.log("employee already exists");
                 return updateop(req,res,next,collection_name,insertobj)
               }
              });
    }if(req.body.format2 && record.role_id <= 2) {console.log("ok"); confidential(req,res)};  
     return res.send("DONE!");
  }
 else return res.send({"resCode":"OK","msg":"request body not in desired format"})  
});

function confidential(req,res,next){
  var db = app.get("dbs");  
  var collection_name = db.collection("confidential_data_emp");
  var insertobj = req.body.format2;
    collection_name.findOne({"emp_no":insertobj.emp_no},function(err,user){
         if(user === null){
             console.log("employee does not exist");
             return insertop(req,res,next,collection_name,insertobj)
         }else 
         {
           console.log("employee already exists");
           return updateop(req,res,next,collection_name,insertobj)
         }
    });

} ;

function insertop(req,res,next,collection_name,insertobj){
        collection_name.insert(insertobj);
        console.log("inserted");
        return 
};
function updateop(req,res,next,collection_name,insertobj){
       console.log(insertobj)
       collection_name.update({"emp_no":insertobj.emp_no},insertobj)
       console.log("updated");
       return 
};

app.post("/employeeList",function(req,res,next){
    function getData(){
       var pass = function(data){
         var q= Q.defer(record);
         for(var i=0;i<data.length;i++){
          for(var j=0;j<config.distinct_supervisors.length;j++){
            if(data[i].emp_sup_id === config.distinct_supervisors[j].emp_no){
              data[i].emp_supervisor = config.distinct_supervisors[j].emp_lastname;  
            }
          }
         }
         q.resolve(data);
         return q.promise;
       }
       var fails = function(err){
        var q= Q.defer();
        q.reject(err);
        return res.send({"resCode":"ERROR","msg":err.msg})
       }  
    var db=app.get("dbs"); var filter= {}; var record = req.session.store;
    var collection_name = db.collection("regular_data_emp");
    var qAggregate = Q.nbind(collection_name.aggregate,collection_name);
    if(record.role_id === 2){
      filter["emp_sup_id"] = record.emp_no;
    }
    if(record.role_id === 4){
      filter ["emp_no"] = record.emp_no;
    }
    if(record.role_id === 3){
      filter ["emp_sup_id"] = record.sup_id;
    }
    var query = [
                 {"$match":filter}
                ];
      return qAggregate(query)
      .then(pass)
      .fail(fails)          
  }

  function success(results){
      if(results.length>0) {
        var distinct={};
        if(req.body.key === "one"){
          for(var i=0;i<results.length;i++){
            if(results[i]["emp_no"] === req.body.emp_no){
                distinct = results[i];
            }
          }
          return res.send({"resCode":"OK","results":distinct}) 
        }
        return res.send({"resCode":"OK","results":results})
      }else return res.send({"resCode":"OK","msg":"DATA NOT AVAILABLE"})
  }

  function fail(err){
    var q= Q.defer();
    q.reject(err);
    return res.send({"resCode":"ERROR","msg":err.msg})
  }

  getData()
    .then(success)
    .fail(fail)
})


var TOTP = function() {
 
    var dec2hex = function(s) {
        return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
    };
 
    var hex2dec = function(s) {
        return parseInt(s, 16);
    };
 
    var leftpad = function(s, l, p) {
        if(l + 1 >= s.length) {
            s = Array(l + 1 - s.length).join(p) + s;
        }
        return s;
    };
 
    var base32tohex = function(base32) {
        var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        var bits = "";
        var hex = "";
        for(var i = 0; i < base32.length; i++) {
            var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += leftpad(val.toString(2), 5, '0');
        }
        for(var i = 0; i + 4 <= bits.length; i+=4) {
            var chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16) ;
        }
        return hex;
    };
 
    this.getOTP = function(secret) {
        try {
            var epoch = Math.round((new Date().getTime() / 1000.0));
            var time = leftpad(dec2hex(Math.floor(epoch / 500)), 16, "0");
            console.log('time',time)
            var hmacObj = new jsSHA(time, "HEX");
            console.log("hmacObj",hmacObj)
            var hmac = hmacObj.getHMAC(base32tohex(secret), "HEX", "SHA-1", "HEX");
            var offset = hex2dec(hmac.substring(hmac.length - 1));
            var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";
            otp = (otp).substr(otp.length - 6, 6);
        } catch (error) {
            throw error;
        }
        console.log(otp,"otpppp")
        return otp;
    };
 
}

function requestotp(){
   var totpObj = new TOTP();
   var otp = totpObj.getOTP("MOBISECRET");
   console.log("otp",otp)
   return otp;
} 

app.post('/forgot_password', bodyParser.urlencoded({ extended: false }), function (req, res) {
    MongoClient.connect('mongodb://rajesh:Pr%40deep_D0n@139.59.27.140:27017/empower', function(err, db){
          var email = req.body.email;
          var userscoll = db.collection("users");
          var otp = requestotp();
          var email = "";
          if(req.body.email){
            email = req.body.email;
          }else if(req.session.store){
            var record = req.session.store;
            email = record.username;
          }else return res.send({"resCode":"OK","msg":"email not available"})
          userscoll.findOne({'username':email},function(err,data){
            if(data !== null){
                      sendmail({
                          from:'donotreply@mobigesture.com',
                          to: req.body.email,
                          subject: 'opt',
                          html: 'your otp is' + " " + otp
                        }, function(err, reply) {
                          console.log(err && err.stack);
                          console.dir(reply);
                      });
                  db.close();           
                return res.send({"resCode":"OK","msg":"email verified and otp sent"});
            }else return res.send({"resCode":"OK","msg":"user not found create new user"})
          });
    });     
});
       
app.post('/reset_password', bodyParser.urlencoded({ extended: false }), function (req, res , next) {
      MongoClient.connect('mongodb://rajesh:Pr%40deep_D0n@139.59.27.140:27017/empower', function(err, db){
          var password = req.body.password;
          var otp = requestotp();
          var confirm = req.body.confirm;
          var otpwd = req.body.otp;
          console.log(req.session.store)
          if(req.session.store === undefined){
             if(otp !== otpwd)return res.end('otp does not match')
          }
          if (password !== confirm) return res.end('passwords do not match');
          //update the user db here
         // if(req.body.email === undefined) return res.end('invalid email');
           if(req.body.email){
              email = req.body.email;
            }else if(req.session.store){
              var record = req.session.store;
              email = record.username;
            }else return res.send({"resCode":"OK","msg":"email not available"})
            var userscoll = db.collection("users");
            var password = btoa(req.body.password);
            userscoll.update({'username':email},{"$set":{'password':password}});
            db.close();  
          res.end('password reset');
    });      
});

app.get('/getProfile',function(req,res,next){
   var db = req.app.get("dbs");
   var record = req.session.store;
   var supDetail = [];
      supDetail = config.distinct_supervisors;
   var coll = db.collection("regular_data_emp");
   coll.findOne({"emp_no":record.emp_no},{"_id":0,"emp_sup_id":1,"emp_lastname":1,"emp_email_id":1,"emp_no":1,"joining_date":1,"emp_firstname":1},function(err,data){
      if(data !== null){
        for(var i=0;i<supDetail.length;i++){
          if(supDetail[i].emp_no === data.emp_sup_id){
            data.supervisor = supDetail[i].emp_lastname;
          }
        }
        return res.json({"resCode":"OK","data":data})
      }else return res.json("employee not found");
   });
});


module.exports = app;
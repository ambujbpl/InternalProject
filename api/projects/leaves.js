var _                = require("underscore");
var moment           = require("moment");
var Q                = require("q");
var _                = require("lodash");
var md5              = require('MD5');
var async  = require("async");
var nodemailer  = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var jwt = require('jsonwebtoken');
var validate = require('../validator');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var business = require('moment-business');

var getEmailLists = function(req,res,next){
   function querycollection(){
       var db = req.app.get("dbs"); var filter ={}; var q = Q.defer(); 
       var record = req.session.store;
       var collection_name = db.collection("regular_data_emp");
       var qAggregate = Q.nbind(collection_name.aggregate,collection_name);
       if(req.body.key === "sup"){
         if(record.role_id !== 1){
          filter["emp_no"] = record.sup_id;
         }else{
            q.resolve("User Already An Executive");
            return q.promise;
         } 
       }  
       var query = [    
                        {
                         "$match":filter
                        },                   
                        {"$project":
                             {"_id":0,"emp_email_id":1,"insensitive": { "$toLower": "$emp_email_id" },"emp_lastname":1,"emp_no":1}
                        },
                        {
                         "$sort":{"insensitive":1}  
                        },
                        {
                         "$project":{"emp_email_id":1,"emp_lastname":1,"emp_no":1}
                        }
                  ]
       return qAggregate(query);           
    }
  
  function success(emailslist){
    if(emailslist.length >0){
          return res.send({"resCode":"OK","results":emailslist})
        }else return res.send({"resCode":"OK","results":[],"msg":"DATA NOT AVAILABLE","results":[]})
  };

 function fail(err) {
    var q= Q.defer();
    q.reject(err);
    return res.send({"resCode":"ERROR","msg":err.msg})
    };

    querycollection()
    .then(success)
    .fail(fail)
};

var sendemail = function(req, res, next) {
    console.log("sendemail")
    var record = req.session.store;
    saveLeaves(req,res,next);
    var cc_array= [];
            if(req.body.cc_array){
              cc_array = req.body.cc_array[0];
            }
            cc_array = JSON.parse(req.body.cc_array);
            var transport = nodemailer.createTransport(smtpTransport({
                host: "mail.mobigesture.com",
                debug:true,
                secure: true,
                auth: {
                    user: 'leaves@mobigesture.com',
                    pass: 'mobigo#123'
                }
            }));
            var mailOptions = {
                from: "leaves@mobigesture.com",
                to: [
                     //"rinky.dewangan@mobigesture.com",
                      req.body.email
                    ],
                subject:'Leave Application from' + " " + record.username.split(".")[0],
                cc : cc_array,
                html: '<html><head><title>APPLICATION</title></head><body><p><b>Hi Sir/Madam,</b></p><p>This is ' + record.username.split(".")[0] + ', requesting <b>'+ req.body.leave_type+'</b> from <b>'+ req.body.from+'</b> to '+req.body.to+'</p><p>Kindly,accept my leave request.<br />'+'</b><br/></p><p><b>Email-ID: </b>' + record.username + '</p><p>Thanks & Regards,<br />' + record.username.split(".")[0] +'<p><a href="http://localhost:8080">Redirect To Login</a></p>'+'</p></body></html>' // html body // html body
            };

            transport.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log("error",error)
                    return res.send({
                        "resCode": "ERROR",
                        "msg": error.message
                    })
                }
                return res.send({
                    "resCode": "OK",
                    "msg": "Your leave request has been sent successfully"
                })
            });
};

/*function saveLeaves(req,res,next){
   //validate(req,res,next);
   var db = req.app.get("dbs");
   var record = req.session.store; 
   var collection_name = db.collection("leavesStatus");
   var holiday_coll = db.collection("holyday_emp");
   var datearray=[];
   var insertobj= {
              "emp_no":"",
              "emp_name":"",
              "leaves_applied_from":"",
              "leaves_applied_upto":"",
              "sup_id": "",
              "status":"",
              "no_of_days":""
    }
    holiday_coll.aggregate([{"$project":
                                 {"_id":0,
                                  "date":{ $dateToString: { format: "%Y-%m-%d", date: "$Holy_date" }}
                              }}]).toArray(function(err,dates){
        for(var i=0;i<dates.length;i++){
          datearray.push(dates[i].date)
        }
     });
    console.log("datearray",datearray);                          
    var a = moment(req.body.from, 'YYYY-MM-DD');
    var c = moment(req.body.to, 'YYYY-MM-DD').add(1,'days');
    var k = business.weekDays(a,c);
    var count = 0;
    for(var j=0;j<datearray.length;j++){
          datearray[j] = moment(datearray[j], 'YYYY-MM-DD');
          if(datearray[j].isBetween(a, c, 'days', '[}')){
              count ++;
          }
    }
   insertobj["no_of_days"] = k - count; 
   insertobj["emp_name"]= record.emp_name;
   insertobj["emp_no"]= record.emp_no;
   insertobj["leaves_applied_from"]= req.body.from;
   insertobj["leaves_applied_upto"]= req.body.to;
   //insertobj["emp_lastname"]= record.emp_lastname;
   insertobj["sup_id"]= record.sup_id;
   insertobj["status"]= "p";
   insertobj["requested_on"]= moment().format("YYYY-MM-DD");
   console.log("abc",insertobj);
  if(req.body){
    collection_name.insert(insertobj);
  }
  return
 
};*/

function saveLeaves(req,res,next){
   var db = req.app.get("dbs");
   var record = req.session.store; 
   var collection_name = db.collection("leaves__Status");
   var holiday_coll = db.collection("holyday_emp");
   var datearray=[];
   var insertobj= {
              "emp_no":"",
              "emp_name":"",
              "leaves_applied_from":"",
              "leaves_applied_upto":"",
              "sup_id": "",
              "status":"",
              "no_of_days":""
    }
    holiday_coll.aggregate([{"$project":
                                 {"_id":0,
                                  "date":{ $dateToString: { format: "%Y-%m-%d", date: "$Holy_date" }}
                              }}]).toArray(function(err,dates){
        for(var i=0;i<dates.length;i++){
          datearray.push(dates[i].date)
        }
     });
    var a = moment(req.body.from, 'YYYY-MM-DD');
    var c = moment(req.body.to, 'YYYY-MM-DD').add(1,'days');
    var k = business.weekDays(a,c);
    var count = 0;
    for(var j=0;j<datearray.length;j++){
          datearray[j] = moment(datearray[j], 'YYYY-MM-DD');
          if(datearray[j].isBetween(a, c, 'days', '[}')){
              count ++;
          }
    }
   insertobj["no_of_days"] = k - count; 
   insertobj["emp_name"]= record.emp_name;
   insertobj["emp_no"]= record.emp_no;
   insertobj["leaves_applied_from"]= req.body.from;
   insertobj["leaves_applied_upto"]= req.body.to;
   insertobj["sup_id"]= record.sup_id;
   insertobj["status"]= "p";
   insertobj["requested_on"]= moment().format("YYYY-MM-DD");
    var coll_name = db.collection("counters");
    coll_name.update(
              {"_id":"leave_id" },
              { "$inc": { "seq": 1 }}).then(function(err,r1) {
                coll_name.findOne({},function(err,result){
                insertobj["leave_id"] = result.seq;
                collection_name.insert(insertobj)
            });                 
        });
  return
 
};

var leaveStatus = function(req,res,next){
    var record = req.session.store;
    function leavesInfo(datearray){
    
    var q = Q.defer(); var filter = {}; 
    var db = req.app.get("dbs"); 
    var collection_name = db.collection("leaves__Status"); 
    if(record.role_id === 2)filter["sup_id"] = record.emp_no;
    if(record.role_id === 4){
      filter ["emp_no"] = record.emp_no;
    }
    if(record.role_id === 3){
      filter ["sup_id"] = record.sup_id;
    }
    var detailobj = {
    "emp_no" : "$emp_no", 
    "emp_name" : "$emp_name", 
    "leaves_applied_from" : "$leaves_applied_from", 
    "leaves_applied_upto" : "$leaves_applied_upto", 
    "sup_id" : "$sup_id", 
    "status" : "$status", 
    "no_of_days" : "$no_of_days", 
    "requested_on" : "$requested_on", 
    "leave_id" :"$leave_id"
    }
    collection_name.aggregate([{"$match":filter},{"$sort":{"leave_id":1}},{"$group":{"_id":"$emp_no","details":{"$push":detailobj}}}]).toArray(function(err,results){
          var emp_array =[];var result_array =[];
          for(var i=0;i<results.length;i++){
            for(var k=0;k<results[i].details.length;k++){
             emp_array.push(results[i].details[k].emp_no);
            }
            if(results[i].details[0]){
                  results[i].details[0].leave_balance = (results[i].details[0].status === "p" || results[i].details[0].status === "r")?18:18-(results[i].details[0].no_of_days)
            }      
            for(var j=1;j<results[i].details.length;j++){
                if(results[i].details[j].status ==="p" || results[i].details[j].status ==="r"){
                  results[i].details[j].leave_balance = results[i].details[j-1].leave_balance;
              } else results[i].details[j]["leave_balance"] = results[i].details[j-1]["leave_balance"]-results[i].details[j]["no_of_days"] ;
            }
            for(var s=0;s<results[i].details.length;s++){
              result_array.push(results[i].details[s])
            }
          }
          emp_array = _.uniq(emp_array,"emp_no");
          var result =[];
          result.push({"results":result_array,"emp_array":emp_array})
          q.resolve(result);
    });
   return q.promise;
  };
 
  function success(success_result){
    if(success_result.length > 0 ){
      if(req.body.key === "pending"){
         var result = success_result[0].results
         var count = 0;
           for(var i=0;i<result.length;i++){
              if(result[i].status === "p") count++
           }
        return res.send({"resCode":"OK","pendings":count}) 
      }
      if(record.role_id === 1){
        return res.json({"results":success_result[0].results,"user_data":success_result[0].user_data,"msg":"user is an executive"})
      }
      return res.json({"results":success_result[0].results,"user_data":success_result[0].user_data})
    }else return res.json("NO RECORD FOUND")
  };

  function userbal(leavebalresult){
      var q = Q.defer(); 
      var db = req.app.get("dbs"); 
      var collection_name = db.collection("leave_banks");
      collection_name.findOne({"emp_id":record.emp_no},{"_id":0},function(err,data1){
          var success_result = [];
          success_result.push({"results":leavebalresult[0].results,"user_data":data1})
          q.resolve(success_result); 
      });
      return q.promise;
  }; 

  function fail(err) {
    var q= Q.defer();
    q.reject(err);
    return res.send({"resCode":"ERROR","msg":err.msg})
    };
     leavesInfo()
     .then(userbal)
     .then(success)
     .fail(fail)
};

var changeleaveStatus = function(req,res,next){
    var record = req.session.store;
    var db = req.app.get("dbs"); 
    var collection_name = db.collection("leaves__Status");
    var leave_coll = db.collection("leave_banks");
    if(req.body.status){
        collection_name.update({"leaves_applied_from" :req.body.leaves_from , "leaves_applied_upto" :req.body.leaves_to,"requested_on":req.body.requested_on,"emp_no":req.body.emp_no},{"$set":{"status":req.body.status}});
        collection_name.findOne({"leaves_applied_from" :req.body.leaves_from,"leaves_applied_upto" :req.body.leaves_to,"emp_no":req.body.emp_no},function(err,data){
          if(data !== null){
            if(req.body.status === "a"){
              leave_coll.update({"emp_id":req.body.emp_no},{"$inc":{"leaves_balance":-data.no_of_days}})
            }else return;
           }
          else return res.json("employee not found, create employee first")
        });
      return
    }else return res.json("status required in request object");
 };

var receiveEmail = function(req,res,next){
    req.body.emp_no = parseInt(req.body.emp_no);
    changeleaveStatus(req,res,next);
    var status = "";
    if(req.body.status === "a")status = "approving"; else status = "rejecting";
    var record = req.session.store;
    var db = req.app.get("dbs"); 
    var collection_name = db.collection("regular_data_emp");
    collection_name.findOne({"emp_no":req.body.emp_no},{"_id":0,"emp_email_id":1},function(err,email){
    var email = email.emp_email_id;
    var cc_array= [];
            if(req.body.cc_array){
              cc_array = req.body.cc_array;
            }
            var transport = nodemailer.createTransport(smtpTransport({
                host: "mail.mobigesture.com",
                debug:true,
                secure: true,
                auth: {
                    user: 'leaves@mobigesture.com',
                    pass: 'mobigo#123'
                }
            }));
            var mailOptions = {
                from: "leaves@mobigesture.com",
                to: [
                      email,
                      "rinky.dewangan@mobigesture.com"
                    ],
                subject:'Reply of leave request',
                cc : cc_array,
                html:   '<html><head><title>REPLY</title></head><body><p><b>Hi Sir/Madam,</b></p><p><b>This is ' + record.username.split(".")[0] + " " + status +'</b><b> your leave application requested on '+ req.body.requested_on + " " + "for" + " " + req.body.duration + " "+"days."+'</b>'+'</b><br/> </p><p>Thanks & Regards,<br />' + record.username.split(".")[0] +'<p><a href="http://localhost:8080">Redirect To Login</a></p>'+'</p></body></html>' 
           };

            transport.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log("error",error)
                    return res.send({
                        "resCode": "ERROR",
                        "msg": error.message
                    })
                }
                return res.send({
                    "resCode": "OK",
                    "msg": "Your reply has been sent successfully"
                })
            });
        });    
};
 
module.exports ={
  getEmailLists     : getEmailLists,
  sendemail         : sendemail,
  leaveStatus       : leaveStatus,
  changeleaveStatus : changeleaveStatus,
  receiveEmail      : receiveEmail
}
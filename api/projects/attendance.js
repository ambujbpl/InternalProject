var _                = require("underscore")
var moment           = require("moment")
var Q                = require("q")
var _                = require("lodash")
var md5              = require('MD5')
var async  = require("async")
var jwt = require('jsonwebtoken')
var validate = require('../validator')
var fs = require('fs');
var path = require('path');
var csvjson = require('csvjson')
var queryAtobj = require('./queryAt.js')
var MongoClient = require('mongodb').MongoClient,
    GridStore = require('mongodb').GridStore,
    ObjectID = require('mongodb').ObjectID,
    test = require('assert');
var fs = require("fs");
var mongodb = require("mongodb")

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
var business = require('moment-business')

var convertDateToUTC = function (startAt,endAt){
	startAt = new Date(startAt);endAt = new Date(endAt)
    var date = {};
    startAt = new Date(startAt.getUTCFullYear(), startAt.getUTCMonth(), startAt.getUTCDate(),  startAt.getUTCHours(), startAt.getUTCMinutes(), startAt.getUTCSeconds());
    endAt = new Date(endAt.getUTCFullYear(), endAt.getUTCMonth(), endAt.getUTCDate(),  endAt.getUTCHours(), endAt.getUTCMinutes(), endAt.getUTCSeconds());
    startAt.setUTCHours(0,0,0,0);
    endAt.setUTCHours(23,59,59,999);
    date.startAt = startAt;
    date.endAt = endAt;
    return date;
}

var convertMinsToHrsMins =  function (minutes,count) {
    var h = Math.floor(minutes / (60 * count));
    var m = minutes % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return h + ':' + m;
}

var selectDateRange = function(range){
   var endDate = moment().format("YYYY-MM-DD")
   var startDate = ""
   var days = 0
   var dates = {}	
 switch(range){
    
    case "MTD": startDate = moment().startOf('month').format("YYYY-MM-DD")
                endDate  = endDate
                break;

    case "LM":  startDate = moment().subtract(1,'months').startOf('month').format("YYYY-MM-DD")
                endDate  = moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD')
                break;

    case "3M": startDate = moment().subtract(2,'months').startOf('month').format('YYYY-MM-DD')
               endDate = endDate
               break;

    case "Y" : startDate = moment().subtract(1,'days').startOf('day').format("YYYY-MM-DD")
               endDate = moment().subtract(1,'days').endOf('day').format("YYYY-MM-DD")
               break;

    case "WTD": var begin = moment().isoWeekday(1);
                startDate = moment(begin.startOf('week')).format('YYYY-MM-DD')
                endDate = endDate
                break;

    case "1M" : startDate = moment().subtract(30,'days').format("YYYY-MM-DD")
                endDate = endDate
                break;

    default  :  startDate = moment().startOf('month').format("YYYY-MM-DD")
                endDate  = endDate           

 }
  dates.startAt = startDate
  dates.endAt = endDate
  return dates
}
var csvExtract = function(req,res,next){
	var data = fs.readFileSync(path.join(__dirname,'../sample.csv'), { encoding : 'utf8'})
	var options = {
	  delimiter : ',', // optional 
	  quote     : '"' // optional 
	};

	var j = csvjson.toObject(data, options)
    return res.send("OK")

};

var avgAttendance = function(req,res,next){
  var record = req.session.store
  var db = req.app.get("dbs")
  var collection_name = db.collection('login_timings')
  var qAggregate = Q.nbind(collection_name.aggregate,collection_name);
  var startdate = new Date(moment().startOf('month').format('YYYY-MM-DD'));
  var enddate = new Date(moment().format('YYYY-MM-DD'));
      function queryOut(){
          var match_filter = {
             "login_time":{
              "$gte":startdate,
              "$lt" :enddate
             },
             "status":"p"
          }
      var key = req.body.key
      var matchobj = {}

      if(record.role_id !== 1){
        var no = record.emp_no
        matchobj = {"emp_id":no}
      } 

      var query = queryAtobj.timings_details_avg(match_filter,matchobj)
          return qAggregate(query)
    } 
    
    function success(results){
      var avg_login=0 , avg_logout=0, avg_duration=0; 
      if(results.length >0){
             for(var i=0;i<results[0].data.length;i++){
                avg_login  += results[0].data[i].avglogin
                avg_logout += results[0].data[i].avglogout
                avg_duration += results[0].data[i].duration
             }
            avg_login = parseInt(avg_login/results[0].total_count)
            avg_logout = parseInt(avg_logout/results[0].total_count)
            avg_duration = parseInt(avg_duration/results[0].total_count)
            var obj = {"avg_login":avg_login,"avg_logout":avg_logout,"avg_duration":avg_duration}
            return res.send({"resCode":"OK","results":obj})
          }else return res.send({"resCode":"OK","results":[],"msg":"DATA NOT AVAILABLE"})
      };

    function fail(err) {
      var q= Q.defer();
      q.reject(err);
      return res.send({"resCode":"ERROR","msg":err.msg})
      };

    queryOut()
    .then(success)
    .fail(fail) 

}

var empAttendanceStats = function(req,res,next){
  var record = req.session.store
  var db = req.app.get("dbs")
  var collection_name = db.collection('login_timings')
  if(req.body.startat && req.body.endat){
    cdate = convertDateToUTC(req.body.startat,req.body.endat)
  }else return res.send({'resCode':"OK","msg":"dates not found"})
    var emp_no = 0
    if(record.role_id === 3 || record.role_id === 4) emp_no = record.emp_no
    else  emp_no = req.body.emp_no 
    function extractRecord(){ 
        var qAggregate = Q.nbind(collection_name.aggregate,collection_name);   
        var match_filter = {
                 "login_time":{
                  "$gte":cdate.startAt,
                  "$lt" :cdate.endAt
                 },
              "emp_id": emp_no,
              "status":"p"   
        }
        var query = [
              {"$match":match_filter},
              {"$project":
                  {"_id":0,
                   "date":{ $dateToString: { format:"%Y-%m-%d", date: "$login_time" }},
                   "login_time":{ $dateToString: { format: "%H:%M", date: "$login_time" }},
                   "logout_time":{ $dateToString: { format: "%H:%M", date: "$logout_time" }},
                   "duration":{ $dateToString: { format: "%H:%M", date: "$duration" }}
                  }
              }
        ]
        return qAggregate(query)
     }

    function success(results){
      if(results.length >0){
           var response = [];
           if(req.body.val === "num"){
             _.forEach(results,function(key,value){
                  var obj ={}
                _.forEach(key,function(key1,value1){
                   if(value1 !== "date"){
                   key1 = key1.replace(":", ".");
                   key1 = parseFloat(key1)
                   }
                    obj[value1] = key1
                   return obj
                 });
                response.push(obj)
                return response
             });
             return res.send({"resCode":"OK","results":response}) 
           }
           return res.send({"resCode":"OK","results":results})
          }else return res.send({"resCode":"OK","results":[],"msg":"DATA NOT AVAILABLE"})
      };

    function fail(err) {
      var q= Q.defer();
      q.reject(err);
      return res.send({"resCode":"ERROR","msg":err.msg})
      };

 extractRecord()
.then(success)
.fail(fail)

}

var empTimings = function(req,res,next){
  var record = req.session.store
	var db = req.app.get("dbs")
	var collection_name = db.collection('login_timings')
	var qAggregate = Q.nbind(collection_name.aggregate,collection_name);
  if(req.body.startat && req.body.endat){
    cdate = convertDateToUTC(req.body.startat,req.body.endat)
    var days = moment(req.body.endat).diff(moment(req.body.startat), 'days')+1 
  }else return res.send({'resCode':"OK","msg":"dates not found"})
	    function queryOut(){
          var match_filter = {
          	 "login_time":{
          	 	"$gte":cdate.startAt,
          	 	"$lt" :cdate.endAt
          	 },
             "status":"p"
          }
      var key = req.body.key
      var matchobj = {}
      if(record.role_id === 2){
        var no = record.emp_no
        matchobj = {"emp_sup_id":no}
      }
      if(record.role_id === 3 ||record.role_id === 4){
        var no = record.emp_no
        matchobj = {"emp_id":no}
      } 

		  var query = queryAtobj.timings_details(match_filter,key,matchobj)
          return qAggregate(query)
		} 
		
		function success(results){
	    if(results.length >0){            
	          return res.send({"resCode":"OK","results":results})
	        }else return res.send({"resCode":"OK","results":[],"msg":"DATA NOT AVAILABLE"})
	    };

		function fail(err) {
	    var q= Q.defer();
	    q.reject(err);
	    return res.send({"resCode":"ERROR","msg":err.msg})
	    };

    queryOut()
    .then(success)
    .fail(fail) 

}

var empAttendance = function(req,res,next){
   var record = req.session.store
   var q= Q.defer()
   var db = req.app.get("dbs")
   var collection_name = db.collection("leaves__Status")
   var holiday_coll = db.collection("holyday_emp")
   var timecol = db.collection('login_timings')
   var startdate = new Date(moment().startOf('month').format('YYYY-MM-DD'));
               a = moment(startdate,'YYYY-MM-DD')
   var enddate = new Date(moment().format('YYYY-MM-DD'));
             c = moment(enddate,'YYYY-MM-DD')

   function getleaves(){
    var datearray = []
    holiday_coll.aggregate([{"$project":
                                 {"_id":0,
                                  "date":{ $dateToString: { format: "%Y-%m-%d", date: "$Holy_date" }}
                              }}]).toArray(function(err,dates){
        for(var i=0;i<dates.length;i++){
          datearray.push(dates[i].date)
        }
            var k = business.weekDays(a,c);
            var count = 0;
              for(var j=0;j<datearray.length;j++){
                    datearray[j] = moment(datearray[j], 'YYYY-MM-DD');
                    if(datearray[j].isBetween(a, c, 'days', '[}')){
                        count ++;
                    }
              }
              count = k-count
              if(count === 0){
                q.resolve()
              }
              var emp_count = count;
              collection_name.find({"emp_no":record.emp_no}).toArray(function(err,leaves){
              _.forEach(leaves,function(key,value){
               if(moment(key["leaves_applied_from"]).format("YYYY-MM") === moment().format("YYYY-MM") && key["status"]=== "a"){
                  if(moment(key["leaves_applied_upto"]).format("YYYY-MM") === moment().format("YYYY-MM")){
                        if(moment().diff(moment(key["leaves_applied_from"]),'days') < 0){
                            emp_count = emp_count
                        }
                        else{
                          if(moment().diff(moment(key["leaves_applied_upto"]),'days') > 0 ){
                              emp_count = emp_count - key["no_of_days"]
                          }
                          else emp_count = emp_count - moment().diff(moment(key["leaves_applied_from"]),'days')+1
                        }   
                  }else emp_count = emp_count - moment().diff(moment(key["leaves_applied_from"]),'days')+1
                }
               })

              var result = {"count":count,"emp_count":emp_count}
              var leaves = count - emp_count
              timecol.aggregate([{"$match":{"login_time":{"$gte":startdate,"$lt":enddate},
                "emp_id":record.emp_no
              }},{"$project":{"_id":0,"duration":{ $dateToString: { format: "%H:%M", date:"$duration" }}}}]).toArray(function(err,data){
                  if(data.length>0)
                   {
                        var sum = 0;
                      _.forEach(data,function(key,value){
                         var duration = key["duration"]
                             duration = parseInt(duration.split(':')[0]* 60) + parseInt(duration.split(':')[1])
                               key["duration"] = duration
                         })
                       for(var i=0;i<data.length;i++){
                             sum += data[i].duration
                       }
                       var percent = (sum/(result.count * 9 * 60))*100
                           percent = parseFloat(percent.toFixed(2))

                       var results = {"percent":percent,"working_days":count,"leaves":leaves}    
                           q.resolve(results)    
                   }else q.resolve()   
                });
            });
          })
         return q.promise                     
    };

   function success(results){
      if(results){
            return res.send({"resCode":"OK","percent":results.percent,"working_days":results.working_days,"leaves":results.leaves})
      }else return res.send({"resCode":"OK","results":[],"msg":"DATA NOT AVAILABLE"})
    };
    
   function fail(err) {
      q.reject(err);
      return res.send({"resCode":"ERROR","msg":err.msg})
      };

  getleaves()
  .then(success)
  .fail(fail)
   
}

var editTime = function(req,res,next){
   var record = req.session.store
   var db = req.app.get("dbs")
   var timecoll = db.collection('login_timings')
   cdate = convertDateToUTC(req.body.date,req.body.date)
   
   var login = parseInt(req.body.login_time.split(':')[0]* 60) + parseInt(req.body.login_time.split(':')[1])
   var logout = parseInt(req.body.logout_time.split(':')[0]* 60) + parseInt(req.body.logout_time.split(':')[1])
   var duration = logout - login;
       duration = convertMinsToHrsMins(duration,1)
       req.body.duration = duration

   var keyList = Object.keys(req.body)
       for(var i=0;i<keyList.length;i++){
          if(keyList[i] !== "date" && keyList[i] !== "emp_id"){
            var newkey = req.body.date +"T"+ req.body[keyList[i]] + ":00Z"
            newkey = new Date(newkey)
            req.body[keyList[i]] = newkey
          }
       }
   req.body.date = new Date(req.body.date)
   updateObj = req.body
   var start = new Date(moment(req.body.date).format('YYYY-MM-DD'))
     timecoll.update({"emp_id":req.body.emp_id,"date":cdate.startAt},updateObj,function(err,result){
          if(!err)
            return res.send({"resCode":"OK","msg":"updated successfuly"})
          else return res.send({"resCode":"ERR","msg":"ERROR updating the record"})
     });
}

var uploadFile = function(req,res,next){
    var db = req.app.get("dbs");
    var bucket = new mongodb.GridFSBucket(db);
    var q = Q.defer();
    function read(){
      var file = [];
      fs.readdir('./images1', function(err, items) {
              for (var i=0; i<items.length; i++) {
                file.push(items[i])
              }
              q.resolve(file)
      });
      return q.promise
   };

   function success(file){
        if(file.length >0){
          for(var i=0;i<file.length;i++){            
            fs.createReadStream('./images1/'+file[i]).
            pipe(bucket.openUploadStream(file[i])).
            
            on('error', function(error) {
              assert.ifError(error);
            }).
            on('finish', function() {
              console.log('done!');
            });
          }
          return res.send({"resCode":"OK","results":"OK"})
        }else return res.send({"resCode":"OK","results":[],"msg":"DATA NOT AVAILABLE","results":[]})
     };

     function fail(err) {
        var q= Q.defer();
        q.reject(err);
        return res.send({"resCode":"ERROR","msg":err.msg})
    };
 read().then(success).fail(fail)
};
 
var downloads = function(req,res,next){
  var db = req.app.get("dbs");
  var record = req.session.store
  var userobj= "";
      var bucket = new mongodb.GridFSBucket(db);
      var filedb = db.collection('fs.files');
      var Path = '/..';
      var options = {
        root: __dirname + Path,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
      };
      userobj = record.emp_no + ".jpg"
      if(record.emp_no === 1018)userobj = record.emp_no + ".png"
      filedb.findOne({"filename":userobj},function(err,file){
        if(file !== null){
            req.file = file;
           bucket.openDownloadStreamByName(userobj).
              pipe(fs.createWriteStream("./" + userobj,{filename: file.filename}
           )).
            on('error', function(error) {
              assert.ifError(error);
            }).
            on('finish', function() {
               if(req.session.store){
                  var file = req.file.filename;
                  fs.readFile(file, function(err, original_data){
                      var base64Image = original_data.toString('base64');
                      var decodedImage = new Buffer(base64Image, 'base64');
                      res.send({"resCode":"OK","result_64":base64Image,"result_decoded":decodedImage})
                  });
                } 
                  else {
                            res.status(401).send('Authorization required!');
                        }
              console.log('done!');
            });
          }else return res.send({"resCode":"OK","msg":"Pic Not Available For The User"})
      });
  };


module.exports = {
     csv                    :csvExtract,
     attendance             :empTimings,
     empAttendance          :empAttendance,
     empAttendanceStats     :empAttendanceStats,
     avgAttendance          :avgAttendance,
     uploadFile             :uploadFile,
     downloads              :downloads,
     editTime               :editTime
}
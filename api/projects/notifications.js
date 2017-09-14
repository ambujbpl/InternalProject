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


var upComingb_days = function(req,res,next){
	var db = req.app.get("dbs")
	var q = Q.defer()
    var emp_coll = db.collection("regular_data_emp")
         function queryOut(){
	       var datearray = []	
           emp_coll.aggregate([{"$project":
                                 {"_id":0,"name":"$emp_lastname",
                                  "dob": {$cond: { if: { $ne: [ "$dob", ""] }, then:{ $dateToString: { format: "%m-%d", date: "$dob" } }, else:"N/A" }}
                              }},{"$sort":{"dob":1}}]).toArray(function(err,dates){
		        for(var i=0;i<dates.length;i++){
		        	if(dates[i].dob !== "N/A")
		               datearray.push({"date":dates[i].dob,"name":dates[i].name})
		        }
			    var now = new Date(moment().format("MM-DD"));
				var closest = Infinity;
                var result = []
                var name = ""
				datearray.forEach(function(d) {
				   var date = new Date(moment(d.date).format("MM-DD"));
					   if (date >= now && date < closest) {
					   	   closest = d.date
                           name = d.name
					   }
				});
				closest = new Date(closest)
				closest = moment(closest).format("MMM Do")
				result.push({"date":closest,"name":name})
				q.resolve(result)    
          })
            return q.promise                  
	    }
 
		function success(result){
		    if(result !== null){            
		          return res.send({"resCode":"OK","results":result})
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


};

var upComingholidays = function(req,res,next){
	var db = req.app.get("dbs")
	var q = Q.defer()
    var holiday_coll = db.collection("holyday_emp")
	    function queryOut(){
	       var datearray = []	
           holiday_coll.aggregate([{"$project":
                                 {"_id":0,"name":"$Holy_name",
                                  "date":{ $dateToString: { format: "%Y-%m-%d", date: "$Holy_date" }}
                              }}]).toArray(function(err,dates){
		        for(var i=0;i<dates.length;i++){
		          datearray.push({"date":dates[i].date,"name":dates[i].name})
		        }
			    var now = new Date();
				var closest = Infinity;
                var fest = ""
				datearray.forEach(function(d) {
				   var date = new Date(d.date);
				   if (date >= now && date < closest) {
				      closest = d.date
				      fest = d.name
				   }
				});
				closest = new Date(closest)
				closest = moment(closest).format("MMM Do YY")				
				var result = {"name":fest,"date":closest}
				q.resolve(result)    
          })
            return q.promise                  
	    }

        function success(result){
		    if(result !== null){            
		          return res.send({"resCode":"OK","results":result})
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


};

module.exports = {
	b_days : upComingb_days,
	holidays :upComingholidays
}




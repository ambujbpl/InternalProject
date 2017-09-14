var _                = require("lodash")


module.exports = {
    timings_details_avg : function(match_filter,matchobj){
    var project1 =  {
                      "sup_id":"$out.emp_sup_id",
                      "emp_id":1,"login_hr":{"$hour":"$login_time"},
                      "emp_name":"$out.emp_lastname",
                      "login_min":{"$minute":"$login_time"},
                      "logout_hr":{"$hour":"$logout_time"},
                      "logout_min":{"$minute":"$logout_time"},
                      "duration_hr":{"$hour":"$duration"},
                      "duration_min":{"$minute":"$duration"},
                      "emp_sup_id":"$out.emp_sup_id"
                   }
     var project2 = {"_id":0,"data":1,"total_count":1}
                   
     return [
     {"$match":match_filter},
     {"$lookup":{
       from: "regular_data_emp",
       localField: "emp_id",
       foreignField: "emp_no",
       as: "out"
     }},
     {"$unwind":"$out"},
     {"$project":project1},
     {"$match":matchobj},
     {"$group":
             {"_id":{"emp_id":"$emp_id","emp_name":"$emp_name"},
                "login_hr":{"$sum":"$login_hr"},
                "login_min":{"$sum":"$login_min"},
                "logout_hr":{"$sum":"$logout_hr"},
                "logout_min":{"$sum":"$logout_min"},
                "duration_hr":{"$sum":"$duration_hr"},
                "duration_min":{"$sum":"$duration_min"},
                "count":{"$sum":1}               
              }
     },
     {"$project":
                {
                  "_id":0,"emp_id":"$_id.emp_id","emp_name":"$_id.emp_name","login_hr":"$login_hr",
                  "login_min":"$login_min","logout_hr":"$logout_hr",
                  "logout_min":"$login_min","duration_hr":"$duration_hr",
                  "duration_min":"$duration_min",
                  "avglogin": { $avg: {"$sum":["$login_min",{ "$multiply": [ "$login_hr", 60 ] }] }},
                  "avgduration": { $avg: {"$sum":["$duration_min",{ "$multiply": [ "$duration_hr", 60 ] }] }},
                  "avglogout": { $avg: {"$sum":["$logout_min",{ "$multiply": [ "$logout_hr", 60 ] }] }},
                  "count":"$count"
                }
    },
    {"$group":
        {"_id":null,
         "data":{"$push":
                  {
                    "emp_id":"$emp_id",
                    "duration":"$avgduration",
                    "avglogin":"$avglogin",
                    "avglogout":"$avglogout",    
                  }
                },
                "total_count":{"$sum":"$count"}
       }     
    },
    {"$project":project2}
    ]
    },

    timings_details : function(match_filter,key,matchobj){
    var project1 =  {
                      "sup_id":"$out.emp_sup_id",
                      "project":"$out.emp_project",
                      "emp_id":1,"login_hr":{"$hour":"$login_time"},
                      "emp_name":"$out.emp_lastname",
                      "login_min":{"$minute":"$login_time"},
                      "logout_hr":{"$hour":"$logout_time"},
                      "logout_min":{"$minute":"$logout_time"},
                      "duration_hr":{"$hour":"$duration"},
                      "duration_min":{"$minute":"$duration"},
                      "emp_sup_id":"$out.emp_sup_id"
                   }
     var project2 = {"_id":0,"project":"$_id","data":1}
                   
     if(key === "role"){
       project1["project"] = "$out.emp_designation"
       project2 = _.omit(project2,"project")
       project2["role"] = "$_id"
     }if(key === "emp"){
       project1["project"] = "$out.emp_lastname" 
       project2 = _.omit(project2,"project")
       project2["emp_name"] = "$_id"
     }if(key === "team"){
       project2 = _.omit(project2,"project")
       project2["team"] = "$_id"
     }

    return [
     {"$match":match_filter},
     {"$lookup":{
       from: "regular_data_emp",
       localField: "emp_id",
       foreignField: "emp_no",
       as: "out"
     }},
     {"$unwind":"$out"},
     {"$project":project1},
     {"$match":matchobj},
     {"$group":
             {"_id":{"emp_id":"$emp_id","project":"$project","emp_name":"$emp_name"},
                "login_hr":{"$sum":"$login_hr"},
                "login_min":{"$sum":"$login_min"},
                "logout_hr":{"$sum":"$logout_hr"},
                "logout_min":{"$sum":"$logout_min"},
                "duration_hr":{"$sum":"$duration_hr"},
                "duration_min":{"$sum":"$duration_min"},
                "count":{"$sum":1}               
              }
     },
     {"$project":
                {
                  "_id":0,"emp_id":"$_id.emp_id","emp_name":"$_id.emp_name","project":"$_id.project","login_hr":"$login_hr",
                  "login_min":"$login_min","logout_hr":"$logout_hr",
                  "logout_min":"$login_min","duration_hr":"$duration_hr",
                  "duration_min":"$duration_min",
                  "avglogin": { $avg: {"$sum":["$login_min",{ "$multiply": [ "$login_hr", 60 ] }] }},
                  "avgduration": { $avg: {"$sum":["$duration_min",{ "$multiply": [ "$duration_hr", 60 ] }] }},
                  "avglogout": { $avg: {"$sum":["$logout_min",{ "$multiply": [ "$logout_hr", 60 ] }] }},
                  "count":"$count"
                }
    },
    {"$group":
        {"_id":"$project",
         "data":{"$push":
                  {
                    "emp_id":"$emp_id",
                    "emp_name":"$emp_name",
                    "duration":"$avgduration",
                    "avglogin":"$avglogin",
                    "avglogout":"$avglogout",
                    "count":"$count"
                  }
                }
       }     
    },
    {"$project":project2}
    ]
    }



}
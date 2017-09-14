var infoObjNew = new Object();
var commonObj;
var infoObjName = [];
var infoObjLogin = [];
var infoObjLogout = [];
var infoObjDuration = [];
$(document).ready(function(){
    generateattendanceTable(infoObj);
    var loginObj= storagegetItem("login");
    var adminloginObj= storagegetItem("adminlogin");
    // console.log(loginObj.Role);
   if(loginObj.Role == 1){
$('.checkedRole').removeClass('hide');
}
else if(loginObj.Role == 2){
    $('.checkedRole').removeClass('hide');
}
    //open openMoreDetails in data table
     $(document).on('click', '.openMoreDetails', function(e) {
             e.preventDefault();
             e.stopImmediatePropagation();
             var emp_number = $(this).find("td:first").text();
             var emp_name = $(this).find("td:nth-child(2)").text();
            generateattendanceTableNew1(emp_number,emp_name);
         });
       //open table attendence div
     $(document).on('click', '.opentabledivBtn', function(e) {
             e.preventDefault();
             e.stopImmediatePropagation();
           $('.attendanceTable').removeClass('hide');
           $('.moreDetails').addClass('hide');
            var key = $(this).attr('key');
            var name = $(this).attr('name');
           // console.log("<key>",key,"name",name);
           generateattendanceTableNew(key,name);
         });
     //----- back button functionality -----//
      $(document).on('click', '.backButton', function(e) {
             e.preventDefault();
             e.stopImmediatePropagation();
           $('.attendanceTable').addClass('hide');
           $('.moreDetails').removeClass('hide');
           $('.attendanceTableTitle').html('');
         });
       // make function for checkedRole
 $(document).on('click', '.btnRole' , function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
            $('.bodyloading').addClass('hide');
            $('.content').removeClass('hide');
            if($(this).attr('id') === "employee"){
            infoObj.key = "emp";
            }else{
             infoObj.key = $(this).attr('id');
            }
           $('.btnRole').removeClass('active');
           $(this).addClass('active');
           generateattendanceTable(infoObj);
 });
 // make function for durations buttons
 $(document).on('click', '.raised' , function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
                        $('.bodyloading').addClass('hide');
            $('.content').removeClass('hide');
            $('.raised').removeClass('active');
            var id = $(this).val();
           $(this).addClass('active');
           if (id === "cus"){
                $('.rangePic').removeClass('hide');
                $('input[name="daterange"]').daterangepicker();
            }
            else{
                $('.rangePic').addClass('hide');
            }
            if(id !== "cus" && id !=="lm" && id !== "7d" && id !== "1d"){
                infoObj.startat = moment().subtract(parseInt(id[0])-1, "months").startOf("month").format("YYYY-MM-DD");
            }else if(id === "lm"){
                infoObj.startat = moment().subtract(30, "days").format("YYYY-MM-DD");
            }else if((id === "7d")||(id === "1d")){
                infoObj.startat = moment().subtract(parseInt(id[0]), "days").format("YYYY-MM-DD");
            }
            if(id !== "cus" && id !=="1m" && id !== "1d"){
                infoObj.endat = moment().format("YYYY-MM-DD");
            }else if(id === "2m"){
                infoObj.endat = moment().subtract(1, "months").endOf("month").format("YYYY-MM-DD");
            }else if((id === "1d")){
                infoObj.endat = moment().subtract(1, "days").format("YYYY-MM-DD");
            }
            infoObj.dateclass = id;

            if(id !== "cus"){
                generateattendanceTable(infoObj);
            }


 });
});
$(document).on('click', '.applyBtn', function(e) {
     var start=document.getElementById("daterange").value;
     // console.log("date>>",start);
     start = start.split("-");
     // console.log("start----", start);
     infoObj.startat = moment(start[0]).format("YYYY-MM-DD");
     infoObj.endat = moment(start[1]).format("YYYY-MM-DD");
     if(start !== " "){console.log("notempty");}
     else{console.log("empty");}
     generateattendanceTable(infoObj);
})
function generateattendanceTable (obj){
    // console.log("111 infoObj for generateattendanceTable",obj);
infoObjName = [];
infoObjLogin = [];
infoObjLogout = [];
infoObjDuration = [];
        var body   = "<td></td>";
        $( "#moreDetailsTable #moreDetailsTableTr" ).html(body);
        // console.log("infoObj------>>", infoObj);
          $.when(Posthandler("path/attendance", infoObj, true)).done(function(res){console.log(res);
           var objres = res.results;
           commonObj = objres;
           if(res.msg !== "DATA NOT AVAILABLE"){
            if(res.resCode === "OK"){
              // console.log("203",objres);
              // console.log(objres[0].data.length);
              $.each(objres, function(i, objres){
                 var sum1=0,sum2=0,sum3=0,avg1=0,avg2=0,avg3=0,tit="",tit="",key="",name="",xyz;
                // console.log("<<<",i);
              // console.log(objres.data.length);
              for( var q=0 ; q < objres.data.length; q++){
                        sum1 += objres.data[q]["avglogin"];
                        sum2 += objres.data[q]["avglogout"];
                        sum3 += objres.data[q]["duration"];
                }
                avg1 = sum1/q;avg2 = sum2/q;avg3 = sum3/q;
                // console.log("Q=",q);
                // console.log("avg1=",avg1);
                // console.log("avg2=",avg2);
                // console.log("avg3=",avg3);
                var Avg1 = convertMinsToHrsMins(avg1,objres.data[0]["count"]);
                var Avg2 = convertMinsToHrsMins(avg2,objres.data[0]["count"]);
                var Avg3 = convertMinsToHrsMins(avg3,objres.data[0]["count"]);
                // console.log("final convertMinsToHrsMins",parseFloat(Avg1));
                if(objres.project !== " " && objres.project !== undefined && objres.project !== null) {
                tit = objres.project;
                key = "project";
                xyz = objres.project;
                // alert('project');
                }else if(objres.role !== " " && objres.role !== undefined && objres.role !== null){
                tit = objres.role;
                key = "role";
                xyz = objres.role;
                // alert('role');
                }else if(objres.emp_name !== " " && objres.emp_name !== undefined && objres.emp_name !== null) {
                tit = objres.emp_name;
                key = "employee";
                 for( var q=0 ; q < objres.data.length; q++){
                xyz = objres.data[q].emp_id; 
                }
                
                // alert('emp');
                }
                console.log(key);
                console.log(tit);
                infoObjName.push(tit);
                infoObjLogin.push((Avg1));
                infoObjLogout.push((Avg2));
                infoObjDuration.push((Avg3));
                var body   = "<td><div class='test'><table class='table table-responsive testtable' style=''><tbody style='text-align: center;'><tr style='text-align: center;'><td colspan='3'><img height='40' src='../img/emp/"+ xyz+".jpg' class='opentabledivBtn' key='"+ key +"' name='"+ tit +"' data-toggle='tooltip' data-placement='bottom' title='for more details "+ tit +" click me!'/></td></tr><tr class='innerTabletr' style='text-align: center;height: 23px;'><td colspan='3'><div><span class='tabletital'>"+ tit +"</span></div></tr><tr class='innerTabletr highligtTd' style='text-align: center;'><td class='toptable'><span class='title1'>AVG LI</span></td><td class='toptable'><span class='title2'>AVG LO</span></td><td class='toptable'><span class='title3'>Time</span></td></tr><tr class='innerTabletr highligtTd' style='text-align: center;'><td class='bottomtable'><span class='body1'>"+ Avg1 +"</span></td><td class='bottomtable'><span class='body2'>"+ Avg2 +"</span></td><td class='bottomtable'><span class='body3'>"+ Avg3 +"</span></td></tr></tbody></table></div></td>";
               $( "#moreDetailsTable #moreDetailsTableTr" ).append(body);
               });
infoObjNew = {"name":infoObjName,"login":infoObjLogin,"logout":infoObjLogout,"duration":infoObjDuration};
// console.log("<<<infoObjNew>>>",infoObjNew);
if(loginObj.Role == 3 || loginObj.Role == 4){
    // console.log("1234567890");
infoObjName = [];
infoObjLogin = [];
infoObjLogout = [];
infoObjDuration = [];
// console.log("<<<infoObjLatest for role 3 and 4>>>",infoObjNew);
infoObj.val = "num";
$.when(Posthandler("path/empAttendanceStats", infoObj, true)).done(function(res){console.log(res);
if(res.resCode === "OK"){
       var newObj = res.results;
        console.log(newObj);
        // console.log(commonObj[0].data[0]["emp_id"]);
       $.each(newObj, function(i, newObj){
                infoObjName.push(newObj["date"]);
                infoObjLogin.push(newObj["login_time"]);
                infoObjLogout.push(newObj["logout_time"]);
                infoObjDuration.push(newObj["duration"]);
            });
       infoObjNew = {"name":infoObjName,"login":infoObjLogin,"logout":infoObjLogout,"duration":infoObjDuration};
     // console.log("<<<infoObjLatest for role 3 and 4>>>",infoObjNew);
   generatechart(infoObjNew);
    }
  }); 
    } 
          }
           generatechart(infoObjNew);
         }else{swal("Error!",  res.msg , "error");}

          }).fail(function() {
          create_Datatable("#attendance_listTable");
     });
}
function generateattendanceTableNew(key,name){
            // console.log(key,">>>>>>>>>",name);
            // console.log(commonObj);
            if(loginObj.Role == 3||loginObj.Role == 4){
                // console.log("loginObj.Role???",loginObj.Role);
                // console.log(infoObj);
$('.attendanceTable').html('');
$('.attendanceTable').html("<div class='attendanceTableHeaderDiv'><span class='attendanceTableTitle'></span></div><div class='btn-custom1Div'><button type='button' class='btn backButton'><i class='fa fa-arrow-left'></i><span>Back</span></button></div><table id='attendance_listTable' class='cell-border display employeeListTable_header' cellspacing=0 width=100%><thead class='leaveTable_header'><tr><th>Date</th><th>Login</th><th>Logout</th><th>Duration</th></tr></thead><tbody class='attendanceListTable_body'></tbody></table>");
$('.attendanceTableTitle').append(key+"  ["+ name+"]");
$.when(Posthandler("path/empAttendanceStats", infoObj, true)).done(function(res){console.log(res);
    if(res.resCode === "OK"){
        var newObj = res.results;
        // console.log(newObj);
        // console.log(commonObj[0].data[0]["emp_id"]);
       $.each(newObj, function(i, newObj){
         var body = "<tr>";
                    body    += "<td>" + newObj["date"] + "</td>";
                    body    += "<td>" + newObj["login_time"] + "</td>";
                    body    += "<td>" + newObj["logout_time"]+ "</td>";
                if(newObj["duration"] < "09:00"){
                    body    += "<td style='color:white;background-color: red;'>" + newObj["duration"] + "</td>";
                }else{ body    += "<td style='color:white;background-color:green;'>" + newObj["duration"] + "</td>";}
                    body    += "</tr>";
                    $( "#attendance_listTable tbody" ).append(body);
        })
        create_Datatable("#attendance_listTable");
    }
})

            }else{
                // console.log(infoObj);
$('.attendanceTable').html("<div class='mainBoxTital'><div class='attendanceTableHeaderDiv'><span class='attendanceTableTitle'></span></div><div class='btn-custom1Div'><button type='button' class='btn backButton'><i class='fa fa-arrow-left'></i><span>Back</span></button></div><table id='attendance_listTable' class='cell-border display employeeListTable_header attendance_listTable' cellspacing=0 width=100%><thead class='leaveTable_header'><tr><th>Employee Id</th><th>Employee Name</th><th>Login</th><th>Logout</th><th>Duration</th></tr></thead><tbody class='attendanceListTable_body'></tbody></table>");
$('.attendanceTableTitle').append(key+"  ["+ name+"]");
           $.each(commonObj, function(i, commonObj){
            if(commonObj.project !== " " && commonObj.project !== undefined && commonObj.project !== null) {
            tit = commonObj.project;
            }else if(commonObj.role !== " " && commonObj.role !== undefined && commonObj.role !== null){
            tit = commonObj.role;
            }else if(commonObj.emp_name !== " " && commonObj.emp_name !== undefined && commonObj.emp_name !== null) {
            tit = commonObj.emp_name;
            }
            if(name == tit){
                for(var a=0;a<commonObj.data.length;a++){
                        var body = "<tr class='openMoreDetails' data-toggle='tooltip' data-placement='bottom'>";
                    body    += "<td title='click me for more deatils'>" + commonObj.data[a]["emp_id"] + "</td>";
                    body    += "<td>" + commonObj.data[a]["emp_name"] + "</td>";
                    body    += "<td>" + convertMinsToHrsMins(commonObj.data[a]["avglogin"],commonObj.data[a]["count"])+ "</td>";
                    body    += "<td>" + convertMinsToHrsMins(commonObj.data[a]["avglogout"],commonObj.data[a]["count"])+ "</td>";
                    if(convertMinsToHrsMins(commonObj.data[a]["duration"],commonObj.data[a]["count"]) < 09.00){
                    body    += "<td style='color:white;background-color: red;'>" + convertMinsToHrsMins(commonObj.data[a]["duration"],commonObj.data[a]["count"]) + "</td>";
                    }else{ body    += "<td style='color:white;background-color: green;'>" + convertMinsToHrsMins(commonObj.data[a]["duration"],commonObj.data[a]["count"]) + "</td>";}
                    body    += "</tr>";
                    $( "#attendance_listTable tbody" ).append(body);
                   }
                  }
              });
            create_Datatable("#attendance_listTable");
            }
         }
function generateattendanceTableNew1(emp_number,emp_name){
// alert(emp_name);
infoObj.emp_no = parseInt(emp_number);
infoObj.emp_name = emp_name;
// console.log(infoObj);
$.when(Posthandler("path/empAttendanceStats", infoObj, true)).done(function(res){console.log(res);
 if(res.resCode === "OK"){
    var newObj = res.results;
  if(loginObj.Role == 3||loginObj.Role == 4){
$('.attendanceTable').html('');
$('.attendanceTable').html("<div class='attendanceTableHeaderDiv'><span class='attendanceTableTitle'></span></div><div class='btn-custom1Div'><button type='button' class='btn backButton'><i class='fa fa-arrow-left'></i><span>Back</span></button></div><table id='attendance_listTable' class='cell-border display employeeListTable_header' cellspacing=0 width=100%><thead class='leaveTable_header'><tr><th>Date</th><th>Login</th><th>Logout</th><th>Duration</th></tr></thead><tbody class='attendanceListTable_body'></tbody></table>");
$('.attendanceTableTitle').html(emp_name);
$.each(newObj, function(i, newObj){
 var body = "<tr>";
                    body    += "<td>" + newObj["date"] + "</td>";
                    body    += "<td>" + newObj["login_time"] + "</td>";
                    body    += "<td>" + newObj["logout_time"]+ "</td>";
                if(newObj["duration"] < "09:00"){
                    body    += "<td style='color:white;background-color: red;'>" + newObj["duration"] + "</td>";
                }else{ body    += "<td style='color:white;background-color:green;'>" + newObj["duration"] + "</td>";}
                    body    += "</tr>";
                    $( "#attendance_listTable tbody" ).append(body);
        })
        create_Datatable("#attendance_listTable");
    }else{
// alert(infoObj.emp_no);
$('.attendanceTable').html('');
$('.attendanceTable').html("<div class='attendanceTableHeaderDiv'><span class='attendanceTableTitle'></span></div><div class='btn-custom1Div'><button type='button' class='btn backButton'><i class='fa fa-arrow-left'></i><span>Back</span></button></div><table id='attendance_listTable' class='cell-border display employeeListTable_header' cellspacing=0 width=100%><thead class='leaveTable_header'><tr><th>Date</th><th>Login</th><th>Logout</th><th>Duration</th></tr></thead><tbody class='attendanceListTable_body'></tbody></table>");
$('.attendanceTableTitle').html(emp_name);
$.each(newObj, function(i, newObj){
 var body = "<tr class=''>";
                    body    += "<td>" + newObj["date"] + "</td>";
                    body    += "<td class='underline forecastFormEditNew' key='login_time' name='"+ infoObj.emp_name +"' id='"+ infoObj.emp_no+"'>" + newObj["login_time"] + "</td>";
                    body    += "<td class='underline forecastFormEditNew' key='logout_time' name='"+ infoObj.emp_name +"' id='"+ infoObj.emp_no+"'>" + newObj["logout_time"]+ "</td>";
                if(newObj["duration"] < "09:00"){
                    body    += "<td style='color:white;background-color: red;'>" + newObj["duration"] + "</td>";
                }else{ body    += "<td style='color:white;background-color: green;'>" + newObj["duration"] + "</td>";}
                    body    += "</tr>";
                    $( "#attendance_listTable tbody" ).append(body);
        })
        create_Datatable("#attendance_listTable");

    }
  }
 });
}

            function generatechart(objres){
            $('.bodyloading').addClass('hide');
            $('.content').removeClass('hide');
                $('#chartField1').html("");
                Highcharts.setOptions({
    colors: ['#50B432', '#ED561B', '#222D32']
   });
            // console.log("254",objres);
                Highcharts.chart('chartField1', {
                chart: {
                    zoomType: 'xy',
                    backgroundColor:'rgba(255, 255, 255, 0.1)'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: [{
                    categories: objres.name,
                    crosshair: true
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        format: '{value} HH.MM',
                        style: {
                            color: Highcharts.getOptions().colors[4]
                        }
                    },
                    title: {
                        text: 'Logged in time',
                        style: {
                            color: Highcharts.getOptions().colors[4]
                        }
                    },
                    opposite: true

                }, { // Secondary yAxis
                    gridLineWidth: 0,
                    title: {
                        text: 'Logged duration',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} HH.MM',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    }

                }, { // Tertiary yAxis
                    gridLineWidth: 0,
                    title: {
                        text: 'Logged out time',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    labels: {
                        format: '{value} HH.MM',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    opposite: true
                }],
                tooltip: {
                    shared: true
                },
                // plotOptions: {
                //     pie: {
                //         dataLabels: {
                //             distance: -10
                //         },
                //         fillOpacity: 0.1
                //     }
                // },
                    plotOptions: {
        series: {
            cursor: 'pointer',
            point: {
                events: {
                    click: function () {
                        // alert('Category: ' + this.category + ', value: ' + this.y +' '  + this.x +' ' +this.z);
                        console.log("infoObj",infoObj);
                        $('.attendanceTable').removeClass('hide');
                        $('.moreDetails').addClass('hide');
                        generateattendanceTableNew(infoObj.key,this.category);
                    }
                }
            }
        }
    },
                series: [{
                    name: 'Logged in time',
                    type: 'spline',
                    yAxis: 1,
                    data: objres.login,
                    tooltip: {
                        valueSuffix: ' HH.MM'
                    }

                }, {
                    name: 'Logged out time',
                    type: 'spline',
                    yAxis: 2,
                    data: objres.logout,
                    marker: {
                        enabled: false
                    },
                    dashStyle: 'shortdot',
                    tooltip: {
                        valueSuffix: ' HH.MM'
                    }

                }, {
                    name: 'Logged duration',
                    type: 'column',
                    data: objres.duration,
                    tooltip: {
                        valueSuffix: ' HH.MM'
                    }
                }]
                // {
                //     type: 'pie',
                //     name: 'Average',
                //     data: [{
                //         name: 'Avg Li',
                //         y: 13,
                //         color: Highcharts.getOptions().colors[0] // Jane's color
                //     }, {
                //         name: 'Avg Lo',
                //         y: 23,
                //         color: Highcharts.getOptions().colors[1] // John's color
                //     }, {
                //         name: '- Time',
                //         y: 19,
                //         color: Highcharts.getOptions().colors[2] // Joe's color
                //     }],
                //     center: [200, 20],
                //     size: 100,
                //     showInLegend: false,
                //     dataLabels: {
                //     enabled: true
                //     }
                // }]
            });
}




$(document).on("click",".forecastFormEditNew",function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

        $("td").dblclick(function () {          //for selection of perticular cell
        // alert("mobi");
         var OriginalContent = $(this).text();  // save old contain
         // console.log(OriginalContent);          //  see it at console
         var key = $(this).attr('key');
         var id = $(this).attr('id');
         var name = $(this).attr('name');
         var val1 = $(this).parents("tr").find("td:eq(0)").text();
         var val2 = $(this).parents("tr").find("td:eq(1)").text();
         var val3 = $(this).parents("tr").find("td:eq(2)").text();
         var val4 = $(this).parents("tr").find("td:eq(3)").text();
         // console.log("val1",val1,"val2",val2,"val3",val3,"val4",val4);
         // console.log("~~~~~~!!!@@@@@@@######",id,"date",date);
         $(this).addClass("cellEditing");       // cell editing cmd
        $(this).html("<input type='text' class='newData' id='newData' value='" + OriginalContent + "' placeholder='HH:MM'/>"); // come in field
         $(this).children().first().focus();
         // var name = $("#newData").val();
         // console.log(name);
         $(this).children().first().keypress(function (e) {  // if input any character
            // alert("test");
           if (e.which == 13) {                // if it is carrige return(any real time value)
            $(this).html("<input type='text' class='newData' id='newData' value='" + OriginalContent + "'placeholder='HH:MM' />"); // take input
                var new1 = $("#newData").val();      // save it at variable
         // console.log(new1);                          // testing it at console
             $(this).parent().text(new1);            // save it at table
             $(this).parent().removeClass("cellEditing"); // back to cell editing
             // console.log("``````~~~~~~!!!@@@@@@@######",key);
             var aniArgs = {};
                // aniArgs[key] = name;
                aniArgs["emp_id"] = parseInt(id);
                // aniArgs["emp_name"] = name;
                aniArgs["date"] = val1;
                if(key === "login_time"){
                aniArgs["login_time"] = new1;
                aniArgs["logout_time"] = val3;
                }else{
                aniArgs["login_time"] = val2;
                aniArgs["logout_time"] = new1;
               }
               // console.log(">>>>>>>>>>>aniArgs",aniArgs);
             saveforecastFormEditNew(aniArgs,name,id);

            }
        });
         $(this).children().first().blur(function(){
         $(this).parent().text(OriginalContent);
         $(this).parent().removeClass("cellEditing");
        });
     });
  });
 function saveforecastFormEditNew(aniArgs,name,id){
    // alert("save");
    // console.log("+++++++++++++++++++++",infoObj);
// console.log(aniArgs,">>>",name,"????",id);
aniArgs
    // var obj = {'"+ +"':name,"emp_id":id};
 $.when(Posthandler("path/editTime", aniArgs, true)).done(function(res){console.log(res);
    if(res.resCode === "OK"){
        generateattendanceTableNew1(id,name)
    }

  });
 };
// $(document).on("click",".highcharts-point",function(e){
//     e.preventDefault();
//     e.stopImmediatePropagation();
//     // alert($(this).text());
//     $(".opentabledivBtn").click();
//     });
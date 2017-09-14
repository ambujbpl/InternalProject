 $(document).ready(function(){
var loginObj= storagegetItem("login");
var adminloginObj= storagegetItem("adminlogin");
infoObj.role = loginObj.Role;
// console.log(loginObj.Role);
console.log(infoObj);
if(loginObj.Role == 1){
   // $('#attendance_div').hide();
   $('.attandance_per').hide();
   $('.divTable').addClass('hide');
   $('.divTable1').addClass('hide');
console.log("1........"+loginObj.Role); 
}
else if(loginObj.Role == 2){
  console.log("2........"+loginObj.Role);
}
else if(loginObj.Role == 3){
  console.log("3........"+loginObj.Role);
  $('.createCompany_Div').hide();
  $('#createemployee_Div').hide();
  $('.employee_listProfileTreeview-menu').html("Employee details");
}
else{
  console.log("4........"+loginObj.Role);
  $('.createCompany_Div').hide();
  $('#createemployee_Div').hide();
  $('.employee_listProfileTreeview-menu').html("Employee details");
}
$('#loginPerson_name').html(loginObj.Name);
  $('#createCompany_Div').click(function(){
  $('#createCompany_Div').addClass('active'); 
  $("#containerload").load("html/create_Company.html"); 
  });
    $('#leave_div').click(function(){
    $('.treeview').removeClass('active');  
    $(this).addClass('active');
    $("#containerload").load("html/leave.html"); 
  });    
    $('#attendance_div').click(function(){
    $('.treeview').removeClass('active');  
    $(this).addClass('active');
    $("#containerload").load("html/attendance.html"); 
  });   
  $('#employeeList_div').click(function(){
   $('.treeview').removeClass('active');  
   $(this).addClass('active');   
    employeeListjsFunction();
  });    
    $('#createemployee_Div').click(function(){
    $('.treeview').removeClass('active');  
    $(this).addClass('active');  
    $('#containerload').load("html/create_employ.html");  
    setTimeout(function() {
    $(".createEmp_ModalBody").removeClass('hide');
    $(".bodyloading").addClass('hide');      
   }, 300);   
    
  });
    $('#changePassword_Div').click(function(){
   window.location.replace("html/forgot-Password.html?key");
  });   
        $('#search-btn').click(function() {
window.location = 'http://www.google.com/search?q=site' + document.getElementById('admin_search').value;
        return false;
    });
$('#logout_anchor').click(function() {
  var obj;
$.when(Posthandler("/logout", obj, true)).done(function(res){console.log(res);
  if(res.resCode=='OK'){
    // console.log(res.msg);
    storageremoveItem("login");
    storageremoveItem("adminlogin");
    storageremoveItem("editemployee");
    // console.log(storagegetItem("editemployee"));
    // console.log(storagegetItem("adminlogin"));
    // console.log(storagegetItem("login")); 
    window.location.replace("index.html");
     }else{console.log(res.msg);}
    }).fail(function() {swal("Error!",  "sorry unable to logout. please check your internet connection" , "error");});
 })  

$('#profile_Div').click(function() {
$(".profiledata").load("html/profilepage.html");
    $("#aboutModal").modal({
        backdrop: 'static',
        keyboard: false
    });
  });
$('#notification_div').click(function() {
$('.treeview').removeClass('active');  
$(this).addClass('active');
$('.modalTitle').html('Events');
$(".profiledata").load("html/notification.html");
    $("#aboutModal").modal({
        backdrop: 'static',
        keyboard: false
    });
  });
employeeListjsFunction();

}); // document.ready function closed
var obj;
$.when(Posthandler("path/empAttendance", obj, true)).done(function(res){console.log(res);
  if(res.msg !== "DATA NOT AVAILABLE"){
  $('#attendancevalue').html(res.percent + "&#37");
  $('#d_field').html(res.working_days);
  $('#l_field').html(res.leaves);    
    }else{$('#attendancevalue').html(''); $('#l_field').html('');$('#d_field').html('');}
 });
$.when(Posthandler("path/avgAttendance", obj, true)).done(function(res){console.log(res);
  if(res.resCode === "OK"){
    var can1 = convertMinsToHrsMins(res.results.avg_login,1);
    var can2 = convertMinsToHrsMins(res.results.avg_logout,1);
    var can3 = convertMinsToHrsMins(res.results.avg_duration,1);
    console.log(">>>>>",can1,"<<<",can2,":::::::",can3)
  $('#s_field').html(can1);
  $('#m_field').html(can2);
  $('#a_field').html(can3);    
    }else{
  $('#s_field').html('');
  $('#m_field').html('');
  $('#a_field').html('');

    }
 });
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
});  
$.when(Posthandler("path/downloads", obj, true)).done(function(res){
  // console.log("image>>>>>",res.result_64);
var base64_string = res.result_64;
$("<img>", {
         "src": "data:image/png;base64," + base64_string,
         // added `width` , `height` properties to `img` attributes
         "width": "70%", "height": "auto"})
       .appendTo("#imageappend");
 });
 var objSave1 = {"key":"pending"};
 $.when(Posthandler("path/leaveStatus", objSave1, true)).done(function(res1) {console.log(res1);
 if(res1.resCode === "OK"){
  $('.leavepending').html(res1.pendings);
 }
});


var count_Noti = 0;
$.when(Posthandler("path/b_days", objSave1, true)).done(function(res1) {console.log(res1);
 if(res1.resCode === "OK"){
     count_Noti++;
     $.when(Posthandler("path/holidays", objSave1, true)).done(function(res1) {console.log(res1);
     if(res1.resCode === "OK"){
      count_Noti++;
      console.log(count_Noti);    
      $('.notificationVal').html(count_Noti);
     }
    }); 
  }
}); 





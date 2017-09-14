// var loginObj= storagegetItem("login");
function employeeListjsFunction() {
  // console.log(loginObj);
 $("#containerload").html("<div class='bodyloading'><div class='boxloading_leaveTable'></div></div><section class='content'><div class='header_Doc'><div class='box_titleMedia box_title'></div></div><div class='boxC'><table id='employee_listTable' class='cell-border display employeeListTable_header hide'  cellspacing=0 width=100%><thead class='leaveTable_header'><tr><th>Employee No</th><th>Employee Name</th><th>Contact No</th><th>Designation</th><th>Email ID</th><th>Status</th><th>Date Of Joining</th><th>Supervisor</th><th>Edit</th></tr></thead><tbody class='employeeListTable_body'></tbody></table></div></section>");    
var obj;
$.when(Posthandler("/employeeList", obj, true)).done(function(res){console.log(res);
     if(res.resCode=='OK'){
       $('.bodyloading').addClass('hide');
       $('#employee_listTable').removeClass('hide');
      var arr={};
      arr=res.results;
      // console.log(arr);
      // console.log(moment(arr["joining_date"]).format("YYYY-MM-DD"));
          var email = arr[0]["emp_email_id"];
       var emp_id = arr[0]["emp_no"];
       var sup_id = arr[0]["emp_sup_id"];
       var stat = arr[0]["emp_status"];
       adminlogin={"Email":email,"EmpNo":emp_id,"SupID":sup_id,"Status":stat};
       storagesetItem("adminlogin",adminlogin);

   $.each(arr, function(i, arr){
     // console.log(arr["emp_no"]);
            var body = "<tr>";
            body    += "<td>" + arr["emp_no"] + "</td>";
            body    += "<td>" + arr["emp_lastname"] + "</td>";
            body    += "<td>" + arr["emp_contact_no"] + "</td>";
            body    += "<td>" + arr["emp_designation"] + "</td>";
            body    += "<td>" + arr["emp_email_id"]  + "</td>";
            body    += "<td>" + arr["emp_status"] + "</td>";
            body    += "<td>" + moment(arr["joining_date"]).format("YYYY-MM-DD") + "</td>";
            body    += "<td>" + arr["emp_supervisor"] + "</td>";
            body    += "<td class='editrow'  title='click here for edit "+ arr["emp_lastname"] +" details '><i class='fa fa-pencil-square'  aria-hidden='true'></td>";  
            body    += "</tr>";
            $( "#employee_listTable tbody" ).append(body);
        });
if(loginObj.Role == 4){
  $('.box_title').html("Employee Detail");
  create_DatatableEmployee("#employee_listTable");
 }else 
 {
  $('.box_title').html("Employee List");
  create_Datatable("#employee_listTable");
}
 $(".editrow").click(function(e){
   // console.log(arr);
   var EmpNo = $(this).parents('tr').find('td:first').html();
   var EmpName = $(this).parents('tr').find('td:nth-child(2)').html();
   // console.log(">>>>>>>>>>",EmpNo);console.log("<<<<<<<<",EmpName);
  $("#containerload").load("html/create_employ.html");
  setTimeout( function ( ) { 
  for(var i=0; i<arr.length;i++){ 
 if(arr[i]["emp_no"] == EmpNo){
  // console.log(EmpNo);
  // console.log("if");
   var email = arr[i]["emp_email_id"];
       var emp_id = arr[i]["emp_no"];
       var sup_id = arr[i]["emp_sup_id"];
       var stat = arr[i]["emp_status"];
       editemployee={"Email":email,"EmpNo":emp_id,"SupID":sup_id,"Status":stat};
       storagesetItem("editemployee",editemployee);
       filldetails(arr[i]);
  }else if((arr[i]["emp_lastname"] == EmpName)&&(arr[i]["emp_id"] == null)) {
  // console.log(EmpName);
  // console.log("else");
  filldetails(arr[i]);
  }
} 
$(".bodyloading").addClass('hide');
$(".createEmp_ModalBody").removeClass('hide'); 
  }, 100 );
  });  
}else{
          swal({ 
          title: "Error!",
           text: "sorry unable to load Data because Tokan Time Out",
            type: "error" 
          },
          function(){
            window.location.href = 'index.html';
        });
}       
   
    }).fail(function() {
          swal({ 
          title: "Error!",
           text: "fail to connect",
            type: "error" 
          },
          function(){
            window.location.href = 'index.html';
        });
    });
}

function filldetails(arr){
  // console.log(arr["emp_firstname"]);
  $('.emp_numberDiv').html('Employee Number '+arr["emp_no"]);
  $('#name').val(arr["emp_firstname"]);
  $('#mname').val(arr["emp_middle_name"]); 
  $('#lname').val(arr["emp_lastname"]);
  $('#datepicker').val(moment(arr["dob"]).format("YYYY-MM-DD"));
  $('#fname').val(arr["emp_fathername"]);
  $('#mobile').val(arr["emp_contact_no"]);
  $('#altmobile').val(arr["emp_alternative_no"]);
  $('#address2').val(arr["emp_present_address"]);
  $('#address1').val(arr["emp_permante_address"]);
  $('#designationSelect').val(arr["emp_designation"]);
  $('#datepicker1').val(moment(arr["joining_date"]).format("YYYY-MM-DD"));
  $('#cmail').val(arr["emp_email_id"]);
  $('#altemail').val(arr["emp_alternate_email"]);
  $('#city').val(arr["city1"]);
  $('#city2').val(arr["city2"]);
  $('#lmark').val(arr["landmark1"]);
  $('#lmark2').val(arr["landmark2"]); 
  $('#mother').val(arr["emp_mother_name"]);
  $('#pin').val(arr["pin1"]);
  $('#pin2').val(arr["pin2"]);
  $('#emp_relation').val(arr["emp_relation"]);
  $('#emp_status').val(arr["emp_status"]);
  $('#emp_contact_name').val(arr["emp_contact_name"]);
  $('#emp_qualification').val(arr["emp_qualification"]); 
  $("input[name='optionsRadios']:checked").val(arr["gender"]);
  $("#emp_no").val(arr["emp_no"]);
}
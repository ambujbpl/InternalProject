$(document).ready(function(){
  var loginObj= storagegetItem("login");
// var adminloginObj= storagegetItem("adminlogin");
   $('#datepicker').datepicker({
      format:"yyyy-mm-dd",
      autoclose: true
    });
     $('#datepicker1').datepicker({
      format:"yyyy-mm-dd",
     autoclose: true
    });
    $('#datepicker2').datepicker({
      format:"yyyy-mm-dd",
      startDate: new Date(),
      autoclose: true
    });
if(loginObj.Role == 4){
console.log("1........"+loginObj.Role); 
$('#tab3').addClass('hide');
}
 var letters = /^[a-zA-Z\s]+$/;    
 var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        
        $("form :input").change(function(e) { 
                var name = $("#name").val();
                var lname = $("#lname").val();
                var mname = $("#mname").val();
                var cname = $("#emp_contact_name").val();
                var rname = $("#emp_relation").val();
                      e.preventDefault();
                     if((name==null||name=="")&&(lname==null||lname==""))
                       {
                        $('#error1a').show();
                        $('#error1').show();
                        $('#error1n').hide();
                      }else if(!(name.match(letters))){
                        $('#error1').hide();
                        $('#error1n').show();
                       }
                       else if(lname==null||lname=="")
                       {
                         $('#error1a').show();
                         $('#error1n').hide();
                       }
                       else if(!(lname.match(letters)))
                       {
                        $('#error1').hide();
                        $('#error1n').hide();
                        $('#error1a').hide();
                        $('#error1b').show();
                       }
                       else if((mname!="")&&(!(mname.match(letters))))
                       {
                        $('#error1').hide();
                        $('#error1n').hide();
                        $('#error1a').hide();
                        $('#error1b').hide();
                        $('#error1m').show();  
                        }
                       else if((cname!="")&&(!(cname.match(letters))))
                        {
                        $('#error1').hide();
                        $('#error1n').hide();
                        $('#error1a').hide();
                        $('#error1b').hide();
                        $('#error1m').hide();  
                        $('#error1c').show();
                        }
                        else if((rname!="")&&(!(rname.match(letters))))
                        {
                        $('#error1').hide();
                        $('#error1n').hide();
                        $('#error1a').hide();
                        $('#error1b').hide();
                        $('#error1m').hide();
                        $('#error1c').hide();
                        $('#error1r').show();  
                       }else{
                        $('#error1').hide();
                        $('#error1n').hide();
                        $('#error1a').hide();
                        $('#error1b').hide();
                        $('#error1m').hide();
                        $('#error1c').hide();
                        $('#error1r').hide();
                       }
                     });

           $("form :input").change(function(e) { 
                      var dob = $("#datepicker").val();
                      e.preventDefault();
                       if(dob==null||dob=="")
                       {
                         $('#error2').show();
                       }
                      else{
                        $('#error2').hide();
                       }
                     });
            $("form").submit(function(e) { 
                var isChecked = jQuery("input[name=optionsRadios]:checked").val();
                // var isChecked=$("input[name='optionsRadios']:checked").val();
                      e.preventDefault();
                             if(!isChecked){
                                $('#error3').show();
                           }else{
                               $('#error3').hide();
                           }
                    });
                  $("form").submit(function(e){
                       var fname = $("#fname").val();
                      e.preventDefault();
                    if(fname==null||fname=="")
                       {
                         $('#error4').show();
                         $('#error4a').hide();
                       }else if(!(fname.match(letters))){
                         $('#error4').hide();
                         $('#error4a').show();
                       }
                       else{
                        $('#error4').hide();
                        $('#error4a').hide();
                       }
                     });

               $("form :input").change(function(e) {   
                        var mname = $("#mother").val();
                        var Aadhar = $("#Aadhar").val();
                      e.preventDefault();
                       if((mname!="")&&(!(mname.match(letters))))
                       {
                         $('#error5').show();
                       }
                       else if((Aadhar!="")&&(Aadhar.length!=12))
                        {
                        $('#errorAadhar').show(); 
                        }
                       else{
                        $('#error5').hide();
                        $('#errorAadhar').hide(); 
                       }
                     });
                 $("form :input").change(function(e) { 
                        var mobile= $("#mobile").val();
                        var amobile= $("#altmobile").val();
                      e.preventDefault();
                     if(mobile==null||mobile=="")
                       {
                         $('#error6').show();
                         $('#error6a').hide();
                      }else if(mobile.length!=10){
                        $('#error6').hide();
                        $('#error6a').show();
                      }
                      else if((amobile!="")&&(amobile.length!=10)){
                        $('#error6').hide();
                        $('#error6a').hide();
                        $('#error6b').show();
                        // alert("test");
                      }
                       else{
                        $('#error6').hide();
                        $('#error6a').hide();
                        $('#error6b').hide();
                      }
                     });

              $("form :input").change(function(e) { 
                        var cmail = $("#cmail").val();
                         var amail = $("#altemail").val();
                      e.preventDefault();
                      if(cmail==null||cmail=="")
                       {
                        $('#error7').show();
                        $('#error7a').hide();
                       }
                      else if(!(cmail.match(mailformat))){
                         $('#error7').hide();
                         $('#error7a').show();
                       }
                       else if((amail!="")&&(!(amail.match(mailformat)))){
                         $('#error7').hide();
                         $('#error7a').hide();
                         $('#error7b').show();
                       }
                       else{
                        $('#error7').hide();
                        $('#error7a').hide();
                        $('#error7b').hide();
                       }
                     });

                      $("form").submit(function(e){
                       var add = $("#address1").val();
                      e.preventDefault();
                      if(add==null||add=="")
                       {
                         $('#error8').show();
                       }
                       else{
                        $('#error8').hide();
                       }
                     });

        $("form :input").change(function(e) { 
                       var city = $("#city").val();
                       var city2 = $("#city2").val();
                       e.preventDefault();
                       if(city==null||city=="")
                       {
                         $('#error9').show();
                        $('#error9a').hide();   
                       }else if(!(city.match(letters))){
                        $('#error9').hide();
                        $('#error9a').show();
                      }
                      else if((city2!="")&&(!(city2.match(letters)))){
                        $('#error9').hide();
                        $('#error9a').hide();
                        $('#error9b').show();
                       }
                       else{
                        $('#error9').hide();
                         $('#error9a').hide();
                         $('#error9b').hide();                      
                        }
                     });

           $("form :input").change(function(e) { 
                       var pin = $("#pin").val();
                       var pin2 = $("#pin2").val();
                       e.preventDefault();
                     if(pin==null||pin=="")
                       {
                        $('#error10').show();
                      }else if(pin.length!=6)
                      { 
                        $('#error10').hide();
                        $('#error10a').show();
                      }else if((pin2!="")&&((pin.length!=6))){
                        $('#error10').hide();
                        $('#error10a').hide();
                        $('#error10b').show();
                       }
                       else{
                        $('#error10').hide();
                        $('#error10a').hide();
                        $('#error10b').hide();
                       }
                     });
                  });
           $("form").submit(function(e){
             var p = $("#emp_no").val();
            if(p === ""){
              $('#error11').show();
            }else{
              $('#error11').hide();}
            });
var obj = new Object();
var obj1 = new Object();
var obj2 = new Object();
var loginObj= storagegetItem("login");
function myFunction() {
var editemployeeObj= storagegetItem("editemployee");
var fn=document.getElementById("name").value;
var ln=document.getElementById("lname").value;
var dob=document.getElementById("datepicker").value;
var gen=$("input[name='optionsRadios']:checked").val();
var fatn=document.getElementById("fname").value;
var mob=document.getElementById("mobile").value;
var cmail=document.getElementById("cmail").value;
var padd=document.getElementById("address1").value;
var pi=document.getElementById("pin").value;
var ci=document.getElementById("city").value;
var e_no = document.getElementById("emp_no").value;
console.log(gen);
if((fn!="")&&(ln!="")&&(dob!="")&&(gen!= undefined)&&(fatn!="")&&(mob!="")&&(cmail!="")&&(padd!="")&&(ci!="")&&(pi!="")&&(pi.length==6)&&(e_no!="")){ 
if(jQuery.isEmptyObject(editemployeeObj)){
obj1.emp_sup_id= document.getElementById("emp_supId").value;
obj1.emp_status= document.getElementById("emp_status").value;
obj2.emp_sup_id= document.getElementById("emp_supId").value;
}else{ 
// alert("else");
console.log(editemployeeObj);
var emp_no = editemployeeObj.EmpNo;
console.log(emp_no);
obj1.emp_sup_id= editemployeeObj.SupID;
obj1.emp_status= editemployeeObj.Status;
obj2.emp_sup_id= editemployeeObj.SupID;
}  
// var emp_no = editemployeeObj.EmpNo;
// console.log(emp_no);
$checkbox = document.getElementById("moo").checked;
if($checkbox == true){
  // alert("true");
obj1.emp_present_address=document.getElementById("address2").value;
obj1.landmark2=document.getElementById("lmark2").value;
obj1.city2=document.getElementById("city2").value;
obj1.pin2=document.getElementById("pin2").value;
}
else {
// alert("false");      
obj1.emp_present_address=document.getElementById("address1").value;
obj1.landmark2=document.getElementById("lmark").value;
obj1.city2=document.getElementById("city").value;
obj1.pin2=document.getElementById("pin").value; 
 } 
obj1.emp_no= parseInt(document.getElementById("emp_no").value); 
obj1.emp_firstname=document.getElementById("name").value;
obj1.emp_middle_name=document.getElementById("mname").value;
obj1.emp_lastname=document.getElementById("lname").value;
obj1.dob=document.getElementById("datepicker").value;
obj1.gender = $("input[name='optionsRadios']:checked").val();
obj1.emp_fathername=document.getElementById("fname").value;
obj1.emp_mother_name=document.getElementById("mother").value;
obj1.emp_contact_no=document.getElementById("mobile").value;
obj1.emp_alternative_no=document.getElementById("altmobile").value;
obj1.emp_email_id=document.getElementById("cmail").value;
obj1.emp_alternate_email=document.getElementById("altemail").value;
obj1.emp_permante_address=document.getElementById("address1").value;
obj1.landmark1=document.getElementById("lmark").value;
obj1.city1=document.getElementById("city").value;
obj1.pin1=document.getElementById("pin").value;
obj1.emp_designation=document.getElementById("designationSelect").value;
obj1.emp_contact_name=document.getElementById("emp_contact_name").value;
obj1.emp_relation=document.getElementById("emp_relation").value;
obj1.emp_qualification=document.getElementById("emp_qualification").value;
obj1.joining_date=document.getElementById("datepicker1").value;
//JSON.stringify(obj.format1)
obj2.emp_no= parseInt(document.getElementById("emp_no").value);
// obj2.emp_=document.getElementById("departmentSelect").value;   
obj2.emp_adhar=document.getElementById("Aadhar").value;
obj2.emp_pancard=document.getElementById("pan").value;   
obj2.emp_pf=document.getElementById("pf").value;
obj2.emp_esi=document.getElementById("esiNum").value;
obj2.emp_insurance=document.getElementById("ins").value;
// obj2.joining_date=document.getElementById("datepicker1").value;
obj2.emp_basic_pay =document.getElementById("basic").value;
obj2.emp_da=document.getElementById("da").value;
obj2.emp_incentives=document.getElementById("incentives").value;
obj2.emp_tax=document.getElementById("tax").value;
obj2.emp_pf_amount=document.getElementById("pfp").value;
obj2.emp_esi_amount=document.getElementById("esi").value;
obj2.emp_insurance_amount=document.getElementById("Insurence").value;
obj2.emp_deductions=document.getElementById("ded").value;
obj2.emp_netpay=document.getElementById("netpay").value;
obj2.emp_next_payrol_revision=document.getElementById("datepicker2").value;
obj2.emp_key=document.getElementById("key").value;
// obj2.emp_status=document.getElementById("emp_status").value;
obj2.emp_cer_submit=document.getElementById("emp_cer_submit").value;
obj2.emp_agrement_sign=document.getElementById("emp_agrement_sign").value;
// obj2.emp_sup_id= editemployeeObj.SupID;
// obj2.emp_status= editemployeeObj.Status;
obj ={"format1":obj1,"format2":obj2};
 console.log(obj);
 $.when(Posthandler("/createemployee", obj, true)).done(function(res){
console.log(res);
      swal({
     title: "ok!",
     text: "Your details changed successfully!",
     type: "success"
     },
     function () {
  swal.close();
  // window.location.replace("dashboard.html");
  storageremoveItem("editemployee");
  console.log(storagegetItem("editemployee"));
  employeeListjsFunction();
});
 }).fail(function() {swal("Error!",  "sorry unable to change. please check your internet connection" , "error");});
  }
}

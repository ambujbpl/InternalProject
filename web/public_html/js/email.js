$.validator.setDefaults ( {
   submitHandler: function () {
var em1 = document.getElementById("email").value;
  // console.log(em1); 
      adminlogin={"Email":em1};
       // console.log(adminlogin);
       storagesetItem("adminlogin",adminlogin);
  var objemail = {"email":em1};
  console.log(objemail);        
          $.post({
              url:"/forgot_password",
              type: "POST",
              data: objemail,
              success: function(res)
                  {
                  console.log(res.resCode);
                  if(res.resCode=='OK'){
                      console.log(res.msg);
                      if(res.msg != "user not found create new user"){
                    window.location.replace("forgot-Password.html");
                    }
              }else{
                     console.log(res.msg);
                   }       
               },
               error: function() { 
              console.log("fail login");
                   }
                });
           }
     });
    
     $(document).ready(function(){
            $("#emailvalid").validate({
                rules:{
                     email:{
                        required: true,
                        email: true
                    },
                                 
                },
                messages: {
                    email: "Please enter a valid email address",
                                         
                },
                errorElement: "em",
                errorPlacement: function ( error, element ) {
                    // Add the `help-block` class to the error element
                    error.addClass( "help-block" );

                    if ( element.prop( "type" ) === "checkbox" ) {
                        error.insertAfter( element.parent( "label" ) );
                    } else {
                        error.insertAfter( element );
                    }
                },
                highlight: function ( element, errorClass, validClass ) {
                    $( element ).parents( ".col-sm-5" ).addClass( "has-error" ).removeClass( "has-success" );
                },
                unhighlight: function (element, errorClass, validClass) {
                    $( element ).parents( ".col-sm-5" ).addClass( "has-success" ).removeClass( "has-error" );
                }

            });
        });
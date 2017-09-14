 // $.validator.setDefaults({
    var i;
      jQuery.validator.setDefaults({
            submitHandler: function () {
    var adminloginObj= storagegetItem("adminlogin");
    // console.log(adminloginObj);
        var email= adminloginObj.Email;
        var password= document.getElementById("password").value;
        var confirm= document.getElementById("Confirm_Password").value;
        var otp= document.getElementById("otp").value;
   // console.log("<<<<",window.location.href);
    if(window.location.href==='http://localhost:8080/html/forgot-Password.html?key'){
        var objpass = {"password":password,"confirm":confirm,};
    }else{    
        var objpass = {"email":email,"password":password,"confirm":confirm,"otp":otp};}
   console.log(objpass);
               $.ajax({
                    url:"/reset_password",
                    type: "POST",
                    data: objpass,
                      
                    success: function(res)
                        {
           if(res=='password reset'){
        storageremoveItem("adminlogin");
    // console.log(storagegetItem("adminlogin"));
    swal({ 
  title: "OK!",
   text: "Your password has been reset successfully!",
    type: "success" 
  },
  function(){
   window.location.replace("../index.html");
});
            
                        }
                    else{
                        swal("Error!", res , "error")
                           console.log(res);
                    }       
                  },
                     error: function() { 
                        swal("Error!", "password reset fail !", "error")
                      console.log(" password reset fail !!");
                    }
                     
                });

            }
        });

 $( document ).ready( function () {
    var my_param = window.location.href;
    // console.log(my_param);
    key = my_param.split('?').pop();
    if(key === "key"){
           $('#otpdiv').addClass('hide');
      }
       

$('.img').addClass('hide');
$('.img1').addClass('hide');      
$('#password').hover(function(){
    // alert("TEST");
    $('.img').removeClass('hide');
}, function(){
    $('.img').addClass('hide');
});
$('.img').hover(function(){
     $('.img').removeClass('hide');
  }, function(){
    $('.img').removeClass('hide');
});
$('#Confirm_Password').hover(function(){
    // alert("TEST");
    $('.img1').removeClass('hide');
}, function(){
    $('.img1').addClass('hide');
});
$('.img1').hover(function(){
     $('.img1').removeClass('hide');
  }, function(){
    $('.img1').removeClass('hide');
});
//  $('.img').click(function(){
//              var id = $(this).attr( "name" );
//              console.log(id);
//    if(id==='password'){
//        if(password.type==='password'){
//         password.type='text';
//     }else{
//     password.type='password';
//     }     
//    }else{
//     if(Confirm_Password.type==='password'){
//     Confirm_Password.type='text';
//     }else{
//     Confirm_Password.type='password';
//      }  
//    }
// });
                    $.validator.addMethod("pwcheckspechars", function (value) {
         return /[!@#$%^&*()_=\[\]{};':"\\|,.<>\/?+-]/.test(value)
              });
               $.validator.addMethod("pwchecknumber", function (value) {
        return /\d/.test(value) // has a digit
               });   

            var confirm= document.getElementById("Confirm_Password").value;
                $( "#passwordchange" ).validate( {
                    rules: {
                        password: {
                            required: true,
                            minlength: 5,
                            maxlength: 12,
                            pwcheckspechars: true,
                            pwchecknumber:true
                        },
                       Confirm_Password: {
                            required: true,
                            minlength: 5,
                            equalTo: "#password"
                        },
                        
                    },
                    messages: {
                        password: {
                            required: "Please provide a password",
                            minlength: "Your password must be at least 5 characters long",
                            manlength: "Your password must be at most 12 characters long",
                            pwchecknumber: "The password must contain at least one number", 
                            pwcheckspechars: "at 1 Special Character required"
                        },
                        Confirm_Password: {
                            required: "Please provide a password",
                            minlength: "Your password must be at least 5 characters long",
                            equalTo: "Please enter the same password as above"
                        },
                         
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
                } );
            });
function mDown() {
    password.type='text';
}

function mUp() {
    password.type='password';
}
function mDown1() {
    Confirm_Password.type='text';
}

function mUp1() {
    Confirm_Password.type='password';
}

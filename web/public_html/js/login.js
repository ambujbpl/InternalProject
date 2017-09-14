 function myFunction() {
    var em1=document.getElementById("email").value;
    var pas1=document.getElementById("password").value;
    var encodePass = btoa(pas1).toString();
    var decodedString = atob(encodePass);
// console.log(decodedString); 
// console.log(encodePass);
    var obj={"username":em1,"password":encodePass};
// console.log(obj);
$.ajax({
    url:"/login",
    type: "POST",
    data:JSON.stringify(obj),
      
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    success: function(res)
        {
        // console.log(res.resCode);
        if(res.resCode=='OK'){
            console.log(res.msg);
               var tok=res.token;
              var role = res.role_id;
              var name = res.emp_name;
            login={"Tokan":tok,"Role":role,"Name":name};
            storagesetItem("login",login);
          window.location.replace("dashboard.html");
    }else{
           console.log(res.msg);
             swal("Error!", res.msg , "error");
    }       
       
    },
     error: function(XMLHttpRequest, textStatus, errorThrown) { 
    swal("Error!",  "sorry unable to login. please check your internet connection" , "error");
      // console.log("fail login");
    }
     
});
}
    
 $.validator.setDefaults( {
            submitHandler: function () {
               myFunction();
            }
        });
$(document).ready(function(){

//    $('.img').click(function(){
    
//        if(password.type==='password'){
//         password.type='text';
//     }else{
//     password.type='password';
//     }     
//   });
$('.img').addClass('hide');      
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
     
            $.validator.addMethod("pwcheckspechars", function (value) {
         return /[!@#$%^&*()_=\[\]{};':"\\|,.<>\/?+-]/.test(value)
              });
               $.validator.addMethod("pwchecknumber", function (value) {
        return /\d/.test(value) // has a digit
               });   
            $("#signupForm").validate({

                rules:{
                     email:{
                        required: true,
                        email: true
                    },
                    password:{
                            required: true,
                            minlength: 5,
                            maxlength: 12,
                            pwcheckspechars: true,
                            pwchecknumber:true
                    },
                                      
                },
                messages: {
                    email: "Please enter a valid email address",
                    password: {
                            required: "Please provide a password",
                            minlength: "Your password must be at least 5 characters long",
                            manlength: "Your password must be at most 12 characters long",
                            pwchecknumber: "The password must contain at least one number", 
                            pwcheckspechars: "at 1 Special Character required"
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
            });
              
          });
 function mDown() {
    password.type='text';
}

function mUp() {
    password.type='password';
}

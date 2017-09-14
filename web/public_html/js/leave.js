$(document).ready(function() {
var st;
  $('#datepickera').datepicker({
      format:"yyyy-mm-dd",
      startDate: new Date(),
      todayHighlight: true,
      autoclose: true
     });
     $('#datepickerb').datepicker({
      format:"yyyy-mm-dd",
      startDate: new Date(),
      autoclose: true
    });
 });   
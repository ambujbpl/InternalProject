<script>
Date.daysBetween = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;
  // var date1 = document.getElementById("cin").innerText;
  // console.log(date1);

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
  //take out milliseconds
  difference_ms = difference_ms/1000;
  var seconds = Math.floor(difference_ms % 60);
  difference_ms = difference_ms/60; 
  var minutes = Math.floor(difference_ms % 60);
  difference_ms = difference_ms/60; 
  var hours = Math.floor(difference_ms % 24);  
  var days = Math.floor(difference_ms/24);
  
  return days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds';
}

//Set the two dates
var y2k  = new Date(2000, 0, 1);
var Jan1st2010 = new Date(y2k.getYear() + 10, y2k.getMonth(), y2k.getDate());
var today= new Date();
//displays "Days from Wed Jan 01 0110 00:00:00 GMT-0500 (Eastern Standard Time) to Tue Dec 27 2011 12:14:02 GMT-0500 (Eastern Standard Time): 694686 days, 12 hours, 14 minutes, and 2 seconds"
console.log('Days from ' + Jan1st2010 + ' to ' + today + ': ' + Date.daysBetween(Jan1st2010, today));
</script>                      
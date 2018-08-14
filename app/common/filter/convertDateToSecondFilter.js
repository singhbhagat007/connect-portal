(function(){
	'use strict';
	angular
		.module('AkosPCP')
		.filter('convertDateToSecondFilter',convertDateToSecondFilter);
	function convertDateToSecondFilter(){
		return function(date){

			//date -- call started
		var callstarted = moment(date); 
            var callended = moment(); 
            var callstarted=moment(callstarted, "HH:mm:ss"); 
            var callended=moment(callended, "HH:mm:ss"); 
            var duration = moment.duration(callended.diff(callstarted));  
            var hours = parseInt(duration._data.hours);   if(hours.toString().length == 1){ hours = '0'+hours;}
            var minutes = parseInt(duration._data.minutes);  if(minutes.toString().length == 1) {minutes = '0'+minutes;}
            var seconds = parseInt(duration._data.seconds);  if(seconds.toString().length == 1) {seconds = '0'+seconds;} 
            var days = parseInt(duration._data.days);  if(days.toString().length == 1) {days = '0'+days;}
            if(days > 0){
                  return days +'day '+hours+' hr '+minutes+' min '+seconds + ' sec'; 
            }
            else if(hours > 0){
            	return hours+' hr '+minutes+' min '+seconds + ' sec';	
            }else if(seconds == '00'){
            	return minutes+' min 01 sec';
            }else{
                  return minutes+' min '+ seconds + ' sec';
            }
        }
	}
	})();
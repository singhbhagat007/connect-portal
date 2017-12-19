(function(){
	'use strict';
	angular
		.module('AkosPCP')
		.filter('convertDateToSecondFilter',convertDateToSecondFilter);
	function convertDateToSecondFilter(){
		return function(date){
			var date = new Date(date);
			var currDate = new Date();
			var timeDiff = Math.abs(currDate.getTime() - date.getTime());
			var secDiff  = Math.ceil(timeDiff / (1000)); 
			var minDiff = Math.ceil(timeDiff / (1000 * 60)); 
			if(secDiff <= 60){
				return secDiff+' seconds';
			}else{
				return minDiff+' minutes';
			}
		}
	}
	})();
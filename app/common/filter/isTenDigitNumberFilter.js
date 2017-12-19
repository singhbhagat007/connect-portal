(function(){
	'use strict';
	angular
		.module('AkosPCP')
		.filter('isTenDigitNumberFilter',isTenDigitNumberFilter);
	function isTenDigitNumberFilter(){
		return function(number){
			var isNumber = /^\d+$/.test(number);
			if(isNumber && (number.length === 10)){
				return true;
			}
			
		}
	}	
	})();
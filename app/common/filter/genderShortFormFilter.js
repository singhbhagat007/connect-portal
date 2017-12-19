(function(){
	'use strict';
	angular
		.module('AkosPCP')
		.filter('genderShortFormFilter',genderShortFormFilter);
	function genderShortFormFilter(){
		return function(gender){
			if(gender == 'male' || gender == 'Male'){
				return 'M';
			}else if(gender == 'female' || gender == 'Female'){
				return 'F';
			}
		}
	}		
	})();
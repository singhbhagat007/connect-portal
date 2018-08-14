(function(){
	'use strict';
	angular
		.module('AkosPCP')
		.filter('findAgeFilter',findAgeFilter);
	function findAgeFilter(){
		return function(dob){
			var today = new Date();
			var birthDate = new Date(dob);
			var age = today.getFullYear() - birthDate.getFullYear();
			var m = today.getMonth() - birthDate.getMonth();
			if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    		{
        		age--;
    		}
    		if(isNaN(age)) return 0;
    		return age;
		}
	}		
	})();


	 
    
    
    
    
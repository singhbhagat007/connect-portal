(function(){
	'use strict';
	angular
		.module('AkosPCP')
		.filter('convertToSixDigitMRNFilter',convertToSixDigitMRNFilter);
	function convertToSixDigitMRNFilter(){
		return function(x){
			var len = x.toString().length;
			switch(len){
				case 1:
			    return '00000'+x;
			    break;
			  	case 2:
			    return '0000'+x;
			    break;
			  	case 3:
			    return '000'+x;
			    break;
			  	case 4:
			    return '00'+x;
			    break;
			  	case 5:
			    return '0'+x;
			    break;        
			}    
  		}
	}	
})();
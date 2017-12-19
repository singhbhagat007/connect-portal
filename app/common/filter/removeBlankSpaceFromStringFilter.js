(function(){
	'use strict';
	angular
		.module('AkosPCP')
		.filter('removeBlankSpaceFromStringFilter',removeBlankSpaceFromStringFilter);
	function removeBlankSpaceFromStringFilter(){
		return function(string){
			return string.replace(/ /g,'');
			
		}
	}	
	})();
(function(){
	'use strict';
	angular
		.module('AkosPCP')
		.filter('reverseArrayFilter',reverseArrayFilter);
	function reverseArrayFilter(){
		return function(items){
			return items.slice().reverse();  // throwing error -- slice() not a function
		}
	}		
	})();
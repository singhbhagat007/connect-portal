(function(){
	'use strict';
	angular
		.module('AkosPCP')
		.factory('tokenValidatorService',tokenValidatorService);
	tokenValidatorService.$inject = ['$http','$location','$log','config'];
	function tokenValidatorService($http,$location,$log,config){
		var tokenValid;
		return{
			setDocAuthToken : function(param){
				tokenValid = param;
			},
			getDocAuthToken : function(){
				return localStorage.getItem('doc_token');
				//return tokenValid;
			}
		}
	} 		
	})();
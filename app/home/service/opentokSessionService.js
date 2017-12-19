(function(){
	'use strict';
	angular
		.module('AkosPCP.home')
		.factory('opentokSessionService',opentokSessionService);

	opentokSessionService.$inject = ['$http','$location','$log','config'];	
	function opentokSessionService($http,$location,$log,config){
		return {
			getOpentokSession :function(){
			return $http.post(config.serverBaseUrl+'/getopentokkeys')
			.then(function(data){
				return data;
				})
			.catch(function(message) {
                    $log.log(message);
                });
			}
		}

		
    }	
})();

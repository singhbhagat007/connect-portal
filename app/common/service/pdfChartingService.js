(function(){
	'use strict';
	angular
		.module('AkosPCP')
		.factory('pdfChartingService',pdfChartingService);
	pdfChartingService.$inject = ['$http','$location','$log','config','tokenValidatorService'];	
	function pdfChartingService($http,$location,$log,config,tokenValidatorService){
		return {
			/* get patient details from patient id start */
			lockCallEncounter : function(param){
				return $http.put(config.serverBaseUrl+'/pcp/pcp_patientRecords/'+param.call_id,{body:param,headers:{Authorization_Token:tokenValidatorService.getDocAuthToken()}})
				.then(function(data){
					return data;
					})
				.catch(function(message){
					return message;
					})
			}
		}

	}

})();
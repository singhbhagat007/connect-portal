(function(){
	'use strict';
	angular
		.module('AkosPCP.doctor')
		.factory('doctorServices',doctorServices);
	doctorServices.$inject = ['$http','$location','$log','config','tokenValidatorService'];	
	function doctorServices($http,$location,$log,config,tokenValidatorService){
		var waitingUserId;
		return{
			/* get Billing CPT start */
			
			getCPTBilling : function(){
				var CPTBilling = [
				{
					'code':'99495',
					'description':'Communication (direct contact, telephone, electronic) with the patient and/or caregiver within two business days of discharge; medical decision making of at least moderate complexity during the service period; face-to-face visit within 14 calendar days of discharge.'
				},
				{
					'code':'99496',
					'description':'Communication (direct contact, telephone, electronic) with patient and/or caregiver within two business days of discharge; medical decision making of high complexity during the service period; face-to-face visit within seven calendar days of discharge.'

				}];
				return CPTBilling;
			},		
			/* get Billing CPT end */
			
			/* get ICD Code start */
			getICDService : function(param){
				return $http.post('https://clin-table-search.lhc.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms='+param.key)
				.then(function(data){
					return data;
					})
				.catch(function(message){
					return message;
					})

			},
			/*get ICD Code end */

			/* download PDF start */

			downloadPDF : function(param){
				
				return $http({
 				 	method:'POST',
 				 	url: 'https://akosmd.com/apitestserver/AZHomeCarePdfController',
 				 	data : $.param({'azdata':param}),
 				 	headers : {'Content-Type': "application/x-www-form-urlencoded"}
 				 	})
 					.then(function(data){
 						return data;
 						})
 					.catch(function(message){
 						return message;
 					})

				return $http.post('https://akosmd.com/apitestserver/AZHomeCarePdfController',param)
			},

			/* download PDF end */



			/* doctor login service start */
			doctorLogin : function(param){
 				return $http.post(config.serverBaseUrl+'/api/pcp/doctorLogin',param)
 				.then(function(data){
 					return data;
 					})
 				.catch(function(message){
 					return message;
 					});
 			},  /* doctor login service end */

 			/* update doc room alias service*/
			updateDocRoomAlias : function(param){
				return $http.post(config.serverBaseUrl+'/api/pcp/updateDocRoomAlias',{body:param,headers:{Authorization_Token:tokenValidatorService.getDocAuthToken()}})
				.then(function(data){
					return data;
					})
				.catch(function(message){
					return message;
					$log.log(message);
					})
			},  /* update doc room alias service end*/

			getWaitingUserList : function(param){
				return $http.post(config.serverBaseUrl+'/api/pcp/getWaitingUserList',{body:param,headers:{Authorization_Token:tokenValidatorService.getDocAuthToken()}})
				.then(function(data){
					return data;
					})
				.catch(function(message){
					return message;
					})
			},

			getWaitingUserListFromUserId : function(param){
				return $http.post(config.serverBaseUrl+'/api/pcp/getWaitingUserListFromUserId',{body:param,headers:{Authorization_Token:tokenValidatorService.getDocAuthToken()}})
				.then(function(data){
					return data;
					})
				.catch(function(message){
					return message;
					})
			},

			getUserCallDetails : function(param){
				return $http.post(config.serverBaseUrl+'/api/pcp/getUserCallDetails',{body:param,headers:{Authorization_Token:tokenValidatorService.getDocAuthToken()}})
				.then(function(data){
					return data;
					})
				.catch(function(message){
					return message;
					})
			},

			saveWaitingUserId : function(x){
				waitingUserId = x;
			},

			fetchWaitingUserId : function(){
				return waitingUserId;
			},
			deleteWaitingUser : function(param){
				return $http.post(config.serverBaseUrl+'/api/pcp/deleteWaitingUser',{body:param,headers:{Authorization_Token:tokenValidatorService.getDocAuthToken()}})
				.then(function(data){
					return data;
					})
				.catch(function(message){
					return message;
					})
			},

			/* doctor logout service*/
			logoutDoctor : function(param){
				return $http.post(config.serverBaseUrl+'/api/pcp/doctorLogout',{body:param,headers:{Authorization_Token:tokenValidatorService.getDocAuthToken()}})
				.then(function(data){
					return data;
					})
				.catch(function(message){
					return message;
					})
			}  /* doctor logout service end*/


		}
	}
})();
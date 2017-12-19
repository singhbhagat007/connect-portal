(function(){  
	'use strict';
	angular
		.module('AkosPCP.room')
		.factory('roomServices',roomServices);
	roomServices.$inject = ['$http','$location','$log','config'];	
	function roomServices($http,$location,$log,config){
		var userMeetingDetails;
		var userEnterDetails;
		
		return{

			getOpentokRoomKeys : function(param){
				return $http.post(config.serverBaseUrl+'/api/pcp/getOpentokRoomKeys',param)
				.then(function(data){
					return data;
					})
				.catch(function(data){
					return data;
					})
			},


			/* doctor login service start */
			checkPatientExists : function(param){ 
 				return $http.post(config.serverBaseUrl+'/api/pcp/patientexists',param)
 				.then(function(data){
 					return data;
 					})
 				.catch(function(message){
 					return message;
 					});
 			},  /* doctor login service end */

 			setUserEmailPhone: function(param){
 				userEnterDetails = param;
 			},

 			getUserEmailPhone : function(){
 				return userEnterDetails;
 			},

 			saveUserDetailsLocalstorage : function(param){
 				localStorage.setItem("userMeetingDetails",JSON.stringify(param));
 			},

 			getUserDetailsLocalstorage : function(){
 				return JSON.parse(localStorage.getItem("userMeetingDetails"));
 			},


 			setUserMeetingDetails : function(param){
 				userMeetingDetails = param;
 				localStorage.setItem("userMeetingDetails",JSON.stringify(param));
 			},

 			getUserMeetingDetails : function(){

 				return JSON.parse(localStorage.getItem("userMeetingDetails"));
 			},

 			getDocFromAlias : function(param){
 				return $http.post(config.serverBaseUrl+'/api/pcp/getDocFromAlias',param)
 				.then(function(data){
 					return data;
 					})
 				.catch(function(message){
 					return message;
 					})
 			},

 			addUserToWaiting : function(param){
 				return $http.post(config.serverBaseUrl+'/api/pcp/addUserToWaiting',param)
 				.then(function(data){
 					return data;
 					})
 				.catch(function(message){
 					return message;
 					})

 			},

 			



 			saveUserMeetingDetails : function(param){
 				return $http.post(config.serverBaseUrl+'/api/pcp/saveUserMeeting',param)
 				.then(function(data){
 					return data;
 					})
 				.catch(function(message){
 					return message;
 					})
 			},

 			getSavedUserId : function(param){
 				return $http.post(config.serverBaseUrl+'/api/pcp/getSavedUserId',param)
 				.then(function(data){
 					return data;
 					})
 				.catch(function(message){
 					return message;
 					})
 			},

 			searchMedications : function(param){
 				 return $http({
 				 	method:'POST',
 				 	url: 'https://akosmd.com/apitestserver/doctor/medicationquicksearch',
 				 	data : $.param({'searchString':param.searchString}),
 				 	headers : {'Content-Type': "application/x-www-form-urlencoded"}
 				 	})
 					.then(function(data){
 						return data;
 						})
 					.catch(function(message){
 						return message;
 					})
 			},

 			searcAllergies : function(param){
 				 return $http({
 				 	method:'POST',
 				 	url: 'https://akosmd.com/apitestserver/patient/allergysearch',
 				 	data : $.param({'searchTerm':param.searchTerm}),
 				 	headers : {'Content-Type': "application/x-www-form-urlencoded"}
 				 	})
 					.then(function(data){
 						return data;
 						})
 					.catch(function(message){
 						return message;
 					})
 			},




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
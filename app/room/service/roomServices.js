(function(){  
	'use strict';
	angular
		.module('AkosPCP.room')
		.factory('roomServices',roomServices);
	roomServices.$inject = ['$http','$location','$log','config'];	
	function roomServices($http,$location,$log,config){
		var userMeetingDetails;
		var userEnterDetails;
		var userMedication,userCondition,userAllergy,patientId;
		var docAlias;
		var docIdFromAlias,docNameFromAlias,docActiveStateFromAlias,docGroupIdFromAlias,thirdPartyDocData,groupcalltype;
		
		return{
			setgroupcalltype: function (x) {
                groupcalltype = x;
            },
            getgroupcalltype: function () {
                return groupcalltype;
            },
		    setThirdPartyDocData : function(x){
		        thirdPartyDocData = x;
		    },
		    getThirdPartyDocData : function(){
		        return thirdPartyDocData;
		    },
			saveDocNameFromAlias : function(x){
				docNameFromAlias = x;
			},
			getDocNameFromAlias : function(){
				return docNameFromAlias;
			},
             savePatientId: function (x) {
                patientId = x;
            },
            //add for patientId in case of connect url (07/23/2018)
            getPatientId: function () {
                return patientId;
            },
			saveDocIdFromAlias : function(x){
				docIdFromAlias = x;
			},
			getDocIdFromAlias : function(){
				return docIdFromAlias;
			},
			saveDocGroupIdFromAlias : function(x){
				docGroupIdFromAlias = x;
			},
			getDocGroupIdFromAlias : function(){
				return docGroupIdFromAlias;
			},

			saveDocActiveStateFromAlias : function(x){
				docActiveStateFromAlias = x;
			},

			getDocActiveStateFromAlias : function(){
				return docActiveStateFromAlias;
			},

			saveDocAlias : function(x){
				docAlias = x;		
			},

			getDocAlias : function(){
				return docAlias;
			},

			saveMedicationService : function(medications){
				userMedication = medications;	
			},

			getMedicationService : function(){
				return userMedication;
			},
			removeMedicationService : function(){
				userMedication = ['No Medications'];
			},

			saveConditionService : function(conditions){
				userCondition = conditions;
			},

			getConditionService : function(){
				return userCondition;
			},
			removeConditionService : function(){
				userCondition = ['No Pre-existing medical conditions'];
			},
			saveAllergyService : function(allergies){
				userAllergy = allergies;
			},

			getAllergyService : function(){
				return userAllergy;
			},
			removeAllergyService : function(){
				userAllergy = ['No Allergies'];
			},
			
			getOpentokRoomKeys : function(param){
				return $http.post(config.serverBaseUrl+'/api/pcp/getOpentokRoomKeys',param)
				.then(function(data){
					return data;
					})
				.catch(function(data){
					return data;
					})
			},
			
			sessiontokenapikey : function(){
			    return $http.get(config.serverBaseUrl+'/connect/sessiontokenapikey')
			    .then(function(data){
			        return data; 
			    })
			    .catch(function(message){
			        return message;
			    })
			},
			
			verifyThirdPartyDoc : function(x){
			    return $http.get(config.serverBaseUrl+'/connect/verifyThirdPartyDoc/'+x)
			    .then(function(data){
			        return data;
			    })
			    .catch(function(message){
			        return message;
			    })
			},
			
			updateThirdPartyDoc : function(params){
			    return $http.post(config.serverBaseUrl+'/connect/updateThirdPartyDoc/',params)
			    .then(function(data){
			        return data;
			    })
			    .catch(function(message){
			        return message;
			    })
			},
			
			checkPatientExists : function(param){ 
 				return $http.post(config.serverBaseUrl+'/api/pcp/patientexists',param)
 				.then(function(data){
 					return data;
 					})
 				.catch(function(message){
 					return message;
 					});
 			},

 			sendOTP : function(param){
 				return $http.post(config.serverBaseUrl+'/pcp/verification_code',param)
 				.then(function(data){
 					return data;
 					})
 				.catch(function(message){
 					return message;
 					})

 			}, 

 			verifyOTP : function(param){
 				return $http.get(config.serverBaseUrl+'/pcp/verification_code/'+param.otp+'/'+param.verifyValue)
 				.then(function(data){
 					return data;
 					})
 				.catch(function(message){
 					return message;
 					})
 			}, 

 			getProviderSetting : function(param){
 				return $http.get(config.serverBaseUrl+'/connect/providersettings/'+param.room)
 				.then(function(data){
 					return data;
 				})
 				.catch(function(message){
 					return message;
 					})
 			},

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
 			checkClientUrl : function(param){
 				return $http.post(config.serverBaseUrl+'/connect/validClientUrl',param)
 				.then(function(data){
 					return data;
 					})
 				.catch(function(message){
 					return message;
 					})
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

 			getSessionFromInviteId : function(param){
 				return $http.post(config.serverBaseUrl+'/api/pcp/getSessionFromInviteId',param)
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
 			sendPushNotificationStaffAdmin : function(params){
 			    return $http({
 			        method : 'POST',
 			        url: 'https://akosmd.com/apitestserver/ApplicationController/sendPushNotificationStaffAdmin',
 			        data : $.param(params),
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
			},  /* doctor logout service end*/
            setUserPatientdata : function(param){
 			    localStorage.setItem("userPatientData",JSON.stringify(param));
 			},
 			getUserPatientData : function(){
 				return JSON.parse(localStorage.getItem("userPatientData"));
 			},

        //add for geter seter for save data in local(07072018)
            getUsersymptomlocalstorage : function () {
                return JSON.parse(localStorage.getItem("userSymptomDetails"));
                },
            //add for geter seter for save data in local (07072018)
            saveUsersymptomlocalstorage: function (param) {
                localStorage.setItem("userSymptomDetails", JSON.stringify(param));
            },
             //add for geter seter for save callid in local (07072018)
            getPatientCallIdlocalstorage: function () {
                return JSON.parse(localStorage.getItem("patientCallId"));
            },
             //add for geter seter for save callid in local (07072018)
            savePatientCallIdlocalstorage: function (param) {
                localStorage.setItem("patientCallId", JSON.stringify(param));
            },
                   //update data based on callid(07132018)
           updatedatabycallid: function (param) {
               return $http.post(config.serverBaseUrl + '/api/pcp/updatedataBycallId', param)
                    .then(function (data) {
                        return data;
                    })
                    .catch(function (message) {
                        return message;
                    })
            },
            //update doctorId based on callid (07132018)
            updatedoctoridbycallid: function (param) {
                return $http.post(config.serverBaseUrl + '/api/pcp/updateDoctorIdBycallId', param)
                    .then(function (data) {
                        return data;
                    })
                    .catch(function (message) {
                        return message;
                    })
            },
		
		 //entry for generate call id by patient id(07142018)
            generatecallidbypatientid: function (param) {
                return $http.post(config.serverBaseUrl + '/api/pcp/generateCallIdByPatientId', param)
                    .then(function (data) {
                        return data;
                    })
                    .catch(function (message) {
                        return message;
                    })
            },
            //entry for generate call id by patient id(07142018) not conform required one time check
            saveUserMeetingDetailsByEmail: function (param) {
                return $http.post(config.serverBaseUrl + '/api/pcp/saveUserMeetingEmail', param)
                    .then(function (data) {
                        return data;
                    })
                    .catch(function (message) {
                        return message;
                    })
            },
            //used for dynamic checking form (7/20/2018)
            dynamicchakingformfield: function (param) {
                
                return $http.get(config.serverBaseUrl + '/patient/checkin/form/' + param)
                    .then(function (data) {
                        return data;
                    })
                    .catch(function (message) {
                        return message;
                    })
            },
            //add for get url(07/24/2018)
            getUserConnectUrlstorage: function () {
                return JSON.parse(localStorage.getItem("ConnectUrl"));
              
            },
            checkPatientExistsemailphone: function (param) {
               return $http.post(config.serverBaseUrl+'/api/pcp/patientexistsemailphone', param)
                   .then(function (data) {
                       return data;
                   })
                   .catch(function (message) {
                       return message;
                   })
           },
           checkConnectCallBycallId: function (param) {//added on 230818
                return $http.post(config.serverBaseUrl + '/api/pcp/checkConnectCallBycallId', param)
                    .then(function (data) {
                        return data;
                    })
                    .catch(function (message) {
                        return message;
                    })
            },
			checkstatusinwatingroom: function (param) {
                return $http.post(config.serverBaseUrl + '/api/pcp/checkstatusinwatingroom', param)
                    .then(function (data) {
                        return data;
                    })
                    .catch(function (message) {
                        return message;
                    })
            }

		}
	}
})();
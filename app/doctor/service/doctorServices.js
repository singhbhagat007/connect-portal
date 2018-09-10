(function(){
	'use strict';
	angular
		.module('AkosPCP.doctor')
		.factory('doctorServices',doctorServices);
	doctorServices.$inject = ['$http','$location','$log','config','tokenValidatorService'];	
	function doctorServices($http,$location,$log,config,tokenValidatorService){
		var waitingUserId,callStartedAt,callEndedAt,patientCallLog,callId,docArchiveId,inviteUrl;
		return{

			saveCallId : function(x){
				callId = x;
			},

			getCallId : function(x){ 
				return callId;
			},

			updatePatientCallLog : function(){
				patientCallLog.is_call_locked = 1;
			},
			
			savePatientCallLog : function(x){
				patientCallLog = x;	
			},
			
			getPatientCallLog : function(x){
				return patientCallLog;	
			},
			
			saveCallStartedAt : function(x){
				callStartedAt = x;
			},
			
			saveCallEndedAt : function(x){
				callEndedAt = x;
			},

			startCallArchive : function(x){
				return $http.get(config.serverBaseUrl+'/connect/getArchiveId/'+x)
 				.then(function(data){
 					return data;
 					})
 				.catch(function(message){
 					return message;
 					});
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

			setDocArchiveId : function(x){
				docArchiveId = x;	
			},

			getDocArchiveId : function(){
				return docArchiveId;	
			}, 


			stopDoctorArchive : function(param){
				return $http.post(config.serverBaseUrl+'/connect/stopDoctorArchive/',param)
				.then(function(result){
					return result;
				})
				.catch(function(message){
					return message;
				})
			},

			/*---ab---stop recording implementation---(200618)*/
			stopDoctorCallRecording : function(paramData){
				var param = {'archiveId':paramData};
				return $http.post(config.serverBaseUrl+'/connect/stopDoctorCallRecording/',param)
				.then(function(result){
					return result;
				})
				.catch(function(message){
					return message;
				})
			},
			/*------------------------------------------------*/
			
			
			
            doctorAvailableUnavailable : function(){
                return $http.get(config.serverBaseUrl+'/connect/doctorAvailableUnavailable')
                .then(function(result){
                    return result;
                })
                .catch(function(message){
                    return message;
                })
            },
			

			/* fetch call started at start */
			getCallStartedAt : function(x){
				return callStartedAt;
			},
			/* fetch call started at end */

			/* fetch call ended at start */
			getCallEndedAt : function(x){
				return callEndedAt;
			},
			/* fetch call ended at end */

			/* get Billing CPT start */
			getCPTBilling : function(){
				return $http.post('https://akosmd.com/apitestserver/cptcodes')
				.then(function(data){
					return data;
				})
				.catch(function(message){
					return message;
				})

				// var CPTBilling = [
				// {
				// 	'code':'99495',
				// 	'description':'Communication (direct contact, telephone, electronic) with the patient and/or caregiver within two business days of discharge; medical decision making of at least moderate complexity during the service period; face-to-face visit within 14 calendar days of discharge.'
				// },
				// {
				// 	'code':'99496',
				// 	'description':'Communication (direct contact, telephone, electronic) with patient and/or caregiver within two business days of discharge; medical decision making of high complexity during the service period; face-to-face visit within seven calendar days of discharge.'

				// }];
				// return CPTBilling;
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
 				 	url: 'https://akosmd.com/apitestserver/AZHomeCarePdfController/PCPPdf', 
 				 	data : $.param({'azdata':param}),
 				 	headers : {'Content-Type': "application/x-www-form-urlencoded"}
 				 	})
 					.then(function(data){
 						return data;
 						})
 					.catch(function(message){
 						return message;
 					})
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

 			getProviderSetting : function(x){
 				return $http.get(config.serverBaseUrl+'/connect/providersettings/'+x)
 				.then(function(data){
 					return data;
 					})
 				.catch(function(message){
 					return message;
 					});
 			},  
 			getRoomFromGroupId : function(x){
 				return $http.get(config.serverBaseUrl+'/connect/providerGroup/'+x,{headers:{Authorization_Token:tokenValidatorService.getDocAuthToken()}})
 				.then(function(data){
 					return data;
 				})
 				.catch(function(message){

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

			

			getSessionFromInvite : function(param){
				return $http.post(config.serverBaseUrl+'/api/pcp/invite',{body:param,headers:{Authorization_Token:tokenValidatorService.getDocAuthToken()}})
				.then(function(data){
					return data;
					})
				.catch(function(message){
					return message;
					})
			},

			sendEmailMeetingLink : function(param){
				return $http.post(config.serverBaseUrl+'/api/pcp/emailRoomLink',{body:param,headers:{Authorization_Token:tokenValidatorService.getDocAuthToken()}})
				.then(function(data){
					return data;
					})
				.catch(function(message){
					return message;
					})
			},

			sendSMSMeetingLink : function(param){
				return $http.post(config.serverBaseUrl+'/api/pcp/SMSlRoomLink',{body:param,headers:{Authorization_Token:tokenValidatorService.getDocAuthToken()}})
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
			makeCallRecord : function(param){
				return $http.post(config.serverBaseUrl+'/pcp/pcp_patientRecords',{body:param,headers:{Authorization_Token:tokenValidatorService.getDocAuthToken()}})
				.then(function(data){
					return data;
					})
				.catch(function(message){
					return message;
					})
			},
			
			sendWCStaffNotification : function(param){
			    return $http.post(config.serverBaseUrl+'/connect/sendWCStaffNotification',{body:param,headers:{Authorization_Token:tokenValidatorService.getDocAuthToken()}})
				.then(function(data){
					return data;
					})
				.catch(function(message){
					return message;
					})
			},

			/* get doctor call log service start */
			
			getDocCallLogData : function(doctorId){
				return $http.get(config.serverBaseUrl+'/pcp/pcp_patientRecords/'+doctorId,{headers:{Authorization_Token:tokenValidatorService.getDocAuthToken()}})
				.then(function(data){
					return data;
					})
				.catch(function(message){
					return message;
					})
			},

			/* get user and pass of provider from token */ 


			getUserPassProvider : function(token){
				return $http.get(config.serverBaseUrl+'/connect/connectProvider/'+token)
				.then(function(data){
					return data;
					})
				.catch(function(message){
					return message;
					})
			},

			/* get doctor call log service end */

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

			/* pankaj */

			connectAdvinowSaml : function(param){
                return $http.post(config.serverBaseUrl+'/advinow/SAML/sso_login',param)
				.then(function(data){
					return data;
					})
				.catch(function(message){
					return message;
					})
			},
            
			//add for notify by email and sms
            setInviteUrl: function (x) {
                inviteUrl = x;
            },
            getInviteUrl: function () {
                return inviteUrl;
            },


			/* ab---plivo make call---(030718)*/
			plivoMakeCall : function(param){
				/*return $http.post(config.serverBaseUrl+'/plivo/make-new-call',{body:param,headers:{'Content-Type': "application/x-www-form-urlencoded"}})
				.then(function(data){
					return data;
					})
				.catch(function(message){
					return message;
					})*/
                    console.log(param);
					return $http({
 				 	method:'POST',
 				 	url:'https://akosmd.com:3001'+'/plivo/make-new-call', 
 				 	data : $.param({'callSessionId':param.callSessionId, 'destNumber':param.destNumber, 'roomId':param.roomId, 'token':param.token}),
 				 	headers : {'Content-Type': "application/x-www-form-urlencoded"}
 				 	})
 					.then(function(data){
 						return data;
 						})
 					.catch(function(message){
 						return message;
 					})
			},
			/*ab---plivo make call ends here*/
			/*ab---set plivo call details into local storage---(270718)*/
			/*savePlivoCallDetailsLocalstorage : function(param){
 				localStorage.setItem("plivoCallData",JSON.stringify(param));
 			},

 			getPlivoCallDetailsLocalstorage : function(){
 				return JSON.parse(localStorage.getItem("plivoCallData"));
 			}*/
			/*---------------------------------------------------------*/
            //(08/2/2018) for update status by  call id
            updatestatusBycallId: function (param) {
                return $http.post(config.serverBaseUrl + '/api/pcp/updatestatusBycallId', param)
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

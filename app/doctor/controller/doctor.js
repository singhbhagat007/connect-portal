(function() {   
    'use strict';   
    angular
        .module('AkosPCP.doctor')
        .controller('DoctorCtrl', DoctorCtrl);
    DoctorCtrl.$inject = ['$scope','$http','$rootScope','$location','$window','$log','doctorServices','tokenValidatorService','$cookieStore','$state','$uibModal','moment','config','socketService'];
    function DoctorCtrl($scope,$http,$rootScope,$location,$window,$log,doctorServices,tokenValidatorService,$cookieStore,$state,$uibModal,moment,config,socketService) {
        $log.log($location);
        //var vm = this;
        $rootScope.title = "See Your Doctor"; 



        // on doc side: - doc get msg ---> .on()
        //on patient side : -- patient send msg --> /emit()
        //socketService.connect();
        

        /* login controller start*/
        $scope.loginData = {};
        $scope.loginForm = function(){
            $scope.loading = true;
            $scope.loginData;
            doctorServices.doctorLogin($scope.loginData)
            .then(function(result){
                if(result.data.status_code == 200){
                    $scope.loading = false;
                    localStorage.setItem('doc_token',result.data.result.token);
                    localStorage.setItem('pcpDocData',JSON.stringify(result.data.result));
                    $rootScope.docData = JSON.parse(localStorage.getItem('pcpDocData'));//$cookieStore.get('pcpDocData')
                    tokenValidatorService.setDocAuthToken(result.data.result.token); 
                    //$location.path('/doctor'); 
                    $state.go('doctor');
                }else{
                    $scope.loading = false;
                    alert("error");
                    return false;
                }
                
                });
        }
        /* login controller end*/
        
        /* doctor dashboard controller */
        if(localStorage.getItem('doc_token') && $state.current.name == 'doctor'){
            //$scope.userWaitingList = {};
            socketService.on('userjoin', function(waitingId){
            	$('body').after('<audio controls autoplay  style="display: none;"><source src="https://akosmd.com/test/seeyourdoc/assets/audio/notification48.mp3" type="audio/mp3"></audio>');
            	$scope.waitingParam = {};
                $scope.waitingParam.pcp_doctor_id = $scope.docData.id;
                $scope.waitingParam.patient_id = waitingId; 
                doctorServices.getWaitingUserListFromUserId($scope.waitingParam)
                .then(function(result){
                    if(result.data.status_code == 200){
                    	var index = $scope.userWaitingList.indexOf(result.data.result[0].patient_id);
                    	
                    	if(index == -1){
                    		$scope.userWaitingList.push(result.data.result[0]);	
                    		toastr.info( result.data.result[0].first_name+ ' has checked In');
                    	}else{
                    		$scope.userWaitingList.splice(index,1);
                    		$scope.userWaitingList.push(result.data.result[0]);	
                    		//toastr.info( result.data.result[0].first_name+ ' has checked In');
                    	}
                    }else{
                            alert("error");
                        }
                    
                    });    
            });

            // socketService.on('userleft', function(data){

            //     if($scope.userWaitingList.length >= 1){
            //         toastr.info(data.name+ ' has left');
            //         var index = $scope.userWaitingList.indexOf(data.waitingId);
            //         if(index == -1){
            //             $scope.userWaitingList.splice(index,1);
            //         }    
            //     }




            //     });

            $rootScope.title = "Dashboard";
            $scope.docData = JSON.parse(localStorage.getItem('pcpDocData'));
            if($scope.docData.room_alias != ''){
                $scope.docData.room = $scope.docData.room_alias;
            }
            
            $scope.editDocRoomAlias = function(){
                $scope.isToggled = 1;
            }
            $scope.saveDocRoomAlias = function(alias,docId){
                if(alias == ''){
                    alert("error");
                    return false;
                }
                $scope.loading = true;
                $scope.param = {};
                $scope.param.id = docId;
                $scope.param.room_alias = alias;
                doctorServices.updateDocRoomAlias($scope.param)
                .then(function(result){
                    if(result.data.status_code == 200){
                        $scope.loading = false;
                        $scope.docData = JSON.parse(localStorage.getItem('pcpDocData'));
                        $scope.docData.room_alias = alias;
                        localStorage.setItem('pcpDocData',JSON.stringify($scope.docData));
                        $scope.docData = JSON.parse(localStorage.getItem('pcpDocData'));
                        $scope.docData.room = $scope.docData.room_alias;
                        $scope.isToggled = 0;
                    }else{
                        $scope.loading = false;
                        alert("error");
                        return false;
                    }
                    });
            }
            $scope.canceltDocRoomAlias = function(){
                $scope.isToggled = 0;   
            }

            $scope.getWaitingUserList = function(){
                $scope.param = {};
                $scope.param.id = $scope.docData.id;
                doctorServices.getWaitingUserList($scope.param)
                .then(function(result){
                    if(result.data.status_code == 200){
                        $scope.userWaitingList = result.data.result;
                    }else{
                        alert(error);
                    }
                    })
            }
            $scope.getWaitingUserList();

            $scope.docCall = function(x){
                doctorServices.saveWaitingUserId(x);
                $state.go('doctor.call');
            }

        }
        /* doctor dashboard controller end*/     

        /* doctor call controller start*/     
        if(localStorage.getItem('doc_token') && $state.current.name == 'doctor.call'){

            

            $rootScope.title = "Live Call";
            $scope.waitingUserId = doctorServices.fetchWaitingUserId();
            $scope.param = {};
            $scope.param.id = $scope.waitingUserId;
            doctorServices.getUserCallDetails($scope.param)
            .then(function(result){
                if(result.data.status_code == 200){
                    $scope.userCallDetails = result.data.result[0];
                    var session = OT.initSession(config.opentokAPIKey,$scope.userCallDetails.session);
                    var subscriber;
                    session.on('streamCreated', function(event) {
                        session.subscribe(event.stream, 'subscriber', {
                                    insertMode: 'append',
                                    width: '100%',
                                    height: '100%'
                                });
                        });
                    session.on('sessionDisconnected', function(event) {
                                console.log('You were disconnected from the session.', event.reason);
                        });
                    session.connect($scope.userCallDetails.token, function(error) {
                                if (!error) {
                                    var publisherProperties = {name:"publisher"};
                                    var publisher = OT.initPublisher('publisher',publisherProperties, {
                                        resolution: '320x240', 
                                        frameRate: 1
                                    });
                                    session.publish(publisher);  
                                } else {
                                    console.log('There was an error connecting to the session: ', error.code, error.message);
                                }
                        });

                    socketService.on('callDisconnectedByDoc', function(data){

                    	$scope.disconnectedData = {};
                        $scope.disconnectedData.waitingUserId = $scope.waitingUserId;
                        $scope.disconnectedData.session = session;

                    	 var modalInstance = $uibModal.open({
                                templateUrl: "CallDisconnectedPatient.html",
                                controller: ModalInstanceCtrl,
                                scope: $scope,
                                size:'sm',
                                windowClass: 'disconnect-pop1-class',
                                resolve: {
                                    modalProgressValue: function () {
                                    return "";
                                    },
                                    CPTBilling : function(){
                                        return "";
                                    },
                                    sessionResolve : function(){
                                        return $scope.disconnectedData;
                                    }
                                }

                            });
                            modalInstance.result.then(function (selectedItem) {
                                $scope.selected = selectedItem;
                                }, function () {
                                $log.info('Modal dismissed at: ' + new Date());
                            }); 
                		
                	});



                    $scope.disconnectSession = function(){

                        $scope.disconnectedData = {};
                        $scope.disconnectedData.waitingUserId = $scope.waitingUserId;
                        $scope.disconnectedData.session = session;
                        
                        var modalInstance = $uibModal.open({
                                templateUrl: "CallDisconnectedPop1.html",
                                controller: ModalInstanceCtrl,
                                scope: $scope,
                                size:'sm',
                                windowClass: 'disconnect-pop1-class',
                                resolve: {
                                    modalProgressValue: function () {
                                    return "";
                                    },
                                    CPTBilling : function(){
                                        return "";
                                    },
                                    sessionResolve : function(){
                                        return $scope.disconnectedData;
                                    }
                                }

                            });
                            modalInstance.result.then(function (selectedItem) {
                                $scope.selected = selectedItem;
                                }, function () {
                                $log.info('Modal dismissed at: ' + new Date());
                            });    

                    }



                    // $scope.disconnectSession = function(){
                    

                            
                
                    //         var modalInstance = $uibModal.open({
                    //             templateUrl: "CallDisconnectedPop1.html",
                    //             controller: ModalInstanceCtrl,
                    //             scope: $scope,
                    //             size:'sm',
                    //             resolve: {
                    //                 modalProgressValue: function () {
                    //                 return "";
                    //                 },
                    //                 CPTBilling : function(){
                    //                     return "";
                    //                 }
                    //             }

                    //         });
                    //         modalInstance.result.then(function (selectedItem) {
                    //             $scope.selected = selectedItem;
                    //             }, function () {
                    //             $log.info('Modal dismissed at: ' + new Date());
                    //         });    







                    //     // session.disconnect();
                    //     // $scope.deleteUserParam = {};
                    //     // $scope.deleteUserParam.patient_id = $scope.waitingUserId;
                    //     // doctorServices.deleteWaitingUser($scope.deleteUserParam)
                    //     // .then(function(result){
                    //     //     $log.log(result);
                    //     //     })
                    //     // $state.go('doctor');
                    // }
                }else{
                    alert("error");
                }
                })


            





            $scope.progressArray = {};

            $scope.removeDialogText = function(x){
                switch(x){
                    case 1:
                    $scope.progressArray.chiefComplaints = '';
                    break;
                    case 2:
                    $scope.progressArray.hpi = '';
                    break;
                    case 3:
                    $scope.progressArray.pastMedicalHistory = '';
                    break;
                    case 4:
                    $scope.progressArray.pastSurgicalHistory = '';
                    break;
                    case 5:
                    $scope.progressArray.socialHistory = '';
                    break;
                    case 6:
                    $scope.progressArray.familyHistory = '';
                    break;
                    case 7:
                    $scope.progressArray.reviewsOfSystemsvalue = '';
                    break;
                    case 8:
                    $scope.progressArray.physicalExam = '';
                    break;
                    case 9:
                    $scope.progressArray.labs = '';
                    break;
                    case 10:
                    $scope.progressArray.imaging = '';
                    break;
                    case 11:
                    $scope.progressArray.otherStudies = '';
                    break;
                    case 12:
                    $scope.progressArray.assesment = '';
                    break;
                    case 13:
                    $scope.progressArray.planOfCare = '';
                    break;
                    case 14:
                    $scope.progressArray.followUp = '';
                    break;

                }
            }

            $scope.downloadPDF = function(data,ICD,CPT){

                $scope.loading = true;
                $scope.progressNotePDFArray = data;
                $scope.progressNotePDFArray.doctorFirstName = " John";
                $scope.progressNotePDFArray.doctorLastName = "Ticks";
                $scope.progressNotePDFArray.diagnosticAssesment =  ICD;
                $scope.progressNotePDFArray.az_cpt_code =  CPT;
                
                $scope.progressNotePDFArray = JSON.stringify(
                    {
                        first_name : "test",
                        last_name:"test",
                        gender:"test",
                        email:"test",
                        address1:"test",
                        address2:"test",
                        phone:"test",
                        city:"test",
                        state:"test",
                        zip_code:"test",
                        dateofbirth:"1994-10-24",
                        age:"24",
                        call_started : "2017-12-14 11:57:58",
                        'doctor_instruction':JSON.stringify($scope.progressNotePDFArray)
                    });
                var data = $scope.progressNotePDFArray;
                doctorServices.downloadPDF(data)
                .then(function(result){
                    var file_path = result.data; 
                    var a = document.createElement('A');
                    a.href = file_path;
                    a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    $scope.loading = false;
                    })
            }


            $scope.ICDArray = {};    
            $scope.addeddiagnosisArray = [];
            $scope.searchgenerateICD = function(){
                $scope.param ={};
                $scope.param.key = $('#searchICDText').val();
                if($('#searchICDText').val().length >= 3){
                    $scope.loading = true;
                    doctorServices.getICDService($scope.param)
                    .then(function(result){
                        $scope.loading = false;
                        $scope.ICDArray = result.data[3];
                    })    
                }else{
                    $scope.ICDArray = {};
                }
            }

            $scope.adddiagnosis = function(a,b){
                $scope.ICDArray = {};
                $scope.addeddiagnosisArray.push({"icdCode":a,"description":b});        
            }


            $scope.CPTArray = [];
            $scope.removeSelectedCptBilling = function(x){
                var index = $scope.CPTArray.indexOf(x);
                if(index != -1){
                    $scope.CPTArray.splice(x,1);
                } 
            }
            $scope.selectCPT = function(){
                
                var modalInstance = $uibModal.open({
                    templateUrl: "CPTProgressNoteModal.html",
                    controller: ModalInstanceCtrl,
                    scope: $scope,
                    size:'sm',
                    resolve: {
                        modalProgressValue: function () {
                        return "";
                        },
                        CPTBilling : function(){
                            return doctorServices.getCPTBilling();
                        },
                        sessionResolve : function(){
                            return '';
                        }
                    }

                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                    }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });    

            }
            
            $scope.openProgressModal = function(a,b){
                $scope.returningValue = {};
                $scope.returningValue.head = a;
                $scope.returningValue.value = (angular.isUndefined(b)? "": b);


                var modalInstance = $uibModal.open({
                    templateUrl: "progressNoteModal.html",
                    controller: ModalInstanceCtrl,
                    scope: $scope,
                    size:'sm',
                    resolve: {
                        modalProgressValue: function () {
                        return $scope.returningValue;
                        },
                        CPTBilling : function(){
                            return '';
                        },
                        sessionResolve : function(){
                            return '';
                        }
                    }

                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                    }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });    

            }

            $scope.lockEncounter = function(){

                var modalInstance = $uibModal.open({
                    templateUrl: "progressNoteLockModal.html",
                    controller: ModalInstanceCtrl,
                    scope: $scope,
                    size:'sm',
                    resolve: {
                        modalProgressValue: function () {
                        return "";
                        },
                        CPTBilling : function(){
                            return '';
                        },
                        sessionResolve : function(){
                            return '';
                        }
                    }

                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                    }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

            }
        }/* doctor call controller end*/     

        /* doctor logout controller */
        $rootScope.logoutDoctor = function(){
            $scope.loading = true;
            $scope.param ={};
            $scope.param.id =  JSON.parse(localStorage.getItem('pcpDocData')).id;//$cookieStore.get('pcpDocData').id;
            doctorServices.logoutDoctor($scope.param)
            .then(function(result){
                $log.log(result);
                if(result.data.status_code == 200){
                    $scope.loading = false;
                    localStorage.removeItem('pcpDocData');//$cookieStore.remove('pcpDocData');
                    localStorage.removeItem('doc_token');
                    $rootScope.isLoggedIn = false;
                    $location.path('/');
                }else{
                    $scope.loading = false;
                    alert("error");
                    return false;
                }
                
                })
        }/* doctor logout controller end*/  
    }

var ModalInstanceCtrl = function ($scope,$rootScope, $uibModalInstance,modalProgressValue,CPTBilling,$uibModal,socketService,$log,$state,sessionResolve,doctorServices) {

    


    $scope.callDisconnect = function(){
    	$rootScope.callDisconnectByPat = 1;
        sessionResolve.session.disconnect();
        $scope.deleteUserParam = {};
        $scope.deleteUserParam.patient_id = sessionResolve.waitingUserId;
        doctorServices.deleteWaitingUser($scope.deleteUserParam)
        .then(function(result){
            $log.log(result);
        })

        $uibModalInstance.dismiss('cancel');
        var modalInstance = $uibModal.open({
                    templateUrl: "CallDisconnectedPop2.html",
                    controller: ModalInstanceCtrl,
                    scope: $rootScope,
                    size:'sm',
                    resolve: {
                        modalProgressValue: function () {
                        return "";
                        },
                        CPTBilling : function(){
                            return '';
                        },
                        sessionResolve : function(){
                            return '';
                        }
                    }

                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                    }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
    }

    $rootScope.callSuccess = function(){
        
        if($rootScope.callDisconnectByPat != 1){
        
        	socketService.emit('callDisconnectedByDoc',{waitingId:"test"},function(data){
	            $log.log("call end");
	            $log.log(data);
        	});    

        	

        }


        


        // socketService.emit('callDisconnectedByDoc',{waitingId:$scope.userFetchedId},function(data){
        //     $log.log("user added");
        //     $log.log(data);
        // });



        $uibModalInstance.dismiss('cancel');
        $state.go('doctor');


    }



    
    if(CPTBilling != ''){
        $scope.cptBilling = CPTBilling;
    }
    $scope.selectedCPTCode = function(a,b){
        
        if(a == true){
            $scope.CPTArray.push(b);    
        }else if(a == false){
            var index = $scope.CPTArray.indexOf(b);
            $scope.CPTArray.splice(index,1);
        }
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        
    };

    switch(modalProgressValue.head){
        case 1: 
        $scope.modalHead = "Chief Complaints";
        $scope.modalInputValue = modalProgressValue.value;     
        break;
        case 2: 
        $scope.modalHead = "History of Present Illness (HPI)";
        $scope.modalInputValue = modalProgressValue.value;     
        break;
        case 3: 
        $scope.modalHead = "Past Medical History";
        $scope.modalInputValue = modalProgressValue.value;     
        break;
        case 4: 
        $scope.modalHead = "Past Surgical History";
        $scope.modalInputValue = modalProgressValue.value;     
        break;
        case 5: 
        $scope.modalHead = "Social History";
        $scope.modalInputValue = modalProgressValue.value;     
        break;
        case 6: 
        $scope.modalHead = "Family History";
        $scope.modalInputValue = modalProgressValue.value;     
        break;
        case 7: 
        $scope.modalHead = "Review of systems";
        $scope.modalInputValue = modalProgressValue.value;     
        break;
        case 8: 
        $scope.modalHead = "Physical Exam";
        $scope.modalInputValue = modalProgressValue.value;     
        break;
        case 9: 
        $scope.modalHead = "Labs";
        $scope.modalInputValue = modalProgressValue.value;     
        break;
        case 10: 
        $scope.modalHead = "Imaging";
        $scope.modalInputValue = modalProgressValue.value;     
        break;
        case 11: 
        $scope.modalHead = "Other Studies";
        $scope.modalInputValue = modalProgressValue.value;     
        break;
        case 12: 
        $scope.modalHead = "Assesment";
        $scope.modalInputValue = modalProgressValue.value;     
        break;
        case 13: 
        $scope.modalHead = "Plan of Care";
        $scope.modalInputValue = modalProgressValue.value;     
        break;
        case 14: 
        $scope.modalHead = "Follow Up";
        $scope.modalInputValue = modalProgressValue.value;     
        break;
    }

    $scope.saveProgressNote = function(x){

        switch(modalProgressValue.head){
        case 1: 
        $scope.progressArray.chiefComplaints = x;
        break;
        case 2: 
        $scope.progressArray.hpi = x;
        break;
        case 3: 
        $scope.progressArray.pastMedicalHistory = x;
        break;
        case 4: 
        $scope.progressArray.pastSurgicalHistory = x;
        break;
        case 5: 
        $scope.progressArray.socialHistory = x;
        break;
        case 6: 
        $scope.progressArray.familyHistory = x;
        break;
        case 7: 
        $scope.progressArray.reviewsOfSystemsvalue = x;
        break;
        case 8: 
        $scope.progressArray.physicalExam = x;
        break;
        case 9: 
        $scope.progressArray.labs = x;
        break;
        case 10: 
        $scope.progressArray.imaging = x;
        break;
        case 11: 
        $scope.progressArray.otherStudies = x;
        break;
        case 12: 
        $scope.progressArray.assesment = x;
        break;
        case 13: 
        $scope.progressArray.planOfCare = x;
        break;
        case 14: 
        $scope.progressArray.followUp = x;
        break;
    }        

    $uibModalInstance.dismiss('cancel');
    }

}


})();
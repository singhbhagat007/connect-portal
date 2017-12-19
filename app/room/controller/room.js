(function() {   
    'use strict';  
    angular
        .module('AkosPCP.room')
        .controller('RoomCtrl', RoomCtrl); 
    RoomCtrl.$inject = ['$scope','$http','$rootScope','$location','$window','$log','tokenValidatorService','$cookieStore','$state','$uibModal','moment','$stateParams','roomServices','getSymptomsService','$filter','config','socketService'];
    function RoomCtrl($scope,$http,$rootScope,$location,$window,$log,tokenValidatorService,$cookieStore,$state,$uibModal,moment,$stateParams,roomServices,getSymptomsService,$filter,config,socketService) {
        $log.log($location.search().id);
        $rootScope.isPatient = true;
        // var vm = this;
        // vm.title = "Room";
        $rootScope.title = "Patient";
        
        $scope.usStates = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

        $scope.dataParam = {};
        $scope.dataParam.alias = $state.params.id;
        roomServices.getDocFromAlias($scope.dataParam)
        .then(function(result){
            if(result.data.status_code == 200){
                $scope.docNameFromAlias = result.data.result[0].name;
                $scope.docIdFromAlias = result.data.result[0].id;
                }else{
                    alert("error");
                }
            })




        if($state.current.name == 'room'){
            localStorage.setItem('userMeetingDetails','');

            $scope.isvalidNumber = function(useremailphone){
                return $filter('isTenDigitNumberFilter')(useremailphone);
            }

            $scope.isValidEmail = function(useremailphone){
                
                return $filter('isValidEmailFilter')(useremailphone);
            }

            if(roomServices.getUserEmailPhone() != undefined){
                $scope.useremailphone  = roomServices.getUserEmailPhone().value;    
            }
            

            $scope.enterRoomForm = function(useremailphone){

            if($scope.isvalidNumber(useremailphone)){
                $scope.userEnterDetails = {};
                $scope.userEnterDetails.type = "phone";
                $scope.userEnterDetails.value = useremailphone;
                roomServices.setUserEmailPhone($scope.userEnterDetails);    
            }else if($scope.isValidEmail(useremailphone)){
                $scope.userEnterDetails = {};
                $scope.userEnterDetails.type = "email";
                $scope.userEnterDetails.value = useremailphone;
                roomServices.setUserEmailPhone($scope.userEnterDetails);    
            }    

            $scope.loading = true;
            $scope.param = {};
            $scope.param.emailphone = useremailphone;
            roomServices.checkPatientExists($scope.param)
            .then(function(result){
                if(result.data.status_code == 200){
                    $scope.loading = false;
                    roomServices.setUserMeetingDetails(result.data.result[0]);
                }else{
                    $scope.loading = false;
                    localStorage.setItem('userMeetingDetails','');
                    //localStorage.removeItem('userMeetingDetails');
                }
                $state.go('room.user');         
                });
            
            }
        
        }

        


        if($state.current.name == 'room.user'){
            $scope.userMeetingDetails = {};
            if(localStorage.getItem('userMeetingDetails') != ''){
                $scope.userMeetingDetails = JSON.parse(localStorage.getItem('userMeetingDetails'));    
                $scope.userMeetingDetails.dateofbirth = new Date($scope.userMeetingDetails.dateofbirth);
                if($scope.userMeetingDetails.state.length == 2){
                    $scope.userMeetingDetails.state = $filter('convertStateToCapitalFormFilter')($scope.userMeetingDetails.state);    
                }
                



            }
            $scope.userEnterDetails  = roomServices.getUserEmailPhone();
            if($scope.userEnterDetails != undefined){
                if($scope.userEnterDetails.type == 'phone'){
                    $scope.userMeetingDetails.phone = $scope.userEnterDetails.value;    
                }else if($scope.userEnterDetails.type == 'email'){
                    $scope.userMeetingDetails.email = $scope.userEnterDetails.value;    
                }    
            }

               

            $scope.userDetailsForm = function(userMeetingDetails){
                $scope.param = {};
                if(userMeetingDetails.id != undefined){
                    $scope.param.id = userMeetingDetails.id;
                }
                $scope.param = userMeetingDetails;
                roomServices.saveUserDetailsLocalstorage($scope.param);
                $state.go('room.medicalHistory');
            }
            $scope.exitUserMeeting = function(){
                $state.go('room');
            }
            
               

            //$scope.userMeetingDetails.date_of_birth = moment($scope.userMeetingDetails.date_of_birth).format("MM/DD/YYYY");
        }

        if($state.current.name == 'room.medicalHistory'){
            $scope.medications = ['No Medications'];
            $scope.conditions = ['No Pre-existing medical conditions'];
            $scope.allergies = ['No Allergies'];


            // medication ctrl
            $scope.searchMedications = function(x){
                if(x && x.length >= 3){
                    $scope.loading = true;
                    $scope.param = {};
                    $scope.param.searchString = x;
                    roomServices.searchMedications($scope.param)
                    .then(function(result){
                        if(result.data.success == 1){
                            $scope.medicationFound = 1;
                            $scope.loading = false;
                            $scope.allMedications = result.data.result;
                        }else if(result.data.success == 0){
                            $scope.medicationFound = 0;
                            $scope.loading = false;
                        }
                        
                        })        
                }
            }
           
            $scope.addMedication = function(x){
                $scope.medication = "";
                $scope.medicationFound = 0;
                if($scope.medications[0] == 'No Medications'){
                    $scope.medications.splice(0,1);    
                }
                if($scope.medications.indexOf(x) != 0){
                    $scope.medications.push(x);
                }
            }
            $scope.removeMedications = function(x){
                var index = $scope.medications.indexOf(x);
                $scope.medications.splice(index,1);
                if($scope.medications.length == 0){
                   $scope.medications = ['No Medications']; 
                }

            }
            // medication ctrl end

            // medical condition ctrl
            $scope.addCondition = function(x){
                if($scope.conditions[0] == 'No Pre-existing medical conditions'){
                    $scope.conditions.splice(0,1);    
                }
                if($scope.conditions.indexOf(x) != 0){
                    $scope.conditions.push(x);
                }
                $scope.condition = "";
            }

            $scope.removeConditions = function(x){
                var index = $scope.conditions.indexOf(x);
                $scope.conditions.splice(index,1);
                if($scope.conditions.length == 0){
                   $scope.conditions = ['No Pre-existing medical conditions']; 
                }

            }
            // medical condition ctrl end

            // allergy ctrl
            $scope.searchAllergies = function(x){
                if(x && x.length >= 3){
                    $scope.loading = true;
                    $scope.param = {};
                    $scope.param.searchTerm = x;
                    roomServices.searcAllergies($scope.param)
                    .then(function(result){
                        if(result.data.success == 1){
                            $scope.allergyFound = 1;
                            $scope.loading = false;
                            $scope.allAllergies = result.data.result;
                        }else if(result.data.success == 0){
                            $scope.allergyFound = 0;
                            $scope.loading = false;
                        }
                        
                        })        
                }
            }
           
            $scope.addAllergy = function(x){
                $scope.allergy = "";
                $scope.allergyFound = 0;
                if($scope.allergies[0] == 'No Allergies'){
                    $scope.allergies.splice(0,1);    
                }
                if($scope.allergies.indexOf(x) != 0){
                    $scope.allergies.push(x);
                }
            }
            $scope.removeAllergy = function(x){
                var index = $scope.allergies.indexOf(x);
                $scope.allergies.splice(index,1);
                if($scope.allergies.length == 0){
                   $scope.allergies = ['No Allergies']; 
                }

            }
            // allergy ctrl end


            $scope.userSymptoms = function(){
                $state.go('room.symptoms');
            }
        }

        

        if($state.current.name == 'room.symptoms'){
            //socketService.connect();
            $scope.symptoms = [];
            $scope.oneAtATime = true;    
            $scope.allSymptoms = getSymptomsService.getSymptomsDetails();
            $scope.isSymptomSelected = false;
            $scope.selectMultipleSymptoms = function(y,isSymptomSelected){
                $scope.symptomId = $filter('removeBlankSpaceFromStringFilter')(y);
                if(isSymptomSelected == false){
                    var index = $scope.symptoms.indexOf(y);
                    if(index == -1){
                        $("#"+$scope.symptomId).addClass('hasSymptomBackground');
                        $scope.symptoms.push(y);
                    }else{
                        $("#"+$scope.symptomId).removeClass('hasSymptomBackground');
                        $scope.symptoms.splice(index,1);
                    }
                    $scope.isSymptomSelected = true;
                }else if(isSymptomSelected == true){
                    var index = $scope.symptoms.indexOf(y);
                    if(index == -1){
                        $("#"+$scope.symptomId).addClass('hasSymptomBackground');
                        $scope.symptoms.push(y);
                    }else{
                        $("#"+$scope.symptomId).removeClass('hasSymptomBackground');
                        $scope.symptoms.splice(index,1);
                    }
                    $scope.isSymptomSelected = false;    
                    
                }
                $log.log($scope.symptoms); 
                

            }


            $scope.selectedSymptoms = function(ev,y){
                if(ev == true){
                    $scope.symptoms.push(y);
                } 
                if(ev == false){
                    var index = $scope.symptoms.indexOf(y);
                    $scope.symptoms.splice(index,1);

                }       
                $log.log($scope.symptoms);
            }

            $scope.userCheckIn = function(docid){
                $scope.loading = true;
                $scope.userLocalDetails = roomServices.getUserDetailsLocalstorage();
                roomServices.saveUserMeetingDetails($scope.userLocalDetails)
                .then(function(result){
                    $log.log(result);
                    if(result.data.status_code == 200){
                        $scope.IdJson = {}; 
                        $scope.IdJson.email = $scope.userLocalDetails.email;        
                        roomServices.getSavedUserId($scope.IdJson)
                        .then(function(result){
                            if(result.data.status_code == 200){
                                $scope.userFetchedId = result.data.result[0].id;
                                $scope.param = {};
                                $scope.param.docId = docid;
                                if(JSON.parse(localStorage.getItem('userMeetingDetails')).id != undefined){
                                    $scope.param.userId = JSON.parse(localStorage.getItem('userMeetingDetails')).id;    
                                }else{
                                    $scope.param.userId = $scope.userFetchedId;
                                }
                                roomServices.addUserToWaiting($scope.param)
                                .then(function(result){
                                    if(result.data.status_code == 200){ 

                                        socketService.emit('userjoin',{waitingId:$scope.userFetchedId},function(data){
                                            $log.log("user added");
                                            $log.log(data);
                                        });
                                        $scope.loading = false;
                                        $log.log(result);
                                        $state.go('room.call');
                                    }else{
                                        $scope.loading = false;
                                        alert("error");
                                    }
                                    })                    
                            }else{
                                alert("error");
                            }
                            })
                    }else{
                        alert("error");
                    }
                    })
            }
        }

        if($state.current.name == 'room.call'){

            socketService.on('callDisconnectedByDoc', function(data){
                console.log(data);
                $scope.callDisconnectedByDoc = function(){

                var modalInstance = $uibModal.open({
                    templateUrl: "callDisconnectedDocModal.html",
                    controller: ModalInstanceCtrl,
                    scope: $scope,
                    size:'sm',
                    resolve: {
                        sessionResolve :  function(){
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
            $scope.callDisconnectedByDoc();





                });


            $rootScope.title = "Live Call";
            $scope.IdJson = {};
            $scope.IdJson.email = JSON.parse(localStorage.getItem('userMeetingDetails')).email; 
            roomServices.getSavedUserId($scope.IdJson)
            .then(function(result){
                if(result.data.status_code == 200){
                    $scope.userId = result.data.result[0].id;
                    $scope.param = {};
                    $scope.param.id = $scope.userId;    
                    roomServices.getOpentokRoomKeys($scope.param)
                    .then(function(result){
                        if(result.data.status_code == 200){
                            $scope.opentokKeys = result.data.result[0];
                            var session = OT.initSession(config.opentokAPIKey,$scope.opentokKeys.session);
                            var subscriber;
                            session.on('streamCreated', function(event) {
                                $scope.isDocPublishing = true;
                                session.subscribe(event.stream, 'doctorPublisher', {
                                    insertMode: 'append',
                                    width: '100%',
                                    height: '100%'
                                });
                            });

                            session.on('sessionDisconnected', function(event) {
                                console.log('You were disconnected from the session.', event.reason);
                            });

                            session.connect($scope.opentokKeys.token, function(error) {
                                if (!error) {
                                    var publisherProperties = {name:"patientPublisher"};
                                    var publisher = OT.initPublisher('patientPublisher',publisherProperties, {
                                        resolution: '320x240', 
                                        frameRate: 1
                                    });
                                    session.publish(publisher);  
                                } else {
                                    console.log('There was an error connecting to the session: ', error.code, error.message);
                                }
                            });

                            $scope.disconnectSession = function(){ 



                                var modalInstance = $uibModal.open({
                                    templateUrl: "callDisconnectedPatientModal.html",
                                    controller: ModalInstanceCtrl,
                                    scope: $scope,
                                    size:'sm',
                                    resolve: {
                                        sessionResolve :  function(){
                                            return session;
                                            } 
                                    }

                                });

                                modalInstance.result.then(function (selectedItem) {
                                    $scope.selected = selectedItem;
                                    }, function () {
                                    $log.info('Modal dismissed at: ' + new Date());
                                });

                                   socketService.emit('callDisconnectedByDoc',{waitingId:"test"},function(data){
                                            $log.log("call end");
                                            $log.log(data);
                                        });    


                                    
                                // socketService.emit('userleft',{waitingId:$scope.userId,name:JSON.parse(localStorage.getItem('userMeetingDetails')).first_name},function(data){
                                //     $log.log("user left");
                                //     $log.log(data);
                                // });

                                session.disconnect();
                                
                            }



                        }else{
                            alert("error");
                        }
                        
                    })
                }
                })




            
        }
    }

var ModalInstanceCtrl = function ($scope,$rootScope,$uibModalInstance,$log,$state,sessionResolve) {

    if($state.current.name == 'room'){
        $uibModalInstance.dismiss('cancel');
    }

    $scope.callEndPatient = function(){
        sessionResolve.disconnect();
        $state.go('room');
        $uibModalInstance.dismiss('cancel');    

    }

    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');    
    }

    $scope.gotoRoom = function(){
        $state.go('room');
        $uibModalInstance.dismiss('cancel');
    }


}


})();
(function() {   
    'use strict';  
    angular
        .module('AkosPCP.room')
        .controller('RoomCtrl', RoomCtrl); 
    RoomCtrl.$inject = ['$scope','$http','$rootScope','$location','$window','$log','tokenValidatorService','$cookieStore','$state','$uibModal','moment','$stateParams','roomServices','getSymptomsService','$filter','config','socketService','$compile','$timeout','appConfig'];
    function RoomCtrl($scope,$http,$rootScope,$location,$window,$log,tokenValidatorService,$cookieStore,$state,$uibModal,moment,$stateParams,roomServices,getSymptomsService,$filter,config,socketService,$compile,$timeout,appConfig) {

        

        $log.log($location.search().id);
        $rootScope.isPatient = true;
        
        //alert($location.path());

        if($location.path() == '/room/cityhealth'){
            if(typeof $location.search().workflow !== 'undefined'){
          
                $rootScope.nextOrCheckoutAction = 'Next';
            }else{
    
                $rootScope.nextOrCheckoutAction = 'Check In';
            }
        }
       
        

        // var vm = this;
        // vm.title = "Room";
        $scope.$on('$destroy', function (event) {
            //socket.removeAllListeners();
            socketService.removeAllListeners();
            //console.log('destroy triggered!');
        });

        socketService.on('calldisconnectedByThirdParty', function(name){

            //alert('call has been disconnected by third party.');
            toastr.info('Call has been disconnected by third party.');

        });

        $scope.isDeviceNotAvailable = 1;
        var checkNetworkCallback = function(callbackNetworkCheck){
            roomServices.sessiontokenapikey()
                .then(function(result){
                    if(result.data.status_code == 200){
                        $scope.OT_network_session = result.data.result.session;
                        $scope.OT_network_token = result.data.result.token;
                        var el = document.createElement("div");el.classList.add('OT_Network_Class_div');let el_img = document.createElement("img");let el_p = document.createElement("p");el_p.innerHTML = "Checking Your Network...please wait!";el_img.src = "./otnetwork/assets/spinner.gif";
                        var el_span =  document.createElement("span");el_span.innerHTML = "&times";el_span.onclick = function(){el.parentNode.removeChild(el);session.disconnect();}
                        el.appendChild(el_span);el.appendChild(el_img);el.appendChild(el_p);document.body.appendChild(el);
                        var session = OT.initSession(config.opentokAPIKey,$scope.OT_network_session);
                        callbackInitPublisher('thirdParty',function(callback1){ 
                            var ot_piblisher = document.querySelectorAll('.OT_publisher');
                            if(ot_piblisher != undefined){
                                for(let i =0; i< ot_piblisher.length;i++){
                                    ot_piblisher[i].style.display = 'none';
                                }
                                //ot_piblisher.style.display = 'none';//ot_piblisher.style.position = 'absolute';//ot_piblisher.style.top = '10%';//ot_piblisher.style.right = '0px';
                            }
                            if(callback1.a == 1){
                                callbackConnectSession(session,$scope.OT_network_token,function(callback2){
                                    if(callback2.b == 1){
                                        callbackPublishSession(session,callback1.publisher,function(callback3){
                                            if(callback3.c == 1){
                                                callbackSubscribeSession(session,callback1.publisher.stream,function(callback4){
                                                    if(callback4.d == 1){
                                                        testStreamingCapability(callback4.subscriber, function(error, message) {
                                                            //var ot_piblisher = document.querySelector('.OT_publisher');
                                                            //ot_piblisher.style.display = 'none';
                                                            console.log(callback1.publisher);
                                                            if(!error){
                                                                if(message.code == 2001){
                                                                    $scope.isDeviceNotAvailable = 0; // for any device
                                                                    session.disconnect();
                                                                    el.parentNode.removeChild(el);
                                                                    callbackNetworkCheck({acode:1});
                                                                }else{
                                                                    el.parentNode.removeChild(el);
                                                                    session.disconnect();
                                                                    callbackNetworkCheck({acode:0});
                                                                    
                                                                }
                                                            }else{
                                                                el.parentNode.removeChild(el);
                                                                session.disconnect();
                                                                callbackNetworkCheck({acode:0});
                                                            }
                                                        });
                                                        
                                                    }
                                                })
                                            }
                                        })
                                    }        
                                })
                            }else{
                                $scope.isDeviceNotAvailable = 1; // for no device
                                el.parentNode.removeChild(el);
                                $("#bootstrapModalNetworkCheck").modal();
                                callbackNetworkCheck({acode:2});
                            }
                        })
                    }
                })
            
        }
        
        $scope.usStates = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
        if($state.params.id != undefined){
            roomServices.saveDocAlias($state.params.id);
        }


        if($state.params.id != undefined){
            $scope.dataParam = {};
            $scope.dataParam.alias = $state.params.id;
            roomServices.getDocFromAlias($scope.dataParam)
            .then(function(result){
                if(result.data.status_code == 200){
                    if(result.data.result.length == 0){
                        $scope.loading= false;
                        $scope.inactiveAlias = 1;
                    }else{
						try {
                            if (result.data.result[0].group_id) {

                                roomServices.setgroupcalltype(result.data.result[0].group_id);
                            } else {
                                roomServices.setgroupcalltype(result.data.result[0].group_id);
                            }

                        } catch (err) { 
						}
                        $scope.docNameFromAlias = result.data.result[0].name;
                        $scope.docIdFromAlias = result.data.result[0].id;
                        $scope.docGroupIdFromAlias = result.data.result[0].group_id;
                        $scope.docActiveStateFromAlias = result.data.result[0].is_active;    
                        roomServices.saveDocNameFromAlias($scope.docNameFromAlias);
                        roomServices.saveDocIdFromAlias($scope.docIdFromAlias);
                        roomServices.saveDocGroupIdFromAlias($scope.docGroupIdFromAlias);
                        roomServices.saveDocActiveStateFromAlias($scope.docActiveStateFromAlias);
                        if($state.current.name == 'room' || $state.current.name == 'AkosLive'){
                            $scope.providerSettingParams = {};    
                            $scope.providerSettingParams.room = $state.params.id;
                            roomServices.getProviderSetting($scope.providerSettingParams)
                            .then(function(result){
                                $log.log(result);
                                if(result.data.status_code == 200){
                                    $scope.loading= false;
                                    if($state.current.name == 'room'){
                                        if(result.data.result[0].type == "WC_NURSE"){
                                            $state.go('roomNurse',{id:$state.params.id});        
                                        }else{
                                            $state.go('room',{id:$state.params.id});    
                                        }
                                    }
                                    localStorage.setItem('connect_provider_settings',JSON.stringify(result.data.result[0]));
                                }else{
                                    $scope.loading= false;
                                    alert("error");
                                }
                            })

                            // if(JSON.parse(localStorage.getItem('connect_provider_settings'))  != undefined ){
                            //     if(JSON.parse(localStorage.getItem('connect_provider_settings')).type == "WC_NURSE"){
                            //         $state.go('roomNurse',{id:$state.params.id});    
                            //     }else{
                            //         $state.go('room',{id:$state.params.id});
                            //     }
                            // }    
                        }
                        $scope.inactiveAlias = 0;
                    }
                    
                }else{
                    $scope.loading= false;
                    alert("error");
                }
            })
            
            
            
        }

        


        if($state.current.name == 'roomNurse'){
            
           //(07/20/2018) for dynamic checking page
            roomServices.dynamicchakingformfield($scope.dataParam.alias)
                .then(function (result) {
                    if (result.data.status_code == 200) {
                        $scope.checkingformfield = result.data.result[0];
                    }
                });

            $scope.checkNurseNetwork = function(){
                console.log($scope.checkThirdpartyNetwork());
            }
            
            
            
            $scope.inactiveAlias = 0;
            $scope.joinNurseRoomForm = function(x){
                

                $scope.checkParam = {};
                $scope.checkParam.phone = x.phone;
                $scope.checkParam.first_name = x.first_name;
                $scope.checkParam.last_name = x.last_name;
                $scope.checkParam.employerId = appConfig.employerId; 
                /*added on 270718*/
                $scope.checkParam.state_of_injury = '';
                $scope.checkParam.date_of_injury = '';
                $scope.checkParam.employer_name = '';
                $scope.checkParam.email = '';



                if ($scope.checkingformfield.state_of_injury) {
                $scope.checkParam.state_of_injury = x.state_of_injury;
                }
                if ($scope.checkingformfield.date_of_injury) {
                $scope.checkParam.date_of_injury = x.date_of_injury;
                }
                if ($scope.checkingformfield.employer_name) {
                $scope.checkParam.employer_name = x.employer_name;
                }
                if ($scope.checkingformfield.email) {
                $scope.checkParam.email = x.email;
                }
                /*---------------*/
                roomServices.checkPatientExists($scope.checkParam)
                .then(function(result){
                    if(result.data.status_code == 200){
                        if(true){
                            $log.log(result.data.result[0]);
                            $scope.loading = true;
                            $scope.userEnterDetails = {};
                            $scope.userEnterDetails.type = "phone";
                            $scope.userEnterDetails.value = x.phone;
                            roomServices.setUserEmailPhone($scope.userEnterDetails);
                            $scope.userDetails = {};
                            $scope.userDetails.id = result.data.result[0].id;
                            $scope.userDetails.first_name = result.data.result[0].first_name;
                            $scope.userDetails.last_name = result.data.result[0].last_name;
                            $scope.userDetails.phone = result.data.result[0].phone;
                            $scope.userDetails.email = result.data.result[0].email;
                            $scope.userDetails.dateofbirth= result.data.result[0].dateofbirth;
                            $scope.userDetails.gender= result.data.result[0].gender;
                            $scope.userDetails.address1= result.data.result[0].address1;
                            $scope.userDetails.city= result.data.result[0].city;
                            $scope.userDetails.state= result.data.result[0].state;
                            $scope.userDetails.zip_code= result.data.result[0].zip_code;
                            $scope.userDetails.password= result.data.result[0].password;
                            /*added on 270718*/
                            $scope.userDetails.state_of_injury = '';
                           $scope.userDetails.date_of_injury = '';
                           $scope.userDetails.employer_name = '';
                           if ($scope.checkingformfield.state_of_injury) {
                               $scope.userDetails.state_of_injury = x.state_of_injury;
                           }
                           if ($scope.checkingformfield.date_of_injury) {
                               $scope.userDetails.date_of_injury = x.date_of_injury;
                           }
                           if ($scope.checkingformfield.employer_name) {
                               $scope.userDetails.employer_name = x.employer_name;
                           }
                            /*---------------*/
                            $log.log($scope.userDetails);
                            roomServices.saveUserDetailsLocalstorage($scope.userDetails);
                           //(07/21/2018 for dynamic)
                            if ($scope.checkingformfield.otp_verification) {
                                $scope.OTPParam = {};
                                $scope.OTPParam.verifyType = roomServices.getUserEmailPhone().type;
                                $scope.OTPParam.verifyValue = roomServices.getUserEmailPhone().value;
                                $scope.OTPParam.alias = $state.params.id;
                                roomServices.sendOTP($scope.OTPParam)
                                    .then(function (result) {
                                        $scope.loading = false;
                                        $state.go('verify', { id: $state.params.id });
                                    })

                            } else {

                                $scope.dynamicverifyotpredirect();
                            }



                        }
                        else if (result.data.status_code == 402) {

                           var modalInstance = $uibModal.open({
                               template: '\
                                       <div class="modal-header bootstrap-modal-header">\
                                       <h3 class="modal-title" id="modal-title"> Incorrect User Details </h3>\
                                       </div>\
                                       <div class="modal-body bootstrap-modal-body" id="modal-body">\
                                       <p>'+result.data.status_message+'</p>\
                                       </div>\
                                       <div class="modal-footer bootstrap-modal-footer">\
                                           <button class="btn btn-primary" type="button" ng-click="cancel()">OK</button>\
                                       </div>\
                                       ',
                               //templateUrl: "callDisconnectedDocModal.html",
                               controller: ModalInstanceCtrl,
                               scope: $scope,
                               size: 'sm',
                               resolve: {
                                   sessionResolve: function () {
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
                        else{
                            var modalInstance = $uibModal.open({
                            template:'\
                                <div class="modal-header bootstrap-modal-header">\
                                <h3 class="modal-title" id="modal-title">Verification code </h3>\
                                </div>\
                                <div class="modal-body bootstrap-modal-body" id="modal-body">\
                                <p> It seems you entered wrong details. Please enter them carefully.</p>\
                                </div>\
                                <div class="modal-footer bootstrap-modal-footer">\
                                    <button class="btn btn-primary" type="button" ng-click="cancel()">OK</button>\
                                </div>\
                                ',
                            //templateUrl: "callDisconnectedDocModal.html",
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
                    }
                    else if (result.data.status_code == 402) {

                           var modalInstance = $uibModal.open({
                               template: '\
                                       <div class="modal-header bootstrap-modal-header">\
                                       <h3 class="modal-title" id="modal-title"> Incorrect User Details </h3>\
                                       </div>\
                                       <div class="modal-body bootstrap-modal-body" id="modal-body">\
                                       <p>'+result.data.status_message+'</p>\
                                       </div>\
                                       <div class="modal-footer bootstrap-modal-footer">\
                                           <button class="btn btn-primary" type="button" ng-click="cancel()">OK</button>\
                                       </div>\
                                       ',
                               //templateUrl: "callDisconnectedDocModal.html",
                               controller: ModalInstanceCtrl,
                               scope: $scope,
                               size: 'sm',
                               resolve: {
                                   sessionResolve: function () {
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
                    else{
                        $scope.userEnterDetails = {};
                        $scope.userEnterDetails.type = "phone";
                        $scope.userEnterDetails.value = x.phone;
                        roomServices.setUserEmailPhone($scope.userEnterDetails);
                        $scope.userDetails = {};
                        $scope.userDetails.first_name = x.first_name;
                        $scope.userDetails.last_name = x.last_name;
                        $scope.userDetails.phone = x.phone;
                        $scope.userDetails.email = '';
                        $scope.userDetails.dateofbirth= '';
                        $scope.userDetails.gender= '';
                        $scope.userDetails.address1= '';
                        $scope.userDetails.city= '';
                        $scope.userDetails.state= '';
                        $scope.userDetails.zip_code= '';
                        $scope.userDetails.password= '';
                        /*added on 270718*/
                            $scope.userDetails.state_of_injury = '';
                           $scope.userDetails.date_of_injury = '';
                           $scope.userDetails.employer_name = '';
                           if ($scope.checkingformfield.state_of_injury) {
                               $scope.userDetails.state_of_injury = x.state_of_injury;
                           }
                           if ($scope.checkingformfield.date_of_injury) {
                               $scope.userDetails.date_of_injury = x.date_of_injury;
                           }
                           if ($scope.checkingformfield.employer_name) {
                               $scope.userDetails.employer_name = x.employer_name;
                           }
                            /*---------------*/
                        $log.log($scope.userDetails);
                        roomServices.saveUserDetailsLocalstorage($scope.userDetails);
                        //(07/21/2018 for dynamic)
                        if ($scope.checkingformfield.otp_verification) {
                        $scope.OTPParam = {};
                        $scope.OTPParam.verifyType = roomServices.getUserEmailPhone().type;
                        $scope.OTPParam.verifyValue = roomServices.getUserEmailPhone().value;
                        $scope.OTPParam.alias = $state.params.id;
                        roomServices.sendOTP($scope.OTPParam)
                        .then(function(result){
                            $scope.loading = false;
                            $state.go('verify',{id:$state.params.id});
                                })
                        } else {

                            $scope.dynamicverifyotpredirect();
                        }
                    }
                    });
                    return false;
                checkNetworkCallback(function(result){
                    console.log(result);
                    if(result.acode == 1){
                        $scope.checkParam = {};
                        $scope.checkParam.emailphone = x.phone;
                        $scope.checkParam.employerId = appConfig.employerId; 
                        roomServices.checkPatientExists($scope.checkParam)
                        .then(function(result){
                            if(result.data.status_code == 200){
                                if(true){
                                    $log.log(result.data.result[0]);
                                    $scope.loading = true;
                                    $scope.userEnterDetails = {};
                                    $scope.userEnterDetails.type = "phone";
                                    $scope.userEnterDetails.value = x.phone;
                                    roomServices.setUserEmailPhone($scope.userEnterDetails);
                                    $scope.userDetails = {};
                                    $scope.userDetails.id = result.data.result[0].id;
                                    $scope.userDetails.first_name = result.data.result[0].first_name;
                                    $scope.userDetails.last_name = result.data.result[0].last_name;
                                    $scope.userDetails.phone = result.data.result[0].phone;
                                    $scope.userDetails.email = result.data.result[0].email;
                                    $scope.userDetails.dateofbirth= result.data.result[0].dateofbirth;
                                    $scope.userDetails.gender= result.data.result[0].gender;
                                    $scope.userDetails.address1= result.data.result[0].address1;
                                    $scope.userDetails.city= result.data.result[0].city;
                                    $scope.userDetails.state= result.data.result[0].state;
                                    $scope.userDetails.zip_code= result.data.result[0].zip_code;
                                    $scope.userDetails.password= result.data.result[0].password;
                                    $log.log($scope.userDetails);
                                    roomServices.saveUserDetailsLocalstorage($scope.userDetails);
                                    $scope.OTPParam = {};
                                    $scope.OTPParam. Type = roomServices.getUserEmailPhone().type;
                                    $scope.OTPParam.verifyValue = roomServices.getUserEmailPhone().value;
                                    $scope.OTPParam.alias = $state.params.id;
                                    roomServices.sendOTP($scope.OTPParam)
                                    .then(function(result){
                                        $scope.loading = false;
                                        $state.go('verify',{id:$state.params.id});
                                    })
        
        
        
                                }
                                else if (result.data.status_code == 402) {

                           var modalInstance = $uibModal.open({
                               template: '\
                                       <div class="modal-header bootstrap-modal-header">\
                                       <h3 class="modal-title" id="modal-title"> Incorrect User Details </h3>\
                                       </div>\
                                       <div class="modal-body bootstrap-modal-body" id="modal-body">\
                                       <p>'+result.data.status_message+'</p>\
                                       </div>\
                                       <div class="modal-footer bootstrap-modal-footer">\
                                           <button class="btn btn-primary" type="button" ng-click="cancel()">OK</button>\
                                       </div>\
                                       ',
                               //templateUrl: "callDisconnectedDocModal.html",
                               controller: ModalInstanceCtrl,
                               scope: $scope,
                               size: 'sm',
                               resolve: {
                                   sessionResolve: function () {
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
                                else{
                                    var modalInstance = $uibModal.open({
                                    template:'\
                                        <div class="modal-header bootstrap-modal-header">\
                                        <h3 class="modal-title" id="modal-title">Verification code </h3>\
                                        </div>\
                                        <div class="modal-body bootstrap-modal-body" id="modal-body">\
                                        <p> It seems you entered wrong details. Please enter them carefully.</p>\
                                        </div>\
                                        <div class="modal-footer bootstrap-modal-footer">\
                                            <button class="btn btn-primary" type="button" ng-click="cancel()">OK</button>\
                                        </div>\
                                        ',
                                    //templateUrl: "callDisconnectedDocModal.html",
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
                            }else{
                                $scope.userEnterDetails = {};
                                $scope.userEnterDetails.type = "phone";
                                $scope.userEnterDetails.value = x.phone;
                                roomServices.setUserEmailPhone($scope.userEnterDetails);
                                $scope.userDetails = {};
                                $scope.userDetails.first_name = x.first_name;
                                $scope.userDetails.last_name = x.last_name;
                                $scope.userDetails.phone = x.phone;
                                $scope.userDetails.email = '';
                                $scope.userDetails.dateofbirth= '';
                                $scope.userDetails.gender= '';
                                $scope.userDetails.address1= '';
                                $scope.userDetails.city= '';
                                $scope.userDetails.state= '';
                                $scope.userDetails.zip_code= '';
                                $scope.userDetails.password= '';
                                $log.log($scope.userDetails);
                                roomServices.saveUserDetailsLocalstorage($scope.userDetails);
                                $scope.OTPParam = {};
                                $scope.OTPParam.verifyType = roomServices.getUserEmailPhone().type;
                                $scope.OTPParam.verifyValue = roomServices.getUserEmailPhone().value;
                                $scope.OTPParam.alias = $state.params.id;
                                roomServices.sendOTP($scope.OTPParam)
                                .then(function(result){
                                    $scope.loading = false;
                                    $state.go('verify',{id:$state.params.id});
                                })
                            }
                            });
                    }else if(result.acode == 0){
                        $("#bootstrapModalNetworkCheckFail").modal();
                    }else{
                        return false;
                    }
                })
                //$state.go('room.call',{id:$state.params.id});
            }
        
        //(07/21/2018)for dynamic
            $scope.dynamicverifyotpredirect = function () {
              //checkNetworkCallback(function (result) {
               //if (result.acode == 1) {
                if (JSON.parse(localStorage.getItem('connect_provider_settings')).type == "WC_NURSE") {
                    $log.log(1234);
                    
                    $scope.userLocalDetails = roomServices.getUserDetailsLocalstorage();
                    $log.log($scope.userLocalDetails);
                    $scope.userLocalDetails.employerId = appConfig.employerId;
                    roomServices.saveUserMeetingDetails($scope.userLocalDetails)
                        .then(function (result) {
                            $log.log(result);
                            if (result.data.status_code == 200) {


                                //add this for connect url (07/23/2018)
                                roomServices.savePatientId(result.data.result.patient_id);
                                roomServices.savePatientCallIdlocalstorage($scope.call_id);
                                //** add for save call start time
								
								 roomServices.checkstatusinwatingroom({ patient_id: result.data.result.patient_id})
                                        .then(function (resultstatus) {
                                            //add for generate callid by patientid 
                                            if (resultstatus.data.status_code == 200) {
                                roomServices.generatecallidbypatientid({ patientId: result.data.result.patient_id, staffid: 500, call_started: moment().format('YYYY-MM-DD') })
                                    .then(function (result) {
                                        $log.log(result);
                                        if (result.data.status_code == 200) {
                                            
                                            $scope.call_id = result.data.result.call_id;
                                            
                                             $scope.IdJson = {};
                                $scope.IdJson.email = $scope.userLocalDetails.email;
                                if ($scope.IdJson.email == '') {
                                    $scope.IdJson.email = $scope.userLocalDetails.phone;
                                }
                                roomServices.getSavedUserId($scope.IdJson)
                                    .then(function (result) {
                                        $log.log(result);
                                        if (result.data.status_code == 200) {
                                            $scope.userFetchedId = result.data.result[0].id;
                                            $scope.param = {};
                                            $scope.param.docId = roomServices.getDocIdFromAlias();

                                            if (JSON.parse(localStorage.getItem('userMeetingDetails')).id != undefined) {
                                                $scope.param.userId = JSON.parse(localStorage.getItem('userMeetingDetails')).id;
                                            } else {
                                                $scope.param.userId = $scope.userFetchedId;
                                                
                                            }
                                                    $scope.newLocalStorage = JSON.parse(localStorage.getItem('userMeetingDetails'));
                                                    $scope.newLocalStorage.id = $scope.param.userId;
                                                    localStorage.setItem("userMeetingDetails", JSON.stringify($scope.newLocalStorage));
                                            //$scope.param.group_id = $scope.docGroupIdFromAlias;
                                            $scope.param.groupId = roomServices.getDocGroupIdFromAlias();
                                            $scope.param.symptom = "";
                                            $scope.param.allergy = "";
                                            $scope.param.medication = "";
                                            $scope.param.medical_condition = "";
                                            ////////////////////////                    //add new for generate call_id 
                                            //for add call_id in watingroom table(07082018)
                                            /*added on 270718*/
                                           $scope.param.state_of_injury = ($scope.newLocalStorage && $scope.newLocalStorage.state_of_injury) ? $scope.newLocalStorage.state_of_injury : '';
                                           $scope.param.date_of_injury = ($scope.newLocalStorage && $scope.newLocalStorage.date_of_injury) ? $scope.newLocalStorage.date_of_injury : '';
                                           $scope.param.employer_name = ($scope.newLocalStorage && $scope.newLocalStorage.employer_name) ? $scope.newLocalStorage.employer_name : '';

                                            /*---------------*/
                                            $scope.param.call_id = JSON.stringify(roomServices.getPatientCallIdlocalstorage());
                                            /////////
                                            roomServices.addUserToWaiting($scope.param)
                                                .then(function (result) {
                                                    if (result.data.status_code == 200) {
                                                        
                                                        socketService.emit('userjoin', { waitingId: $scope.userFetchedId }, function (data) {
                                                            $log.log("user added");
                                                            $log.log(data);
                                                        });
                                                        $scope.loading = false;
                                                        $log.log(result);



                                                        //pop to show recording info
                                                        //alert("hiiiiiiii");

                                                        var modalInstance = $uibModal.open({
                                                            size: 'sm',
                                                            template: '\
                                                                <div class="modal-header bootstrap-modal-header">\
                                                                <h3 class="modal-title" id="modal-title">Info </h3>\
                                                                </div>\
                                                                <div class="modal-body bootstrap-modal-body" id="modal-body">\
                                                                <p>'+ 'This call will be recorded for quality and training purposes.' + ' </p>\
                                                                </div>\
                                                                <div class="modal-footer bootstrap-modal-footer">\
                                                                    <button class="btn btn-primary" type="button" ng-click="ok()">OK</button>\
                                                                </div>\
                                                                ',
                                                            //templateUrl: "callDisconnectedDocModal.html",
                                                            controller: function ($scope, $uibModalInstance) {
                                                                $scope.ok = function () {
                                                                    $uibModalInstance.close();

                                                                 var ua = navigator.userAgent.toLowerCase();
                                                                var isAndroid = ua.indexOf("android") > -1;
																
																 if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
                                                                    //&& ua.indexOf("mobile");
                                                                    var connecturldedetail = roomServices.getUserConnectUrlstorage();
                                                                    
                                                                    if (isAndroid) {
                                                                        $scope.appStore = "PLAY";
                                                                        if (typeof connecturldedetail.thirdParty != 'undefined') {
                                                                            var url = "patientapp:///" + connecturldedetail.roomId + '/' + connecturldedetail.thirdParty;
                                                                            var docurl = "akosmd:///" + connecturldedetail.roomId + '/' + connecturldedetail.thirdParty;
                                                                        
                                                                        } else {
                                                                            var url = "patientapp:///" + connecturldedetail.roomId + '/' + connecturldedetail.type + '/**' + JSON.stringify(roomServices.getPatientId());
                                                                            var docurl = "akosmd:///" + connecturldedetail.roomId + '/' + connecturldedetail.type + '/**' + JSON.stringify(roomServices.getPatientId());
                                                                        
                                                                        }
                                                                    } else {
                                                                        $scope.appStore = "APP";
                                                                        if (typeof connecturldedetail.thirdParty != 'undefined') {
                                                                            var url = "testAkos:///" + connecturldedetail.roomId + '/' + connecturldedetail.thirdParty;
                                                                            var docurl = "testAkosDoctor:///" + connecturldedetail.roomId + '/' + connecturldedetail.thirdParty;
                                                                        
                                                                        } else {
                                                                            var url = "testAkos:///" + connecturldedetail.roomId + '/' + connecturldedetail.type + '/**' + JSON.stringify(roomServices.getPatientId());
                                                                            var docurl = "testAkosDoctor:///" + connecturldedetail.roomId + '/' + connecturldedetail.type + '/**' + JSON.stringify(roomServices.getPatientId());
                                                                         
                                                                        }

                                                                        
                                                                    }

                                                                    setTimeout(function () {
                                                                    window.location = url;
                                                                    }, 25);
                                                                    window.location = docurl;
                                                                }
                                                                else {                                             
                                                                    $state.go('room.call', { id: roomServices.getDocAlias() });
																}

                                                                };

                                                                $scope.cancel = function () {
                                                                    $uibModalInstance.dismiss('cancel');
                                                                };
                                                            }
                                                        });
                                                        modalInstance.result.then(function (selectedItem) {
                                                            $scope.selected = selectedItem;
                                                        }, function () {
                                                            $log.info('Modal dismissed at: ' + new Date());
                                                        });

                                                        //end-pop to show recording info


                                                        //$state.go('room.call',{id:roomServices.getDocAlias()});
                                                    } else {
                                                        $scope.loading = false;
                                                        alert("error");
                                                    }
                                                })
                                        } else {
                                            alert("error");
                                        }
                                    })

                                        } else {
                                            alert("error");
                                        }
                                        
                                       
                                    })
                                
								     } else {


                                                    var modalInstance = $uibModal.open({
                                                        template: '\
                                       <div class="modal-header bootstrap-modal-header">\
                                       <h3 class="modal-title" id="modal-title"> Incorrect User Details </h3>\
                                       </div>\
                                       <div class="modal-body bootstrap-modal-body" id="modal-body">\
                                       <p>'+ resultstatus.data.status_message + '</p>\
                                       </div>\
                                       <div class="modal-footer bootstrap-modal-footer">\
                                           <button class="btn btn-primary" type="button" ng-click="cancel()">OK</button>\
                                       </div>\
                                       ',
                                                        //templateUrl: "callDisconnectedDocModal.html",
                                                        controller: ModalInstanceCtrl,
                                                        scope: $scope,
                                                        size: 'sm',
                                                        resolve: {
                                                            sessionResolve: function () {
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
                                            
                                        })
								
								////////////////////////////
                               
                            } else {
                                alert("error");
                            }
                        })
                } else {
                    if (localStorage.getItem('userMeetingDetails') != '') {
                        $state.go('room.medicalHistory', { 'id': roomServices.getDocAlias() });
                    } else {
                        $state.go('room.user', { 'id': roomServices.getDocAlias() });
                    }
                }
             /* }else if (result.acode == 0 || result.acode == 2) {
                        var modalInstance = $uibModal.open({
                            template: '<div class="modal-header bootstrap-modal-header">\
                                          <h3 ng-if="'+ result.acode + '==2" class= "modal-title" id="modal-title"> Network Check </h3>\
                                            <h3 ng-if="'+ result.acode + '==0" class="modal-title" id="modal-title">Weak Signal </h3>\
                                            </div>\
                                            <div class="modal-body bootstrap-modal-body" id="modal-body">\
                                            <p ng-if="'+ result.acode + '==0">Unfortunately, your current signal strength will neither support a video nor an audio call.  Please try again from a different area with stronger signal.</p>\
                                            <p ng-if="'+ result.acode + '==2">Sorry, No Video Device Found.</p>\
                                            </div>\
                                            <div class="modal-footer bootstrap-modal-footer">\
                                                <button class="btn btn-primary" type="button" ng-click="cancel()">OK </button>\
                                            </div>\
                                            ',
                            controller: ModalInstanceCtrl,
                            scope: $scope,
                            size: 'sm',
                            windowClass: 'sendpatient-email-pop-class',
                            resolve: {
                                modalProgressValue: function () {
                                    return "";
                                },
                                CPTBilling: function () {
                                    return "";
                                },
                                sessionResolve: function () {
                                    return '';
                                },
                                meetingRoomURLResolve: function () {
                                    return "";
                                },
                                emailMeetingLinkUrlResolve: function () {
                                    return '';
                                },
                                lockEncounterData: function () {
                                    return "";
                                },
                                disconnectData: function () {
                                    return "";
                                }
                            }

                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });

                    }
                    else {
                        return false;
                    }
                });*/
            }
            

            
        }

        if($state.current.name == 'AkosLive'){
            $scope.loading = true;
            if($state.params.id != undefined || $state.params.id != ''){
                $scope.clientUrlParam = {};
                $scope.clientUrlParam.id = $state.params.patientId;
              //  $scope.clientUrlParam.first_name = $state.params.first_name;
                $scope.clientUrlParam.transactionId = $state.params.transactionId;
                //$scope.clientUrlParam.last_name = $state.params.last_name;
                roomServices.checkClientUrl($scope.clientUrlParam)
                .then(function(result){
                    if(result.data.status_code == 200){
                        $scope.loading = false;
                        $scope.dataParam = {};    
                        $scope.dataParam.alias = $state.params.id;
                        $scope.userData = {};
                        $scope.userData.id = $state.params.patientId;
                    $scope.userData.first_name = result.data.result.first_name;
                        $scope.userData.last_name = result.data.result.last_name;
                        localStorage.setItem('userMeetingDetails',JSON.stringify($scope.userData));
                        roomServices.getDocFromAlias($scope.dataParam)
                        .then(function(result){
                            if(result.data.status_code == 200){
                                if(result.data.result.length == 0){
                                    $scope.loading= false;
                                    $scope.inactiveAlias = 1;
                                }else{
                                    $scope.docNameFromAlias = result.data.result[0].name;
                                    $scope.docIdFromAlias = result.data.result[0].id;
                                    $scope.docGroupIdFromAlias = result.data.result[0].group_id;
                                    $scope.param = {};
                                    $scope.param.docId = $scope.docIdFromAlias;
                                    $scope.param.userId = $state.params.patientId;
                                    //$scope.param.group_id = $scope.docGroupIdFromAlias;
                                    $scope.param.groupId =  $scope.docGroupIdFromAlias;
                                    $scope.param.symptom = "";
                                    $scope.param.allergy = "";
                                    $scope.param.medication = "";
                                    $scope.param.medical_condition = "";

                                    $scope.param.state_of_injury = '';
                                    $scope.param.date_of_injury = '';
                                    $scope.param.employer_name = '';


                                    roomServices.addUserToWaiting($scope.param)
                                    .then(function(result){
                                        if(result.data.status_code == 200){ 
                                            socketService.emit('userjoin',{waitingId:$state.params.patientId},function(data){
                                                $log.log("user added");
                                                $log.log(data);
                                            });
                                            $scope.loading = false;
                                            $log.log(result);
                                            $state.go('room.call',{id:$state.params.id});
                                        }else{
                                            $scope.loading = false;
                                            alert("error");
                                        }
                                    })   
                                }
                            }
                        }) 
                        return true;    
                    }else{
                        $scope.loading = false;
                        $scope.invalidClientURL = 1;

                        var modalInstance = $uibModal.open({
                            template: '\
                                <div class="modal-header bootstrap-modal-header">\
                                <h3 class="modal-title" id="modal-title"> Unable to check in </h3>\
                                </div>\
                                <div class="modal-body bootstrap-modal-body" id="modal-body">\
                                <p>'+ result.data.status_message + ' </p>\
                                </div>\
                                <div class="modal-footer bootstrap-modal-footer">\
                                    <button class="btn btn-primary" type="button" ng-click="cancel()">OK</button>\
                                </div>\
                                ',
                            //templateUrl: "callDisconnectedDocModal.html",
                            controller: ModalInstanceCtrl,
                            scope: $scope,
                            size: 'sm',
                            resolve: {
                                sessionResolve: function () {
                                    return '';
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {



                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        
                        return false; 
                    }
                })
                
            }
        }
            
        if($state.current.name == 'verify'){
            $scope.roomAlias = roomServices.getDocAlias();
            $rootScope.title = "Verify your identity";
            $scope.verifyData = roomServices.getUserEmailPhone();
            if($scope.verifyData.type == "phone"){
                $scope.usEncodedNumber = (""+$scope.verifyData.value).replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '($1) $2-$3');
            }
    

    $scope.verifyOTP = function(x){
                

                $log.log(roomServices.getDocAlias());
                $scope.loading = true;
                $scope.param = {};
                $scope.param.otp = x;
                $scope.param.verifyValue = $scope.verifyData.value;
                roomServices.verifyOTP($scope.param) 
                .then(function(result){
                    
                    if(result.data.status_code == 200){

                        $scope.loading = false;
                        //checkNetworkCallback(function (result) {
                       //if (result.acode == 1) {
                        if(roomServices.getDocAlias() != undefined){

                            if(JSON.parse(localStorage.getItem('connect_provider_settings')).type == "WC_NURSE"){
                                $log.log(1234);
                                
                                $scope.userLocalDetails = roomServices.getUserDetailsLocalstorage();
                                $log.log($scope.userLocalDetails);
                                $scope.userLocalDetails.employerId = appConfig.employerId;
                                roomServices.saveUserMeetingDetails($scope.userLocalDetails)
                                .then(function(result){
                                    $log.log(result);
                                    if(result.data.status_code == 200){ 
                                        roomServices.savePatientId(result.data.result.patient_id);
										roomServices.checkstatusinwatingroom({ patient_id: result.data.result.patient_id})
                                        .then(function (resultstatus) {
                                            //add for generate callid by patientid 
                                            if (resultstatus.data.status_code == 200) {
                                        //add for generate callid by patientid 
                                        roomServices.generatecallidbypatientid({ patientId: result.data.result.patient_id, staffid:500,call_started: moment().format('YYYY-MM-DD') })
                                            .then(function (result) {
                                                $log.log(result);
                                                if (result.data.status_code == 200) {
                                                    
                                                    $scope.call_id = result.data.result.call_id;
                                                    roomServices.savePatientCallIdlocalstorage($scope.call_id);
                                                    $scope.IdJson = {}; 
                                        $scope.IdJson.email = $scope.userLocalDetails.email;  
                                        if($scope.IdJson.email == ''){
                                            $scope.IdJson.email = $scope.userLocalDetails.phone;
                                        }





                                        roomServices.getSavedUserId($scope.IdJson)
                                        .then(function(result){
                                            $log.log(result);
                                            if(result.data.status_code == 200){


                                                $scope.userFetchedId = result.data.result[0].id;
                                                $scope.param = {};
                                                $scope.param.docId = roomServices.getDocIdFromAlias();
                                                
                                                if(JSON.parse(localStorage.getItem('userMeetingDetails')).id != undefined){
                                                    $scope.param.userId = JSON.parse(localStorage.getItem('userMeetingDetails')).id;    
                                                }else{
                                                    $scope.param.userId = $scope.userFetchedId;
                                                    
                                                }
                                                    $scope.newLocalStorage = JSON.parse(localStorage.getItem('userMeetingDetails'));
                                                    $scope.newLocalStorage.id = $scope.param.userId;
                                                    localStorage.setItem("userMeetingDetails", JSON.stringify($scope.newLocalStorage));
                                                //$scope.param.group_id = $scope.docGroupIdFromAlias;
                                                $scope.param.groupId =  roomServices.getDocGroupIdFromAlias();
                                                $scope.param.symptom = "";
                                                $scope.param.allergy = "";
                                                $scope.param.medication = "";
                                                $scope.param.medical_condition = "";

                                                /*added on 270718*/
                                           $scope.param.state_of_injury = ($scope.newLocalStorage && $scope.newLocalStorage.state_of_injury) ? $scope.newLocalStorage.state_of_injury : '';
                                           $scope.param.date_of_injury = ($scope.newLocalStorage && $scope.newLocalStorage.date_of_injury) ? $scope.newLocalStorage.date_of_injury : '';
                                           $scope.param.employer_name = ($scope.newLocalStorage && $scope.newLocalStorage.employer_name) ? $scope.newLocalStorage.employer_name : '';

                                                /*---------------*/
                                                //for add call_id in watingroom table
                                                $scope.param.call_id = JSON.stringify(roomServices.getPatientCallIdlocalstorage());


                                                roomServices.addUserToWaiting($scope.param)
                                                .then(function(result){
                                                    if(result.data.status_code == 200){ 

                                                        socketService.emit('userjoin',{waitingId:$scope.userFetchedId},function(data){
                                                            $log.log("user added");
                                                            $log.log(data);
                                                        });
                                                        $scope.loading = false;
                                                        $log.log(result);



								                       	//pop to show recording info
								                    	//alert("hiiiiiiii");

								                    	var modalInstance = $uibModal.open({
								                    		size:'sm',
								                            template:'\
								                                <div class="modal-header bootstrap-modal-header">\
								                                <h3 class="modal-title" id="modal-title">Info </h3>\
								                                </div>\
								                                <div class="modal-body bootstrap-modal-body" id="modal-body">\
								                                <p>'+ 'This call will be recorded for quality and training purposes.' +' </p>\
								                                </div>\
								                                <div class="modal-footer bootstrap-modal-footer">\
								                                    <button class="btn btn-primary" type="button" ng-click="ok()">OK</button>\
								                                </div>\
								                                ',
								                            //templateUrl: "callDisconnectedDocModal.html",
								                        controller: function ($scope, $uibModalInstance) {
													        $scope.ok = function () {
													          $uibModalInstance.close();
                                                              //add this for connect url (07/23/2018)
															  
															  var ua = navigator.userAgent.toLowerCase();
                                                                var isAndroid = ua.indexOf("android") > -1;
																
																 if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
                                                                    //&& ua.indexOf("mobile");
                                                                    var connecturldedetail = roomServices.getUserConnectUrlstorage();
                                                                    
                                                                    if (isAndroid) {
                                                                        $scope.appStore = "PLAY";
                                                                        if (typeof connecturldedetail.thirdParty != 'undefined') {
                                                                            var url = "patientapp:///" + connecturldedetail.roomId + '/' + connecturldedetail.thirdParty;
                                                                            var docurl = "akosmd:///" + connecturldedetail.roomId + '/' + connecturldedetail.thirdParty;
                                                                        
                                                                        } else {
                                                                            var url = "patientapp:///" + connecturldedetail.roomId + '/' + connecturldedetail.type + '/**' + JSON.stringify(roomServices.getPatientId());
                                                                            var docurl = "akosmd:///" + connecturldedetail.roomId + '/' + connecturldedetail.type + '/**' + JSON.stringify(roomServices.getPatientId());
                                                                        
                                                                        }
                                                                    } else {
                                                                        $scope.appStore = "APP";
                                                                        if (typeof connecturldedetail.thirdParty != 'undefined') {
                                                                            var url = "testAkos:///" + connecturldedetail.roomId + '/' + connecturldedetail.thirdParty;
                                                                            var docurl = "testAkosDoctor:///" + connecturldedetail.roomId + '/' + connecturldedetail.thirdParty;
                                                                        
                                                                        } else {
                                                                            var url = "testAkos:///" + connecturldedetail.roomId + '/' + connecturldedetail.type + '/**' + JSON.stringify(roomServices.getPatientId());
                                                                            var docurl = "testAkosDoctor:///" + connecturldedetail.roomId + '/' + connecturldedetail.type + '/**' + JSON.stringify(roomServices.getPatientId());
                                                                         
                                                                        }

                                                                        
                                                                    }

                                                                    setTimeout(function () {
                                                                    window.location = url;
                                                                    }, 25);
                                                                    window.location = docurl;
                                                                }
                                                                else {                                             
                                                                    $state.go('room.call', { id: roomServices.getDocAlias() });
																}
													        };
													      
													        $scope.cancel = function () {
													          $uibModalInstance.dismiss('cancel');
													        };
													      }
								                        });
								                        modalInstance.result.then(function (selectedItem) {
								                            $scope.selected = selectedItem;
								                            }, function () {
								                            $log.info('Modal dismissed at: ' + new Date());
								                        });

								                    	//end-pop to show recording info


                                                        //$state.go('room.call',{id:roomServices.getDocAlias()});
                                                    }else{
                                                        $scope.loading = false;
                                                        alert("error");
                                                    }
                                                    })                    
                                            }else{
                                                alert("error");
                                            }
                                            })

                                                } else {
                                                    alert("error");
                                                }
                                                
                                                
                                            })

                                    } else {


                                                    var modalInstance = $uibModal.open({
                                                        template: '\
                                       <div class="modal-header bootstrap-modal-header">\
                                       <h3 class="modal-title" id="modal-title"> Incorrect User Details </h3>\
                                       </div>\
                                       <div class="modal-body bootstrap-modal-body" id="modal-body">\
                                       <p>'+ resultstatus.data.status_message + '</p>\
                                       </div>\
                                       <div class="modal-footer bootstrap-modal-footer">\
                                           <button class="btn btn-primary" type="button" ng-click="cancel()">OK</button>\
                                       </div>\
                                       ',
                                                        //templateUrl: "callDisconnectedDocModal.html",
                                                        controller: ModalInstanceCtrl,
                                                        scope: $scope,
                                                        size: 'sm',
                                                        resolve: {
                                                            sessionResolve: function () {
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
                                            
                                        })									
                                        
                                    }else{
                                        alert("error");
                                    }
                                    })
                            }else{
                                if(localStorage.getItem('userMeetingDetails') != ''){
                                    $state.go('room.medicalHistory', { 'id':roomServices.getDocAlias()});    
                                }else{
                                    $state.go('room.user', {'id':roomServices.getDocAlias()});   
                                }
                            }
                        }
                  /*  }
                    else if (result.acode == 0 || result.acode == 2) {
                       
                        var modalInstance = $uibModal.open({
                            template: '<div class="modal-header bootstrap-modal-header">\
                                          <h3 ng-if="'+ result.acode + '==2" class= "modal-title" id="modal-title"> Network Check </h3>\
                                            <h3 ng-if="'+ result.acode + '==0" class="modal-title" id="modal-title">Weak Signal </h3>\
                                            </div>\
                                            <div class="modal-body bootstrap-modal-body" id="modal-body">\
                                            <p ng-if="'+ result.acode + '==0">Unfortunately, your current signal strength will neither support a video nor an audio call.  Please try again from a different area with stronger signal.</p>\
                                            <p ng-if="'+ result.acode + '==2">Sorry, No Video Device Found.</p>\
                                            </div>\
                                            <div class="modal-footer bootstrap-modal-footer">\
                                                <button class="btn btn-primary" type="button" ng-click="cancel()">OK </button>\
                                            </div>\
                                            ',
                            controller: ModalInstanceCtrl,
                            scope: $scope,
                            size: 'sm',
                            windowClass: 'sendpatient-email-pop-class',
                            resolve: {
                                modalProgressValue: function () {
                                    return "";
                                },
                                CPTBilling: function () {
                                    return "";
                                },
                                sessionResolve: function () {
                                    return '';
                                },
                                meetingRoomURLResolve: function () {
                                    return "";
                                },
                                emailMeetingLinkUrlResolve: function () {
                                    return '';
                                },
                                lockEncounterData: function () {
                                    return "";
                                },
                                disconnectData: function () {
                                    return "";
                                }
                            }

                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });

                    }
                    else {
                        return false;
                    }
                });*/
                            }else{
                        $scope.loading = false;
                        var modalInstance = $uibModal.open({
                            template:'\
                                <div class="modal-header bootstrap-modal-header">\
                                <h3 class="modal-title" id="modal-title">Verification code </h3>\
                                </div>\
                                <div class="modal-body bootstrap-modal-body" id="modal-body">\
                                <p>'+ result.data.status_message +' </p>\
                                </div>\
                                <div class="modal-footer bootstrap-modal-footer">\
                                    <button class="btn btn-primary" type="button" ng-click="cancel()">OK</button>\
                                </div>\
                                ',
                            //templateUrl: "callDisconnectedDocModal.html",
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
                })

            }

            $scope.resendOTP = function(){
                $scope.loading = true;
                $scope.OTPParam = {};
                $scope.OTPParam.verifyType = roomServices.getUserEmailPhone().type;
                $scope.OTPParam.verifyValue = roomServices.getUserEmailPhone().value;
                $scope.OTPParam.alias = $scope.roomAlias;
                roomServices.sendOTP($scope.OTPParam)
                .then(function(result){
                    if(result.data.status_code == 200){
                        $scope.loading = false;
                        var modalInstance = $uibModal.open({
                            template:'\
                                <div class="modal-header bootstrap-modal-header">\
                                <h3 class="modal-title" id="modal-title">Verification code </h3>\
                                </div>\
                                <div class="modal-body bootstrap-modal-body" id="modal-body">\
                                <p>Verification code sent successfully </p>\
                                </div>\
                                <div class="modal-footer bootstrap-modal-footer">\
                                    <button class="btn btn-primary" type="button" ng-click="cancel()">OK</button>\
                                </div>\
                                ',
                            //templateUrl: "callDisconnectedDocModal.html",
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

                    }else{
                        $scope.loading = false;
                        var modalInstance = $uibModal.open({
                            template:'\
                                <div class="modal-header bootstrap-modal-header">\
                                <h3 class="modal-title" id="modal-title">Verification code</h3>\
                                </div>\
                                <div class="modal-body bootstrap-modal-body" id="modal-body">\
                                <h5>Verification Code Not Sent </h5>\
                                </div>\
                                <div class="modal-footer bootstrap-modal-footer">\
                                    <button class="btn btn-primary" type="button" ng-click="cancel()">OK</button>\
                                </div>\
                                ',
                            //templateUrl: "callDisconnectedDocModal.html",
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
            })
        }
    }
        
        
        

        if($state.current.name == 'inviteRoom'){
            $rootScope.title = "Tell Us About Yourself";
            $rootScope.isCallScreenHidden = 1;
            // $log.log($state.params);
            $scope.inviteParam = {};
            $scope.inviteParam.invite_id = $state.params.inviteId;
            roomServices.getSessionFromInviteId($scope.inviteParam)
            .then(function(result){
                if(result.data.status_code == 200){
                    $scope.inviteSession = result.data.result[0].session_id;
                    $scope.inviteToken = result.data.result[0].token;

                    //new add for get call id by inviteId
                    $scope.call_id = result.data.result[0].call_id;

                }
            })
            
            
           /* $scope.inviteRoomForm = function(x){
                $scope.xvalues = x;
                $log.log($scope.xvalues);
                //checkNetworkCallback(function(result){
                    //console.log(result);
                    //if(result.acode == 1){
                        
                        
                        $log.log($scope.xvalues);
                        //$scope.loading = true;
                        $scope.thirdPartyPublisher = $scope.xvalues;
                        $rootScope.isCallScreenHidden = 0;
                        if($scope.xvalues.mobile){
                            roomServices.verifyThirdPartyDoc($scope.xvalues.mobile)
                            .then(function(result){
                                if(result.data.status_code == 200){
                                    let params = {};
                                    params.id = result.data.result.id;


                                    //add for update doctor Id in patient record by call id
                                    roomServices.updatedoctoridbycallid({ docId: params.id, call_id: $scope.call_id,doctor_call_respond:1}).then(function (updateresult) {
                                        $log.log(updateresult);
                                        
                                    })



                                    roomServices.setThirdPartyDocData($scope.xvalues);
                                    roomServices.sendPushNotificationStaffAdmin(params)
                                    .then(function(result){
                                        $log.log(result);
                                        //$scope.loading = false;
                                    })
                                    
                                }
                            })
                        }
                        
                        
                        socketService.emit('otheruserjoin',{otherUserName:x.firstname+' '+x.lastname},function(data){
                            $log.log("user added");
                            $log.log(data);
                        });
        
                        var session = OT.initSession(config.opentokAPIKey,$scope.inviteSession);
                        socketService.on('callDisconnectedByDoc', function(data){
                        console.log(data);
                        $scope.callDisconnectedByDoc = function(){
                            if(roomServices.getThirdPartyDocData() != undefined){
                                let updateParams = {};
                                updateParams.phone = roomServices.getThirdPartyDocData().mobile;
                                roomServices.updateThirdPartyDoc(updateParams)
                                .then(function(result){
                                    if(result.data.status_code == 200){
                                        let params = {};
                                        params.id = result.data.result.id;
                                        roomServices.sendPushNotificationStaffAdmin(params)
                                        .then(function(result){
                                            $log.log(result);
                                            $scope.loading = false;
                                        })
                                    }
                                    $log.log(result);
                                })
                            }
                            
        
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
                    session.disconnect();
        
                    });
                        var subscriber;
                        $scope.isDocPublishVideo = 1;
                        $scope.isDocPublishAudio = 1;
                        $scope.disconnectSession = function(role){

                            //alert(role);
                                //$scope.isCallScreenHidden = 1;
                            var modalInstance = $uibModal.open({
                                templateUrl: "CallEndThirdPartyPopUp.html",
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
        
                        }
        
                        var layoutEl = document.getElementById("layout");
                        var layout;
                        $scope.layout = {};
                        $scope.layout.animate = {};
                        $scope.layout.animate.duration = 200; 
                        $scope.layout.animate.easing = 'swing';
                        $scope.layout.maxRatio= 3/2;
                        $scope.layout.minRatio= 9/16;
                        $scope.layout.fixedRatio= false;
                        $scope.layout.animate= false;
                        $scope.layout.bigClass= 'OT_big';
                        $scope.layout.bigPercentage= 0.8;
                        $scope.layout.bigFixedRatio= false;
                        $scope.layout.bigMaxRatio= 3/2;
                        $scope.layout.bigMinRatio= 9/16;
                        $scope.layout.bigFirst= true;
                        session.on('streamCreated', function(event) {
                        //this will execute to test the network ---- 
                            var el = document.createElement("div");
                            el.classList.add('OT_'+event.stream.streamId);
                            session.subscribe(event.stream,el);
                            layoutEl.appendChild(el);
                            createLayout(layoutEl,$scope.layout);
                            el.onclick = function(){
                                if ($(this).hasClass("OT_big")) {
                                    $(this).removeClass("OT_big");
                                } else {
                                    $(this).addClass("OT_big");
                                }
                                createLayout(layoutEl,$scope.layout);        
        
                            }
                        });
        
                        
                            session.on("streamDestroyed", function(event) {
                                var elem = document.querySelector('.OT_'+event.stream.streamId);
                                elem.parentNode.removeChild(elem);
                                //console.log(document.getElementsByClassName('OT_'+event.stream.streamId)[0]);
                                //layoutEl.parentNode.removeChild('OT_'+event.stream.streamId);
                                //layoutEl.removeChild(document.getElementsByClassName('OT_'+event.stream.streamId)[0]);
                                createLayout(layoutEl,$scope.layout);
        
                            });
        
        
                        // session.on('streamCreated', function(event) {
                        //     $scope.isDocPublishing = true;
                        //     session.subscribe(event.stream, 'doctorPublisher', {
                        //         insertMode: 'append',
                        //         width: '100%',
                        //         height: '100%'
                        //     });
                        // });
        
                        session.on('sessionDisconnected', function(event) {
                            console.log('You were disconnected from the session.', event.reason);
                        });
        
                        session.connect($scope.inviteToken, function(error) {
                            var layoutEl = document.getElementById("layout");
                            var layout;
                            $scope.layout = {};
                            $scope.layout.animate = {};
                            $scope.layout.animate.duration = 200; 
                            $scope.layout.animate.easing = 'swing';
                            $scope.layout.maxRatio= 3/2;
                            $scope.layout.minRatio= 9/16;
                            $scope.layout.fixedRatio= false;
                            $scope.layout.animate= false;
                            $scope.layout.bigClass= 'OT_big';
                            $scope.layout.bigPercentage= 0.8;
                            $scope.layout.bigFixedRatio= false;
                            $scope.layout.bigMaxRatio= 3/2;
                            $scope.layout.bigMinRatio= 9/16;
                            $scope.layout.bigFirst= true;
                            var el = document.createElement("div");
                            
                            layoutEl.appendChild(el);
                            createLayout(layoutEl,$scope.layout);
                            if (!error) {
                                var publisherProperties = {name:$scope.thirdPartyPublisher.firstname+' '+$scope.thirdPartyPublisher.lastname,width:'900px',height:'500px'};
                                var publisher = OT.initPublisher(el,publisherProperties, {
                                    resolution: '320x240', 
                                    frameRate: 1
                                });
                                session.publish(publisher);  
                            } else {
                                console.log('There was an error connecting to the session: ', error.code, error.message);
                            }
                        
                            $scope.disableDocCallAudio = function(){
                                if($scope.isDocPublishAudio == 1){
                                   $scope.isDocPublishAudio = 0; 
                                    publisher.publishAudio(false);
                                }else{
                                    $scope.isDocPublishAudio = 1;
                                    publisher.publishAudio(true);
                                }    
                                $('#addPsuedoContent1 span i').toggleClass('afterContentIcon1');
                            }
        
                            $scope.disableDocCallVideo = function(){
                                if($scope.isDocPublishVideo == 1){
                                   $scope.isDocPublishVideo = 0; 
                                    publisher.publishVideo(false);
        
                                }else{
                                    $scope.isDocPublishVideo = 1;
                                    publisher.publishVideo(true);
                                }    
                                $('#addPsuedoContent span i').toggleClass('afterContentIcon');
                            }
                        });
                        
                   // }
                    /*else if(result.acode == 0){
                        
                        $rootScope.isCallScreenHidden = 1;
                        $("#bootstrapModalNetworkCheckFail").modal();
                        
                        
                    }else{
                        
                        $rootScope.isCallScreenHidden = 1;
                        //return false;
                    }
                    
                })
                if(!x.mobile) $rootScope.isCallScreenHidden = 0;
                
            }    */
            $scope.inviteRoomForm = function(x){
                $scope.xvalues = x;
                $log.log($scope.xvalues);
                $log.log($scope.xvalues);
                      $scope.thirdPartyPublisher = $scope.xvalues;    
                    roomServices.checkConnectCallBycallId({
                    phone: $scope.xvalues.mobile, call_id: $scope.call_id
                      })
                    .then(function (result) {
                        if (result.data.status_code == 200) {
                        $rootScope.isCallScreenHidden = 0;
                        if($scope.xvalues.mobile){
                            roomServices.verifyThirdPartyDoc($scope.xvalues.mobile)
                            .then(function(result){
                                if(result.data.status_code == 200){
                                    let params = {};
                                    params.id = result.data.result.id;


                                    //add for update doctor Id in patient record by call id
                                    roomServices.updatedoctoridbycallid({ docId: params.id, call_id: $scope.call_id,doctor_call_respond:1}).then(function (updateresult) {
                                        $log.log(updateresult);
                                        
                                    })



                                    roomServices.setThirdPartyDocData($scope.xvalues);
                                    roomServices.sendPushNotificationStaffAdmin(params)
                                    .then(function(result){
                                        $log.log(result);
                                        //$scope.loading = false;
                                    })
                                    
                                }
                            })
                        }
                        
                        
                        socketService.emit('otheruserjoin',{otherUserName:x.firstname+' '+x.lastname},function(data){
                            $log.log("user added");
                            $log.log(data);
                        });
        
                        var session = OT.initSession(config.opentokAPIKey,$scope.inviteSession);
                        socketService.on('callDisconnectedByDoc', function(data){
                        console.log(data);
                        $scope.callDisconnectedByDoc = function(){
                            if(roomServices.getThirdPartyDocData() != undefined){
                                let updateParams = {};
                                updateParams.phone = roomServices.getThirdPartyDocData().mobile;
                                roomServices.updateThirdPartyDoc(updateParams)
                                .then(function(result){
                                    if(result.data.status_code == 200){
                                        let params = {};
                                        params.id = result.data.result.id;
                                        roomServices.sendPushNotificationStaffAdmin(params)
                                        .then(function(result){
                                            $log.log(result);
                                            $scope.loading = false;
                                        })
                                    }
                                    $log.log(result);
                                })
                            }
                            
        
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
                    session.disconnect();
        
                    });
                        var subscriber;
                        $scope.isDocPublishVideo = 1;
                        $scope.isDocPublishAudio = 1;
                        $scope.disconnectSession = function(role){

                            //alert(role);
                                //$scope.isCallScreenHidden = 1;
                            var modalInstance = $uibModal.open({
                                templateUrl: "CallEndThirdPartyPopUp.html",
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
        
                        }
        
                        var layoutEl = document.getElementById("layout");
                        var layout;
                        $scope.layout = {};
                        $scope.layout.animate = {};
                        $scope.layout.animate.duration = 200; 
                        $scope.layout.animate.easing = 'swing';
                        $scope.layout.maxRatio= 3/2;
                        $scope.layout.minRatio= 9/16;
                        $scope.layout.fixedRatio= false;
                        $scope.layout.animate= false;
                        $scope.layout.bigClass= 'OT_big';
                        $scope.layout.bigPercentage= 0.8;
                        $scope.layout.bigFixedRatio= false;
                        $scope.layout.bigMaxRatio= 3/2;
                        $scope.layout.bigMinRatio= 9/16;
                        $scope.layout.bigFirst= true;
                        session.on('streamCreated', function(event) {
                        //this will execute to test the network ---- 
                            var el = document.createElement("div");
                            el.classList.add('OT_'+event.stream.streamId);
                            session.subscribe(event.stream,el);
                            layoutEl.appendChild(el);
                            createLayout(layoutEl,$scope.layout);
                            el.onclick = function(){
                                if ($(this).hasClass("OT_big")) {
                                    $(this).removeClass("OT_big");
                                } else {
                                    $(this).addClass("OT_big");
                                }
                                createLayout(layoutEl,$scope.layout);        
        
                            }
                        });
        
                        
                            session.on("streamDestroyed", function(event) {
                                var elem = document.querySelector('.OT_'+event.stream.streamId);
                                elem.parentNode.removeChild(elem);
                                //console.log(document.getElementsByClassName('OT_'+event.stream.streamId)[0]);
                                //layoutEl.parentNode.removeChild('OT_'+event.stream.streamId);
                                //layoutEl.removeChild(document.getElementsByClassName('OT_'+event.stream.streamId)[0]);
                                createLayout(layoutEl,$scope.layout);
        
                            });
        
        
                        // session.on('streamCreated', function(event) {
                        //     $scope.isDocPublishing = true;
                        //     session.subscribe(event.stream, 'doctorPublisher', {
                        //         insertMode: 'append',
                        //         width: '100%',
                        //         height: '100%'
                        //     });
                        // });
        
                        session.on('sessionDisconnected', function(event) {
                            console.log('You were disconnected from the session.', event.reason);
                        });
        
                        session.connect($scope.inviteToken, function(error) {
                            var layoutEl = document.getElementById("layout");
                            var layout;
                            $scope.layout = {};
                            $scope.layout.animate = {};
                            $scope.layout.animate.duration = 200; 
                            $scope.layout.animate.easing = 'swing';
                            $scope.layout.maxRatio= 3/2;
                            $scope.layout.minRatio= 9/16;
                            $scope.layout.fixedRatio= false;
                            $scope.layout.animate= false;
                            $scope.layout.bigClass= 'OT_big';
                            $scope.layout.bigPercentage= 0.8;
                            $scope.layout.bigFixedRatio= false;
                            $scope.layout.bigMaxRatio= 3/2;
                            $scope.layout.bigMinRatio= 9/16;
                            $scope.layout.bigFirst= true;
                            var el = document.createElement("div");
                            
                            layoutEl.appendChild(el);
                            createLayout(layoutEl,$scope.layout);
                            if (!error) {
                                var publisherProperties = {name:$scope.thirdPartyPublisher.firstname+' '+$scope.thirdPartyPublisher.lastname,width:'900px',height:'500px'};
                                var publisher = OT.initPublisher(el,publisherProperties, {
                                    resolution: '320x240', 
                                    frameRate: 1
                                });
                                session.publish(publisher);  
                            } else {
                                console.log('There was an error connecting to the session: ', error.code, error.message);
                            }
                        
                            $scope.disableDocCallAudio = function(){
                                if($scope.isDocPublishAudio == 1){
                                   $scope.isDocPublishAudio = 0; 
                                    publisher.publishAudio(false);
                                }else{
                                    $scope.isDocPublishAudio = 1;
                                    publisher.publishAudio(true);
                                }    
                                $('#addPsuedoContent1 span i').toggleClass('afterContentIcon1');
                            }
        
                            $scope.disableDocCallVideo = function(){
                                if($scope.isDocPublishVideo == 1){
                                   $scope.isDocPublishVideo = 0; 
                                    publisher.publishVideo(false);
        
                                }else{
                                    $scope.isDocPublishVideo = 1;
                                    publisher.publishVideo(true);
                                }    
                                $('#addPsuedoContent span i').toggleClass('afterContentIcon');
                            }
                        });
                        
                   
                if(!x.mobile) $rootScope.isCallScreenHidden = 0;
                }
                else if (result.data.status_code == 404 || result.data.status_code == 402) {
                            $rootScope.isCallScreenHidden = 0;
                            var modalInstance = $uibModal.open({
                                template: '\
                                <div class="modal-header bootstrap-modal-header">\
                                <h3 class="modal-title" id="modal-title">Message </h3>\
                                </div>\
                                <div class="modal-body bootstrap-modal-body" id="modal-body">\
                                <p>'+ result.data.status_message +' </p>\
                                </div>\
                                <div class="modal-footer bootstrap-modal-footer">\
                                    <button class="btn btn-primary" type="button" ng-click="cancelmodel()">OK</button>\
                                </div>\
                                ',
                                controller: ModalInstanceCtrl,
                                scope: $scope,
                                size: 'sm',
                                resolve: {
                                    sessionResolve: function () {
                                        return '';
                                    }
                                }
                            });
                            modalInstance.result.then(function (selectedItem) {
                                $scope.selected = selectedItem;
                               
                            }, function () {
                                $log.info('Modal dismissed at: ' + new Date());
                            });

                        } else {
                            alert("error");
                        }
                        });
                
            }
        }

        if($state.current.name == 'room'){
            $scope.inactiveAlias = 1;
            $scope.loading= true;
            $rootScope.title = "Tell Us About Yourself";
            localStorage.removeItem('userMeetingDetails');
            //localStorage.setItem('userMeetingDetails','');
            roomServices.removeMedicationService();
            roomServices.removeConditionService();
            roomServices.removeAllergyService();
            
            

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
                /*-------ab---determining the alias--------*/
             console.log($location.path());
            if($location.path().indexOf('cityhealth')!=-1){
                $cookieStore.put('aliasname','cityhealth');
            }else{ $cookieStore.put('aliasname','other'); }
            /*---------------------------------------------*/
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

            if(roomServices.getUserEmailPhone() != undefined){
                $scope.OTPParam = {};
                $scope.OTPParam.verifyType = roomServices.getUserEmailPhone().type;
                $scope.OTPParam.verifyValue = roomServices.getUserEmailPhone().value;
                $scope.OTPParam.alias = $state.params.id;
                roomServices.sendOTP($scope.OTPParam)
                .then(function(result){
                    $log.log(result);
                }) 
            }    


            $scope.loading = true;
            $scope.param = {};
            $scope.param.emailphone = useremailphone;
            $scope.param.employerId = appConfig.employerId; 
            //edited on 290718
            roomServices.checkPatientExistsemailphone($scope.param)
            .then(function(result){
                if(result.data.status_code == 200){
                    $scope.loading = false;
                    
                    roomServices.setUserMeetingDetails(result.data.result[0]);
                    /*---ab---saving some temporary patient details*/
                    $scope.userPatientData = {};
                    $scope.userPatientData.patientId = result.data.result[0].id;
                    $scope.userPatientData.patientEmail = result.data.result[0].email;
                    $scope.userPatientData.patientDob = result.data.result[0].dateofbirth;
                    roomServices.setUserPatientdata($scope.userPatientData);
                    /*---------------------------------------------*/
                }else{
                    $scope.loading = false;
                    localStorage.setItem('userMeetingDetails','');
                    //localStorage.removeItem('userMeetingDetails');
                }
                $state.go('verify');         
                //$state.go('room.user');         
                });
            
            }
        
        }

        


        if($state.current.name == 'room.user'){
            $rootScope.title = "Personal Info";
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

            $scope.passChecker = function(fg_newpass){   
                $scope.fg_newpass = fg_newpass;
                
                if($scope.fg_newpass != undefined){
                    if($scope.fg_newpass.length > 7 && /[ !@#$%^&*()_+\-=\[\]{};'':""\\|,.<>?]/.test($scope.fg_newpass) && /\d/.test($scope.fg_newpass) && (/[A-Z]/.test($scope.fg_newpass)) && ($scope.fg_newpass.toUpperCase() != $scope.fg_newpass)){
                        return true;
                    }else{
                        return false;
                    }
                }    
            }

               

            $scope.userDetailsForm = function(userMeetingDetails){

                $scope.param = {};
                if(userMeetingDetails.id != undefined){
                    $scope.param.id = userMeetingDetails.id;
                }
                $scope.param = userMeetingDetails;


                //new add for registration type
               // userMeetingDetails.registration_from = "CITYHEALTH"; //only for cityhealth portal--tested--


                roomServices.saveUserDetailsLocalstorage($scope.param);

                // add this for register patient---
                userMeetingDetails.employerId = appConfig.employerId;
                roomServices.saveUserMeetingDetails(userMeetingDetails)
                    .then(function (result) {
                        $log.log(result);
                        if (result.data.status_code == 200) {
                            $scope.param.id = result.data.result.patient_id;
                            roomServices.setUserMeetingDetails($scope.param);

                            /*---ab---saving some temporary patient details*/
                            $scope.userPatientData = {};
                            $scope.userPatientData.patientId = result.data.result.patient_id;
                            $scope.userPatientData.patientEmail = $scope.param.email;
                            $scope.userPatientData.patientDob = $scope.param.dateofbirth;
                            
                            roomServices.setUserPatientdata($scope.userPatientData);
                                $state.go('room.medicalHistory');
                            
                        } else {
                            alert("error");
                        }
                    })


                //$state.go('room.medicalHistory');
            }
            $scope.exitUserMeeting = function(){
                $state.go('room');
            }
            
               

            //$scope.userMeetingDetails.date_of_birth = moment($scope.userMeetingDetails.date_of_birth).format("MM/DD/YYYY");
        }

        if($state.current.name == 'room.medicalHistory'){
            $rootScope.title = "Medical History";
            if(roomServices.getMedicationService() != undefined){
                $scope.medications = roomServices.getMedicationService();    
            }else{
                $scope.medications = ['No Medications'];
            }

            if(roomServices.getConditionService() != undefined){
                $scope.conditions = roomServices.getConditionService();    
            }else{
                $scope.conditions = ['No Pre-existing medical conditions'];
            }

            if(roomServices.getAllergyService() != undefined){
                $scope.allergies = roomServices.getAllergyService();    
            }else{
                $scope.allergies = ['No Allergies'];
            }


            // medication ctrl
            $scope.searchMedications = function(x){
                if(x && x.length >= 2){
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
                    roomServices.saveMedicationService($scope.medications);

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
                    roomServices.saveConditionService($scope.conditions);
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
                if(x && x.length >= 2){
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
                    roomServices.saveAllergyService($scope.allergies);
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
                
                // add for staffid in patient record table
                var temppatientdata = roomServices.getUserPatientData();
  
                temppatientdata = temppatientdata || {};
                temppatientdata.staffid = 500;
                
                //add for save call start time
                temppatientdata.call_started = moment().format('YYYY-MM-DD');

                //add for generate callid by                 
                roomServices.generatecallidbypatientid(temppatientdata)
                    .then(function (result) {
                        $log.log(result);
                        if (result.data.status_code == 200) {
                           
                            $scope.call_id = result.data.result.call_id;
                           
                        } else {
                            alert("error");
                        }
                       
                        roomServices.savePatientCallIdlocalstorage($scope.call_id);
                    })

                    $state.go('room.symptoms');
                   
            }


        }

        

        if($state.current.name == 'room.symptoms'){
            /*---ab---getting url alias for symptom page diff--150618*/
            if($cookieStore.get('aliasname')){
              $scope.currentUrlAlias = $cookieStore.get('aliasname');    
            }
            /*-------------------------------------------------*/
            

            
            $rootScope.title = "Symptoms";
            //socketService.connect();
            $scope.symptoms = [];

            roomServices.saveUsersymptomlocalstorage([]);

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

                //addd this for reset 
                roomServices.saveUsersymptomlocalstorage($scope.symptoms)
            }


            $scope.selectedSymptoms = function(ev,y){
                if(ev == true){
                    $scope.symptoms.push(y);
                } 
                if(ev == false){
                    var index = $scope.symptoms.indexOf(y);
                    $scope.symptoms.splice(index,1);

                }       
            }

            $scope.userCheckIn = function(docid,groupid){
                checkNetworkCallback(function(result){ 
                    console.log(result);
                    if(result.acode == 1){
                        $log.log($scope.symptoms);
                        $scope.loading = true;
                        $scope.userLocalDetails = roomServices.getUserDetailsLocalstorage();
                        $scope.userLocalDetails.employerId = appConfig.employerId;
                        roomServices.saveUserMeetingDetails($scope.userLocalDetails)
                        .then(function(result){
                            $log.log(result);
                            if(result.data.status_code == 200){
                                $scope.IdJson = {}; 
                                $scope.IdJson.email = $scope.userLocalDetails.email;
                                if($scope.IdJson.email == ''){
                                    $scope.IdJson.email = $scope.userLocalDetails.phone;
                                }        
                                roomServices.getSavedUserId($scope.IdJson)
                                .then(function(result){
                                    if(result.data.status_code == 200){
                                        $scope.userFetchedId = result.data.result[0].id;
                                        $scope.param = {};
                                        $scope.param.docId = docid;
                                        $scope.param.groupId = groupid;
                                        if(JSON.parse(localStorage.getItem('userMeetingDetails')).id != undefined){
                                            
                                            $scope.param.userId = JSON.parse(localStorage.getItem('userMeetingDetails')).id;    
                                        }else{
                                            $scope.param.userId = $scope.userFetchedId;
                                            $scope.newLocalStorage = JSON.parse(localStorage.getItem('userMeetingDetails'));
                                            $scope.newLocalStorage.id = $scope.userFetchedId; localStorage.setItem("userMeetingDetails", JSON.stringify($scope.newLocalStorage));
                                        }
                                        $scope.param.symptom = JSON.stringify($scope.symptoms);
                                        $scope.param.allergy = JSON.stringify(roomServices.getAllergyService());
                                        $scope.param.medication = JSON.stringify(roomServices.getMedicationService());
                                        $scope.param.medical_condition = JSON.stringify(roomServices.getConditionService());
                                        /*added on 270718*/
                                        $scope.param.date_of_injury = "";
                                       $scope.param.state_of_injury = "";
                                       $scope.param.employer_name = "";
                                       /*----------------*/
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
                    }else if(result.acode == 0){
                        $("#bootstrapModalNetworkCheckFail").modal();
                        
                        
                    }else{
                        return false;
                    }
                })
                
            }
        }
/*---ab---change in if condition below to make sure that livecallin works---(150618)*/
        if($state.current.name == 'room.call' || $state.current.name == 'livecallIn'){

            
            
            $scope.isDocPublishing = false;
            //$('.doc-call-options').hide();
            $scope.calltype = roomServices.getgroupcalltype();
            var patientId = JSON.parse(localStorage.getItem('userMeetingDetails')).id;
            var patientName = JSON.parse(localStorage.getItem('userMeetingDetails')).first_name +' '+JSON.parse(localStorage.getItem('userMeetingDetails')).last_name; 
            
            $scope.patientNamemsg = patientName;

            var compiledeHTML = $compile("<chattemplate   sendername = \"'"+patientName+"'\" senderid = '"+patientId+"'  sender = \"'patient'\"  id = "+roomServices.getDocIdFromAlias()+" name = \"'"+roomServices.getDocNameFromAlias()+"'\" ></chattemplate>")($scope); //<div chattemplate></div>
            $('#chatRoom').append(compiledeHTML);
            
            $scope.liveCallOpentokServiceCall  = function(x){
            	
            	$scope.param = {};
                $scope.param.id = x;    
                roomServices.getOpentokRoomKeys($scope.param)
                .then(function(result){
                    if(result.data.status_code == 200){
                        $scope.opentokKeys = result.data.result[0];
                        var session = OT.initSession(config.opentokAPIKey,$scope.opentokKeys.session);
                        var subscriber;
                        $scope.patPublisher = JSON.parse(localStorage.getItem('userMeetingDetails')).first_name +' '+JSON.parse(localStorage.getItem('userMeetingDetails')).last_name;
                        $scope.isDocPublishVideo = 1;
                        $scope.isDocPublishAudio = 1;
                        socketService.on('doctorGoneOffline', function(data){
                            $log.log(data);
                        });
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
                            session.disconnect();
                        });
                        

                        var layoutEl = document.getElementById("layout");
                        var layout;
                        $scope.layout = {};
                        $scope.layout.animate = {};
                        $scope.layout.animate.duration = 200; 
                        $scope.layout.animate.easing = 'swing';
                        $scope.layout.maxRatio= 3/2;
                        $scope.layout.minRatio= 9/16;
                        $scope.layout.fixedRatio= false;
                        $scope.layout.animate= false;
                        $scope.layout.bigClass= 'OT_big';
                        $scope.layout.bigPercentage= 0.8;
                        $scope.layout.bigFixedRatio= false;
                        $scope.layout.bigMaxRatio= 3/2;
                        $scope.layout.bigMinRatio= 9/16;
                        $scope.layout.bigFirst= true;



                        session.on('streamCreated', function(event) {
                            var el = document.createElement("div");
                            el.classList.add('OT_'+event.stream.streamId);
                            session.subscribe(event.stream,el);
                            layoutEl.appendChild(el);
                            createLayout(layoutEl,$scope.layout);
                            el.onclick = function(){
                                if ($(this).hasClass("OT_big")) {
                                    $(this).removeClass("OT_big");
                                } else {
                                    $(this).addClass("OT_big");
                                }
                                createLayout(layoutEl,$scope.layout);        
                            }
                        });

                        session.on("streamDestroyed", function(event) {
                            var elem = document.querySelector('.OT_'+event.stream.streamId);
                            elem.parentNode.removeChild(elem);
                            createLayout(layoutEl,$scope.layout);
                        });
                        
                        session.on('sessionDisconnected', function(event) {
                            console.log('You were disconnected from the session.', event.reason);
                        });

                        session.connect($scope.opentokKeys.token, function(error){
                            var layoutEl = document.getElementById("layout");
                            var layout;
                            $scope.layout = {};
                            $scope.layout.animate = {};
                            $scope.layout.animate.duration = 200; 
                            $scope.layout.animate.easing = 'swing';
                            $scope.layout.maxRatio= 3/2;
                            $scope.layout.minRatio= 9/16;
                            $scope.layout.fixedRatio= false;
                            $scope.layout.animate= false;
                            $scope.layout.bigClass= 'OT_big';
                            $scope.layout.bigPercentage= 0.8;
                            $scope.layout.bigFixedRatio= false;
                            $scope.layout.bigMaxRatio= 3/2;
                            $scope.layout.bigMinRatio= 9/16;
                            $scope.layout.bigFirst= true;
                            var el = document.createElement("div");
                            
                            layoutEl.appendChild(el);
                            console.log(createLayout(layoutEl,$scope.layout));
                            $scope.isDocPublishing = true;
                            
                            if (!error) {
                                var publisherProperties = {name:$scope.patPublisher,width:'950px',height:'500px'};
                                var publisher = OT.initPublisher(el,publisherProperties, {
                                    resolution: '320x240', 
                                    frameRate: 1
                                });
                                session.publish(publisher);  
                            } else {
                                console.log('There was an error connecting to the session: ', error.code, error.message);
                            }
                        

                            $scope.disableDocCallAudio = function(){
                                if($scope.isDocPublishAudio == 1){
                                   $scope.isDocPublishAudio = 0; 
                                    publisher.publishAudio(false);
                                }else{
                                    $scope.isDocPublishAudio = 1;
                                    publisher.publishAudio(true);
                                }    
                                $('#addPsuedoContent1 span i').toggleClass('afterContentIcon1');
                            }

                            $scope.disableDocCallVideo = function(){
                                if($scope.isDocPublishVideo == 1){
                                   $scope.isDocPublishVideo = 0; 
                                    publisher.publishVideo(false);

                                }else{
                                    $scope.isDocPublishVideo = 1;
                                    publisher.publishVideo(true);
                                }    
                                $('#addPsuedoContent span i').toggleClass('afterContentIcon');
                            }

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


                                    
                                
                            }
                        });
                    }else{
                        alert("error");
                    }
                })


            }
            


            $rootScope.title = "Patient Live Call";
            $scope.IdJson = {};
            $scope.IdJson.email = JSON.parse(localStorage.getItem('userMeetingDetails')).email; 
            if($scope.IdJson.email == ''){
                $scope.IdJson.email = JSON.parse(localStorage.getItem('userMeetingDetails')).phone;
            }

            if(JSON.parse(localStorage.getItem('userMeetingDetails')).id != undefined && JSON.parse(localStorage.getItem('userMeetingDetails')).id != ''){
                $scope.userId = JSON.parse(localStorage.getItem('userMeetingDetails')).id; 
                $scope.liveCallOpentokServiceCall($scope.userId);

                
            }else{
                roomServices.getSavedUserId($scope.IdJson)
                .then(function(result){
                    if(result.data.status_code == 200){
                        $scope.userId = result.data.result[0].id;
                        $scope.liveCallOpentokServiceCall($scope.userId);

                    }else{
                        alert("error");
                    }
                })
            }
        }

   if($state.current.name == 'insurancedetails'){

    /*getting patient details*/
    $scope.localPatientDetails = roomServices.getUserPatientData();
    console.log($scope.localPatientDetails);
     

   // add if check for make secure without patient details
   if ($scope.localPatientDetails) {

       $scope.patientId = $scope.localPatientDetails.patientId;
       $scope.dateOfBirth = moment($scope.localPatientDetails.patientDob).format('YYYY-MM-DD');
   }
       
    $scope.userInsuranceData = {};
    $scope.checkInsuranceData = function(){
        if(($scope.insureKey).length>0){
            $scope.loading = true;
            $http.get(config.serverBaseUrl+'/insurances/'+$scope.insureKey)
                .then(function(response){
                    if(response.data.status_code==200){
                        $scope.loading = false;
                        $scope.insuranceData = response.data.result;
                        if($scope.insuranceData.length<1){ $scope.insuranceMsg = 'No record found'; }
                        else{ $scope.insuranceMsg = ''; }
                    }
                    });
        }
        else{
            $scope.insuranceData = {};
            $scope.loading = false;
        }
    }
    $scope.selectInsurance = function(x){
        $scope.userInsuranceData.selectedInsurance = x.name;
          $('#insureKey').val(x.name);
          $('#tradingPid').val(x.name);
          $scope.insuranceData = '';

    }
    $scope.removeSelectedIns = function(){
          $scope.userInsuranceData.selectedInsurance = '';
          $('#insureKey').val('');
          $('#tradingPid').val('');
    }
    /*$scope.insuranceDetailsNext = function(){
          console.log($scope.userInsuranceData);
    }*/
    $scope.insuranceDetailsSave = function(para){
        $scope.tradingPartnerId = $('#tradingPid').val();
        if($scope.userInsuranceData.insuredName!=undefined && $scope.userInsuranceData.memberId!=undefined && $scope.userInsuranceData.groupId!=undefined && $scope.tradingPartnerId!=''){
           
        /*check eligibility starts*/
        $http({
            method:'POST',
            url:config.serverBaseUrl+'/pokitdok/eligibility',
            data:$.param({ 'patientId':$scope.patientId, 'dateOfBirth':$scope.dateOfBirth, 'fullName':$scope.userInsuranceData.insuredName, 'memberId':$scope.userInsuranceData.memberId, 'tradingPartnerId':$scope.tradingPartnerId }),
            headers : {'Content-Type': "application/x-www-form-urlencoded"}
        }).then(function(response){
            console.log(response);
            $rootScope.amountToPay = response.data.copayAmount;

            /*-------------*/
            $http({
                method:'POST',
                url:config.serverBaseUrl+'/insurances',
                data:$.param({'patient_id':$scope.patientId,'patient_name':$scope.userInsuranceData.insuredName,'member_id':$scope.userInsuranceData.memberId,'group_number':$scope.userInsuranceData.groupId}),
                headers : {'Content-Type': "application/x-www-form-urlencoded"}
            }).then(function(response){
                if(response.data.status_code==201){
                    if(para=='save'){
                    var modalInstance = $uibModal.open({
                            template:'\
                                <div class="modal-header bootstrap-modal-header">\
                                <h3 class="modal-title" id="modal-title">Message </h3>\
                                </div>\
                                <div class="modal-body bootstrap-modal-body" id="modal-body">\
                                <p> Saved.</p>\
                                </div>\
                                <div class="modal-footer bootstrap-modal-footer">\
                                    <button class="btn btn-primary" type="button" ng-click="cancel()">OK</button>\
                                </div>\
                                ',
                            controller: ModalInstanceCtrl,
                            scope: $scope,
                            size:'sm',
                            resolve: {
                                sessionResolve :  function(){
                                    return '';
                                } 
                            }
                        });
                       }
                       else{
                        if($rootScope.amountToPay!='' && $rootScope.amountToPay!=undefined){
                           $state.go('billingdetails');    
                        }else{ alert('Billing amount not found');  }
                        
                       }
                }

            })
        })
        /*check eligibility ends*/

            
        }else{
             alert('some error');
        }
    }

    $scope.insureToSym = function(){
        $window.history.back();
    }

  }

  /*-------------ab--payment details page--------------*/
  if($state.current.name == 'billingdetails'){
    $scope.paymentData = {};
    $scope.amount = $rootScope.amountToPay;
    $scope.message = 'Please use the form below to pay:';
    $scope.showDropinContainer = true;
    $scope.isError = false;
    $scope.isPaid = false;

    $scope.getToken = function () {

      $http({
        method: 'GET',
        url: config.serverBaseUrl+'/braintree/client_token',
        headers: {'Content-Type': "application/x-www-form-urlencoded"}
      }).then(function (response) {

        $scope.temp_token_variable = response.data.result;
        braintree.setup($scope.temp_token_variable, 'dropin', {
          container: 'checkout',
          // Form is not submitted by default when paymentMethodNonceReceived is implemented
          paymentMethodNonceReceived: function (event, nonce) {

            $scope.message = 'Processing your payment...';
            $scope.showDropinContainer = false;

            $http({
              method: 'POST',
              url: config.serverBaseUrl+'/braintree/checkout',
              data: $.param({ amount: $scope.amount, payment_method_nonce: nonce}),
              headers: {'Content-Type': "application/x-www-form-urlencoded"}
            }).then(function (response) {
               
              
              if (response.data.status_code==200) {
                $scope.message = 'Payment successfully done, thanks.';
                $scope.showDropinContainer = false;
                $scope.isError = false;
                $scope.isPaid = true;
                
                $timeout(function() {
                $scope.message = 'Wait.... Redirecting to check in.';
                $scope.withInsProceedToCheckin();

                }, 3000);

              } else {
                $scope.message = 'Payment failed please refresh the page and try again.';
                $scope.isError = true;
              }

            })

          }
        });

      })

    };

    $scope.withInsProceedToCheckin = function(){
        //$scope.dataParam.alias = $state.params.id;
        $scope.dataParam = {};
        $scope.dataParam.alias = 'cityhealth';
        roomServices.getDocFromAlias($scope.dataParam)
        .then(function(result){
        if(result.data.status_code == 200){
                    if(result.data.result.length == 0){
                        $scope.loading= false;
                        $scope.inactiveAlias = 1;

                    }else{
						try {
                            if (result.data.result[0].group_id) {

                                roomServices.setgroupcalltype(result.data.result[0].group_id);
                            } else {
                                roomServices.setgroupcalltype(result.data.result[0].group_id);
                            }

                        } catch (err) { 
						}
                        $scope.docIdFromAlias = result.data.result[0].id;
                        $scope.docGroupIdFromAlias = result.data.result[0].group_id;
                            var docid = $scope.docIdFromAlias;
                            var groupid = $scope.docGroupIdFromAlias;
                //checkNetworkCallback(function(result){
                    //console.log(result);
                    //if(result.acode == 1){
                        $log.log($scope.symptoms);
                        $scope.loading = true;
                        $scope.userLocalDetails = roomServices.getUserDetailsLocalstorage();
                        $scope.userLocalDetails.employerId = appConfig.employerId;
                        roomServices.saveUserMeetingDetails($scope.userLocalDetails)
                        .then(function(result){
                            $log.log(result);
                            if(result.data.status_code == 200){
                                $scope.IdJson = {}; 
                                $scope.IdJson.email = $scope.userLocalDetails.email;
                                if($scope.IdJson.email == ''){
                                    $scope.IdJson.email = $scope.userLocalDetails.phone;
                                }        
                                roomServices.getSavedUserId($scope.IdJson)
                                .then(function(result){
                                    if(result.data.status_code == 200){
                                        $scope.userFetchedId = result.data.result[0].id;
                                        $scope.param = {};
                                        $scope.param.docId = docid;
                                        $scope.param.groupId = groupid;
                                        if(JSON.parse(localStorage.getItem('userMeetingDetails')).id != undefined){
                                            
                                            $scope.param.userId = JSON.parse(localStorage.getItem('userMeetingDetails')).id;    
                                        }else{
                                            $scope.param.userId = $scope.userFetchedId;
                                            $scope.newLocalStorage = JSON.parse(localStorage.getItem('userMeetingDetails'));
                                            $scope.newLocalStorage.id = $scope.userFetchedId; localStorage.setItem("userMeetingDetails", JSON.stringify($scope.newLocalStorage));
                                        }
                                        $scope.param.symptom = JSON.stringify(roomServices.getUsersymptomlocalstorage());
                                        $scope.param.allergy = JSON.stringify(roomServices.getAllergyService());
                                        $scope.param.medication = JSON.stringify(roomServices.getMedicationService());
                                        $scope.param.medical_condition = JSON.stringify(roomServices.getConditionService());

                                        $scope.param.call_id = JSON.stringify(roomServices.getPatientCallIdlocalstorage());
                                        /*added on 270718*/
                                        $scope.param.date_of_injury = "";
                                       $scope.param.state_of_injury = "";
                                       $scope.param.employer_name = "";  
                                        /*----------------*/
                                        roomServices.addUserToWaiting($scope.param)
                                        .then(function(result){
                                            if(result.data.status_code == 200){ 
        
                                                socketService.emit('userjoin',{waitingId:$scope.userFetchedId},function(data){
                                                    $log.log("user added");
                                                    $log.log(data);
                                                });
                                                $scope.loading = false;
                                                $log.log(result);
                                                $state.go('livecallIn');
                                            }else{
                                                $scope.loading = false;
                                                alert("error");
                                                /*---ab---user id not found*/
                                        if($cookieStore.get('aliasname')==cityhealth){
                                        $state.go('insurancedetails');
                                        }/*------------------------*/
                                            }
                                            })

                                        //for update data based on callid(07102018)
                                        
                                        roomServices.updatedatabycallid($scope.param)
                                            .then(function (result) {
                                                $log.log(result);
                                                
                                                if (result.data.status_code == 200) {
                                                    
                                                }
                                            });



                                    }else{
                                        alert("error");
                                        /*---ab---user id not found*/
                                        if($cookieStore.get('aliasname')==cityhealth){
                                        $state.go('insurancedetails');
                                        }/*------------------------*/
                                    }
                                    })
                            }else{
                                alert("error");
                            }
                            })
                    //}else if(result.acode == 0){
                        //$("#bootstrapModalNetworkCheckFail").modal();
                        
                        
                   // }else{
                       // return false;
                    //}
                //})
                
            //}
                        /*--------user check in to video conference ends*/
                        //$scope.withInsProceedToCheckin();
                    }
                }
            });
    }

    //$scope.getToken();
  }
  /*---------------------------------------------------*/
}
var ModalInstanceCtrl = function ($scope,$rootScope,$uibModalInstance,$log,$state,sessionResolve,roomServices,socketService) {

    $scope.callEndThirdParty = function(){
            if(roomServices.getThirdPartyDocData() != undefined){
                let updateParams = {};
                updateParams.phone = roomServices.getThirdPartyDocData().mobile;
                roomServices.updateThirdPartyDoc(updateParams)
                .then(function(result){
                    if(result.data.status_code == 200){
                        let params = {};
                        params.id = result.data.result.id;

                        roomServices.sendPushNotificationStaffAdmin(params)
                        .then(function(result){
                            $log.log(result);
                            $scope.loading = false;
                        })
                    }
                    $log.log(result);
                })
            }

            socketService.emit('calldisconnectedByThirdParty',{notifyTo:'patient'},function(data){
                $log.log("call end")
                $log.log(data);
            });

            sessionResolve.disconnect();
            $state.go('invite');
            $rootScope.isCallScreenHidden = 1;
            $uibModalInstance.dismiss('cancel'); 
    }

    if($state.current.name == 'room'){
        $scope.cancel();
        $uibModalInstance.dismiss('cancel');
    }
    if($state.current.name == 'inviteRoom' && $rootScope.isCallScreenHidden == 1){
        $scope.cancel();
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

    $scope.gotoRoom = function(x){
        
        if(x == 2){
            //sessionResolve.disconnect();
            $state.go('room');
            $uibModalInstance.dismiss('cancel'); 
        }
        if(x == 3){
            
            if(roomServices.getThirdPartyDocData() != undefined){
                let updateParams = {};
                updateParams.phone = roomServices.getThirdPartyDocData().mobile;
                roomServices.updateThirdPartyDoc(updateParams)
                .then(function(result){
                    if(result.data.status_code == 200){
                        let params = {};
                        params.id = result.data.result.id;
                        roomServices.sendPushNotificationStaffAdmin(params)
                        .then(function(result){
                            $log.log(result);
                            $scope.loading = false;
                        })
                    }
                    $log.log(result);
                })
            }
            //sessionResolve.disconnect();
            $state.go('invite');
            $rootScope.isCallScreenHidden = 1;
            $uibModalInstance.dismiss('cancel');    
        }

        
    }


}


})();
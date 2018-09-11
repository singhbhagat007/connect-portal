(function(){
    'use strict';
    angular
        .module('AkosPCP')
        .controller('onlineDoctorCtrl',onlineDoctorCtrl);
    onlineDoctorCtrl.$inject = ['$scope', '$http', '$rootScope', '$location', '$window', '$log', 'doctorServices', 'tokenValidatorService', '$cookieStore', '$state', '$uibModal', 'moment', 'config', 'socketService', '$filter', 'pdfChartingService', '$compile', 'roomServices', '$interval','appConfig'];
    function onlineDoctorCtrl($scope, $http, $rootScope, $location, $window, $log, doctorServices, tokenValidatorService, $cookieStore, $state, $uibModal, moment, config, socketService, $filter, pdfChartingService, $compile, roomServices, $interval, appConfig){
        
        /*added on 310718*/
        //add for notify by email and sms
        $scope.ppmeetingBaseUrl1 = '';

        $scope.ppmeetingBaseUrl1 = doctorServices.getInviteUrl();
        
		//add for notify by email and sms 
        $scope.inviteOtherFriendMeeting = function (email, link) {


            $scope.loading = true;
            $scope.param = {};
            $scope.param.patientEmail = email;
            $scope.param.docMeetingEmailLink = link;
            doctorServices.sendEmailMeetingLink($scope.param)
                .then(function (result) {
                    if (result.data.status_code == 200) {
                        $scope.loading = false;
                        toastr.success('Email sent successfully');
                    } else {
                        alert("error");
                    }
                })
        }

        $scope.inviteOtherFriendMeetingSMS = function (phone, link) {
            $scope.loading = true;
            $scope.param = {};
            $scope.param.patientPhone = phone;
            $scope.param.docMeetingSMSLink = link;
            doctorServices.sendSMSMeetingLink($scope.param)
                .then(function (result) {
                    if (result.data.status_code == 200) {
                        $scope.loading = false;
                        toastr.success('SMS sent successfully');
                    } else {
                        toastr.error('SMS not sent');
                    }
                })
        }
        
        $scope.getOnlineDoctor = function(){
            doctorServices.doctorAvailableUnavailable()
            .then(function(result){
                if(result.data.status_code == 200){
                    $scope.onlineDoctor = result.data.result;

                    //$scope.usEncodedNumber = (""+$scope.verifyData.value).replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '($1) $2-$3');
                    angular.forEach($scope.onlineDoctor, function(value, key) {
                        let stime = moment(value.last_call_picked_at).format('HH:mm:ss');
                        let etime = moment().format('HH:mm:ss');
                        let timediff = moment(etime, 'HH:mm:ss').diff(moment(stime, 'HH:mm:ss'), 'seconds');
                        timediff = Math.abs(timediff);
                        
                        if(timediff <= 1800){ 
                            timediff = timediff - 1800;
                            timediff = Math.abs(timediff);
                            let minutes =  parseInt(timediff / 60, 10);  //min
                            let seconds = parseInt(timediff % 60, 10); //sec
                            minutes = minutes < 10 ? "0" + minutes : minutes;
                            seconds = seconds < 10 ? "0" + seconds : seconds;
                            value.timer = minutes + ":" + seconds;
                            
                        }else{
                            value.timer = "available";
                            
                        }
                        value.timer = "available1";
						
						
						/*
                        let tab1 = JSON.parse(value.tab1);
                        if(tab1){
                            let state1 = (tab1.state1 && tab1.state1 != 'undefined') ? tab1.state1 : '';
                            let state2 = (tab1.state2 && tab1.state2 != 'undefined') ? ', '+tab1.state2 : '';
                            let state3 = (tab1.state3 && tab1.state3 != 'undefined') ? ', '+tab1.state3 : '';
                            let state4 = (tab1.state4 && tab1.state4 != 'undefined') ? ', '+tab1.state4 : '';
                            let state5 = (tab1.state5 && tab1.state5 != 'undefined') ? tab1.state5 : '';
                            let state = state1+state2+state3+state4+state5;
                            value.state = state; 
                            value.tab1 = "";
                            value.phoneNo = (""+value.phoneNo).replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '($1) $2-$3');       
                        }*/
						
						value.state = value.tab1; 
                        value.tab1 = "";
						value.phoneNo = (""+value.phoneNo).replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '($1) $2-$3');  
                        
                    });
                }else{
                    
                }
            })
        } 
        
		
	$scope.inviteOtherFriendMeeting = function(email,link){

            
            $scope.loading = true;
            $scope.param = {};
            $scope.param.patientEmail = email;
            $scope.param.docMeetingEmailLink = link;
            doctorServices.sendEmailMeetingLink($scope.param)
            .then(function(result){
                if(result.data.status_code == 200){
                    $scope.loading = false;
                    toastr.success('Email sent successfully');
                }else{
                    alert("error");
                }
                })
        }

        $scope.inviteOtherFriendMeetingSMS = function(phone,link){
            $scope.loading = true;
            $scope.param = {};
            $scope.param.patientPhone = phone;
            $scope.param.docMeetingSMSLink = link;
            doctorServices.sendSMSMeetingLink($scope.param)
            .then(function(result){
                if(result.data.status_code == 200){
                    $scope.loading = false;
                    toastr.success('SMS sent successfully');
                }else{
                    toastr.error('SMS not sent');
                }
                })
        }


		
		
        $scope.sendWCStaffNotification = function(x){
            $scope.loading = true;
            let params = {};
            params.id = x;
            params.msgtext = appConfig.messages['notifyMessage'].message;
            doctorServices.sendWCStaffNotification(params)
            .then(function(result){
                if(result.data.status_code == 200){
                    $scope.loading = false;
                    toastr.success('Notification sent successfully');
                    //var modalInstance = $uibModal.open({
                    //    template:'\
                    //        <div class="modal-header bootstrap-modal-header">\
                    //        <h3 class="modal-title" id="modal-title">'+ appConfig.messages['notifyMessage'].title+'</h3>\
                    //        </div>\
                    //        <div class="modal-body bootstrap-modal-body" id="modal-body">\
                    //        <p class="text-center">'+ appConfig.messages['notifyMessage'].message+'</p>\
                    //        </div>\
                    //        <div class="modal-footer bootstrap-modal-footer">\
                    //            <button class="btn btn-primary" type="button" ng-click="cancel()">OK</button>\
                    //        </div>\
                    //        ',
                    //    controller: ModalInstanceCtrl,
                    //    scope: $scope,
                    //    size:'sm',
                    //    windowClass: 'disconnect-pop1-class',
                    //    resolve: {
                    //    }
                    //});
                    //modalInstance.result.then(function (selectedItem) {
                    //    $scope.selected = selectedItem;
                    //    }, function () {
                    //    $log.info('Modal dismissed at: ' + new Date());
                    //});    
                }else{
                    $scope.loading = false;
                    try {
                        toastr.error('Sorry, try again.');
                    } catch(err){ }

                    //var modalInstance = $uibModal.open({
                    //    template:'\
                    //        <div class="modal-header bootstrap-modal-header">\
                    //        <h3 class="modal-title" id="modal-title">'+ appConfig.messages['notifyMessage_unsuccess'].title +'</h3>\
                    //        </div>\
                    //        <div class="modal-body bootstrap-modal-body" id="modal-body">\
                    //        <p class="text-center">'+ appConfig.messages['notifyMessage_unsuccess'].message +'</p>\
                    //        </div>\
                    //        <div class="modal-footer bootstrap-modal-footer">\
                    //            <button class="btn btn-primary" type="button" ng-click="cancel()">OK</button>\
                    //        </div>\
                    //        ',
                    //    controller: ModalInstanceCtrl,
                    //    scope: $scope,
                    //    size:'sm',
                    //    windowClass: 'disconnect-pop1-class',
                    //    resolve: {
                    //    }
                    //});
                    //modalInstance.result.then(function (selectedItem) {
                    //    $scope.selected = selectedItem;
                    //    }, function () {
                    //    $log.info('Modal dismissed at: ' + new Date());
                    //});    
                }
                
            })
        }
        
        $scope.getOnlineDoctor();
        $interval(function() {
            $scope.getOnlineDoctor();
        }, 1000);

        $scope.searchstate = function () {
       
            if ($scope.onlineDocState1.length > 2) {
                $scope.onlineDocState = $scope.onlineDocState1;
            }
            if ($scope.onlineDocState.length > $scope.onlineDocState1.length) {
                $scope.onlineDocState = $scope.onlineDocState1;
            }
           // ng - model="onlineDocState"
        }
        
    }
    
    
    //var ModalInstanceCtrl = function ($scope,$uibModalInstance){
    //    $scope.cancel = function () {
    //        $uibModalInstance.dismiss('cancel');
    //    };    
    //}
    
    
    
    
})();
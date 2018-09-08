(function() {
    'use strict';
    angular.module('AkosPCP', [
        'ui.router',
        'ui.bootstrap',
        'ngMaterial',
        'moment-picker',
        'ngCookies',
        'ngclipboard',
        'ngSanitize',
        'ngMask',
        //'ngRoute',
        'AkosPCP.home',
        'AkosPCP.doctor',
        'AkosPCP.room',
        'AkosPCP.appLink'
    ])
    //.constant('config',{
    //  //serverBaseUrl : 'https://sandbox.connect-api.akosmd.com',
    //  //socketBaseUrl : 'https://sandbox.connect-api.akosmd.com',
    //  //opentokAPIKey : 45732912
    //    //serverBaseUrl : 'https://akosmd.com:3001',
    //    socketBaseUrl: 'https://akosmd.com:3001',
    //    serverBaseUrl: 'http://localhost:3001',
    //    opentokAPIKey: 45732912
    //  })
    // .config(function($httpProvider) {
    //   $httpProvider.interceptors.push('preventTemplateCache');
    // })
    .factory('preventTemplateCache',function(){
      var threeDigitRandom = Math.floor(Math.random() * 999);
      return {
        'request': function(config) {
          if (config.url.indexOf('template') !== -1) {
            config.url = config.url + '?v=' + threeDigitRandom;
          }
          return config;
        }
      }
    })
        .run(['$rootScope', '$window', '$location', '$log', '$cookieStore', '$state', 'config', 'roomServices', '$compile', '$uibModal', function ($rootScope, $window, $location, $log, $cookieStore, $state, config, roomServices, $compile, $uibModal){
            $rootScope.wrongbrowser = false;
            var browser = function () {

            var userAgent = navigator.userAgent;

            var browsers = {
                chrome: /chrome/g, mozilla: /Mozilla/g
            };

            for (var key in browsers) {
                if (browsers[key].test(userAgent)) {
                    return true;
                }
            };

            return false;
        }


        if (!browser()) {
             var modalInstance = $uibModal.open({
                template: '\
                                    <div class="modal-header bootstrap-modal-header unsupportedbrowser">\
                                    <h4 class="modal-title" id="modal-title">Unsupported Browser</h4>\
                                    </div>\
                                    <div class="modal-body " id="modal-body">\
                                   <p style="padding:10px;">Unfortunately the browser you are using is currently not supported. We only support latest Google Chrome browser at this time. If you have Google Chrome already installed, please open the portal using chrome otherwise please install chrome by clicking on the icon below.</p>\
                                     <div class="row" >\
                                    <div class="col-md-6" style="text-align:center" >\
                                    <a href="https://www.google.com/chrome/">\
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Google_Chrome_icon_%282011%29.svg/2000px-Google_Chrome_icon_%282011%29.svg.png" style="margin: 0 auto;width:30%;display:block;">\
                                    </a>\
                                     </div>\
                                    <div class="col-md-6" style="text-align:center" >\
                                    <a href="https://www.mozilla.org/en-US/firefox/new/">\
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZJ8dde0jCe8MUqVEO9BGHaA_JbXMpMs8hfcx0gsBOR8px0hfF9g" style="margin: 0 auto;width:30%;display:block;">\
                                    </a>\
                                    </div>\
                                    </div>\
                                    </div>\
                                    <div class="modal-footer bootstrap-modal-footer">\
                                        <button class="btn btn-primary" type="button" ng-click="cancel()">Close this window</button>\
                                    </div>\
                                    ',
                controller: ModalInstanceCtrl,
                scope: $rootScope,
                size: 'sm',
                windowClass: 'disconnect-pop1-class',
                resolve: {
                    modalProgressValue: function () {
                        return "";
                    },
                    CPTBilling: function () {
                        return "";
                    },
                    sessionResolve: function () {
                        return "";
                    },
                    meetingRoomURLResolve: function () {
                        return "";
                    },
                    emailMeetingLinkUrlResolve: function () {
                        return "";
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
           
            
        var clientURL = $location.absUrl().split("/#!")[0];

      var ua = navigator.userAgent.toLowerCase();
      var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
      if(isAndroid && $location.$$path.indexOf("/room/") != -1) {
        var roomAlias = $location.$$path.slice(6);
        if(typeof $location.search().inviteId != 'undefined'){
            window.location = clientURL+"/#!/appLink/"+roomAlias+'/@@*'+$location.search().inviteId;   
        }else{
          var obj = {};
          obj.room = roomAlias;
          roomServices.getProviderSetting(obj)
          .then(function(result){
            if(result.data.status_code == 200){
              var doctype = result.data.result[0].type;
              window.location = clientURL+"/#!/appLink/"+roomAlias+'/@@'+doctype; 
            }else{
              alert("error");
            }
          })
        }
      }
      
      
      var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        if(iOS == true && $location.$$path.indexOf("/room/") != -1){
        	var roomAlias = $location.$$path.slice(6);
          if(typeof $location.search().inviteId != 'undefined'){
            window.location = clientURL+"/#!/appLink/"+roomAlias+'/@@*'+$location.search().inviteId;    
          }else{
            var obj = {};
            obj.room = roomAlias;
            roomServices.getProviderSetting(obj)
            .then(function(result){
              if(result.data.status_code == 200){
                var doctype = result.data.result[0].type;
                window.location = clientURL+"/#!/appLink/"+roomAlias+'/@@'+doctype; 
              }else{
                alert("error");
              }
            })
          }
        }
        $rootScope.docData = JSON.parse(localStorage.getItem('pcpDocData'));//$cookieStore.get('pcpDocData'); 

        //if($cookieStore.get('pcpDocData')){} 
        var threeDigitRandom = Math.floor(Math.random() * 999);
        $('script').each(function(){
          var scriptAttr =  $(this).attr('src');
          if(scriptAttr !== undefined){
            $(this).attr('src',scriptAttr+'?v='+threeDigitRandom);  
          }
        })

        $('link').each(function(){
          var styleAttr =  $(this).attr('href');
          var styleRel =  $(this).attr('rel');
          if(styleAttr.indexOf('https') == -1 && styleRel == 'stylesheet'){
            $(this).attr('href',styleAttr+'?v='+threeDigitRandom);  
          }
        })
      
      

      $rootScope.$on('$locationChangeStart', function (event, toState, toParams, fromState, fromParams) {
      $window.scrollTo(0, 0);
      var authToken = localStorage.getItem('doc_token');
      function noBack() {
        window.history.forward();
      }

      if($location.$$path != '/wcNurse'){
        if((!authToken || authToken == '') && ($location.$$path == '/dashboard'|| $location.$$path == '/dashboard/livecall' )){
          $location.path('/');
        }
        if((!authToken || authToken == '') && $location.$$path == '/doctor') { 
          $rootScope.isLoggedIn = false;
          $location.path('/');
          localStorage.removeItem('pcpDocData');
          localStorage.removeItem('doc_token');
          localStorage.removeItem('connect_provider_settings');
        }
        if(authToken && ($location.$$path == "/")){
          $rootScope.isLoggedIn = false;
          localStorage.removeItem('pcpDocData');
          localStorage.removeItem('doc_token');
          localStorage.removeItem('connect_provider_settings');
        }
        if(authToken && ($location.$$path != "/") ){ 
          $rootScope.isLoggedIn = true;
          noBack();
        }
      }
      
      if(JSON.parse(localStorage.getItem('connect_provider_settings')) != undefined && JSON.parse(localStorage.getItem('connect_provider_settings')).type == "WC_NURSE" && authToken){
            let waitingname = 12;
            let onlineDoctorId =   document.createElement('div');
            onlineDoctorId.classList.add('onlineDoctorClass');
            document.body.appendChild(onlineDoctorId);
            $log.log(onlineDoctorId);
            onlineDoctorId.innerHTML = "<span data-toggle='tooltip' title='Online Doctors'>&#171;</span>";
            onlineDoctorId.onclick = function(){
                $rootScope.callOnlineDoctor();
            }
        }else{
            //let removeOnlienDoctor = document.getElementsByClassName('onlineDoctorClass')[0];
            //if(removeOnlienDoctor) removeOnlienDoctor.parentNode.removeChild(removeOnlienDoctor);
        }
        
        
      
      
    });
    // $rootScope.$on('$stateChangeStart',function(event,toState,toParams,fromState){
    //   $log.log('routechangesttart');
    //   $window.scrollTo(0, 0);
    //   var authToken = localStorage.getItem('doc_token');
    //   if(!authToken || authToken == ''){
    //     $rootScope.isLoggedIn = false;
    //   }
    //   if($cookieStore.get('user')){
    //     console.log('routechangesttart user');
    //     validateCookie.authService(function(result,error){
    //       console.log('authService user',result,error);
    //       if(!result){
    //          console.log('not result');
    //         $location.path("/");
    //       }else{
    //         console.log('yes result',event,toState,toParams,fromState);
    //         if(toState.url=="/settings")
    //           $location.path('/project/settings');
    //         else
    //           $location.path(toState.url);
    //       }
    //     });   
    //   }
    //   else{
    //     console.log('routechangesttart else');
    //     $location.path("/"); 
    //   }
    // });


















        }]);

    var ModalInstanceCtrl = function ($scope, $rootScope, $uibModalInstance, modalProgressValue, CPTBilling, $uibModal, socketService, $log, $state, sessionResolve, doctorServices, meetingRoomURLResolve, emailMeetingLinkUrlResolve, lockEncounterData, pdfChartingService, disconnectData, $window) {
        $scope.cancel = function () {
           
            $uibModalInstance.dismiss('cancel');
           // $window.close();
           // window.top.close()
            $rootScope.wrongbrowser = true;

        };
    }
})();
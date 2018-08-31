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
    .constant('config',{
      serverBaseUrl : 'https://connect-api.akosmd.com',
      socketBaseUrl : 'https://connect-api.akosmd.com',
      opentokAPIKey : 45732912
      })
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
    .run(['$rootScope','$window','$location','$log','$cookieStore','$state','config','roomServices','$compile',function($rootScope,$window,$location,$log,$cookieStore,$state,config,roomServices,$compile){
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
})();
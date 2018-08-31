(function() {   
    'use strict';   
    angular
        .module('AkosPCP.appLink')
        .controller('appLink', appLink);
    appLink.$inject = ['$scope','$http','$rootScope','$location','$window','$log','$cookieStore','$state','$uibModal','moment'];
    function appLink($scope,$http,$rootScope,$location,$window,$log,$cookieStore,$state,$uibModal,moment) {
        $log.log($location);
        //var vm = this;
        $rootScope.title = "AppLink"; 
        var url ='';
        var docurl = '';
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

        if(isAndroid) {
            $scope.appStore = "PLAY";
            if(typeof $state.params.thirdParty != 'undefined'){
                url = "patientapp:///"+$state.params.roomID+'/'+$state.params.thirdParty;
				docurl = "akosmd:///" + $state.params.roomID + '/' + $state.params.thirdParty;
            }else{
                url = "patientapp:///"+$state.params.roomID+'/'+$state.params.type;
				docurl = "akosmd:///"+$state.params.roomID+'/'+$state.params.type;
            }
        }else{
            $scope.appStore = "APP";
            if(typeof $state.params.thirdParty != 'undefined'){
                url = "testAkos:///"+$state.params.roomID+'/'+$state.params.thirdParty; 
				docurl = "testAkosDoctor:///"+$state.params.roomID+'/'+$state.params.thirdParty
            }else{
                url = "testAkos:///"+$state.params.roomID+'/'+$state.params.type; 
				docurl = "testAkosDoctor:///"+$state.params.roomID+'/'+$state.params.type;
            }
            
           
        }
        
		 //added on 040818
		var obj = {
            roomId: $state.params.roomID,
            type: $state.params.type,
            thirdParty: $state.params.thirdParty
        }
        localStorage.setItem("ConnectUrl", JSON.stringify(obj));


        $scope.downloadApp = function(){
        	if(isAndroid) {
                
        		window.location = "https://play.google.com/store/apps/details?id=com.akosmd.patientapp";    	
        	}else{
                
        		window.location = "https://itunes.apple.com/us/app/akos/id1187895369?ls=1&mt=8";    	
        	}	
           	
        }
        
        /*$scope.openApp = function(){
            
           window.location = url;
        }*/
		$scope.openApp = function () {
             //add this for connect url (07/23/2018)

            //if ($state.params.type.toLowerCase() != '@@pcp'.toLowerCase()) {
            	/*url = "/test/connect/#!/room/" + $state.params.roomID;*/
                if ($state.params.type.toLowerCase() == '@@WC_NURSE'.toLowerCase()) {
                 //url = "/test/connect/#!/room/" + $state.params.roomID + "?inviteId="+$state.params.type.substr(3,$state.params.type.length);
                 url = "/#!/room/" + $state.params.roomID;
                 docurl = "/#!/room/" + $state.params.roomID;
               } 
            //}
                setTimeout(function () {
                window.location = url;
                }, 25);
          		 window.location = docurl;
        }
        // setTimeout(function () { window.location = "https://itunes.apple.com/appdir"; }, 25);
        // 
    }
})();
 
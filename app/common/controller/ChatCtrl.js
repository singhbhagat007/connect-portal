(function(){
	'use strict';
	angular
		.module('AkosPCP')
		.controller('ChatCtrl',ChatCtrl);
	ChatCtrl.$inject = ['$scope','$http','$rootScope','$location','$window','$log','doctorServices','tokenValidatorService','$cookieStore','$state','$uibModal','moment','config','socketService','$filter','pdfChartingService','$compile','roomServices'];	
	    function ChatCtrl($scope,$http,$rootScope,$location,$window,$log,doctorServices,tokenValidatorService,$cookieStore,$state,$uibModal,moment,config,socketService,$filter,pdfChartingService,$compile,roomServices) {
	    	$scope.$on('$destroy', function (event){
	            //socket.removeAllListeners();
	            socketService.removeAllListeners();
	            //console.log('destroy triggered!');
	        });
        /*added on 230818*/
        socketService.on('doctorGoneOffline', function (data) {
                $log.log(data);
                if ($scope.id && $scope.id == data.docId) {
                    $scope.isDocActive = false;
                }
            });
            socketService.on('doctorGoneOnline', function (data) {
                $log.log(data);
                if ($scope.id && $scope.id == data.docId) {
                    $scope.isDocActive = true;
                }
            });
           /*--------------------*/ 
            if(roomServices.getDocActiveStateFromAlias() != undefined){
                $scope.isDocActive = roomServices.getDocActiveStateFromAlias();
            }    


            if($scope.sendertext != undefined &&  $scope.sendertext != '' && $('chattemplate').attr('id') == $scope.id) {
                $('.chatBody').append('<div class="chatSenderClass"><span class="text-left " style="padding-left:4px;"><strong>'+$scope.name+'</strong></span><div class="talk-bubble tri-right round border left-top" style="left:11%;"> <div class="talktext"> <p>'+$scope.sendertext+'</p> </div> </div> ');
            } 
			$scope.sendChat = function(x){
	    		if(x == "" || x == undefined) return false;
	    		$("#chatBody_" + $scope.id + $scope.senderid).append('<div class="chatSenderClass"><span class="text-right "><strong> Me </strong></span><div class="talk-bubble tri-right round border right-top"> <div class="talktext"> <p class="text-right">'+x+'</p> </div> </div> ');

           try {
                    $("#chatMsg").val('');
                    $scope.chatMsg = '';
                }catch (errr) { }  


                socketService.emit('chatSend',{id:$scope.id,name:$scope.name,sender:$scope.sender,text:x,senderid:$scope.senderid,sendername:$scope.sendername},function(data){
                	console.log(data);
                });
                // var objDiv = $(".chatBody");
                // objDiv.scrollTop = objDiv.scrollHeight;
                $('.chatBody').animate({scrollTop: $('.chatBody')[0].scrollHeight});
            }
           	socketService.on('chatSend', function(data){
           	    $log.log(data);
                $('#chatBody_' + data.senderid + data.id).append('<div class="chatSenderClass"><span class="text-left " style="padding-left:4px;"><strong>'+data.sendername+'</strong></span><div class="talk-bubble tri-right round border left-top" style="left:11%;"> <div class="talktext"> <p>'+data.text+'</p> </div> </div> ');
            	//$('#chatBody_'+data.senderid).append('<p style="text-align:right;">'+data.text+'</p>');
            	// var objDiv = $(".chatBody");
             	//objDiv.scrollTop = objDiv.scrollHeight;
                $('.chatBody').animate({scrollTop: $('.chatBody')[0].scrollHeight});
    		})

            $scope.chatOff = function(x){
            	if($scope.sender == 'doctor'){
            		$rootScope.chatOff(x);	
            	}
            }
            if($scope.sender == 'patient'){
                $scope.isChatminimize = 0;
            }
            $scope.minimizeChatBox = function(){
                
                if($scope.isChatminimize == 0){
                   $scope.isChatminimize = 1;
                   var a = document.getElementsByClassName('chatBox');
                   
                   a[0].style.height = '32px';
                   var b = document.getElementsByClassName('chatFooter');
                   b[0].style.display = 'none';
                }else{
                   $scope.isChatminimize = 0;  
                   var a = document.getElementsByClassName('chatBox');
                   a[0].style.height = '300px';
                   var b = document.getElementsByClassName('chatFooter');
                   b[0].style.display = 'block';
                   
                }
                
            }
	    }
})();

angular.module('AkosPCP').controller('passwordCtrl', function ($scope,$rootScope,$location,$mdDialog,$http,$interval,$timeout,$cookieStore,$filter,moment,config,doctorServices,roomServices ) {
 $scope.matchPassword = 0; 
 $scope.passwordvalidator = 0;
 $('#userCred').removeClass('show');
  $('#logoutstat').removeClass('show');
  $('#userCred').addClass('hide');
  $('#logoutstat').addClass('hide');
  /*----------online doc hide opn login page----------*/
  $('#online-doc-div').hide();
  $('#online-doc-list-show').hide();
  /*--------------------------------------------------*/

 $('#passsteps1').addClass('activepassstep');
 $('#passsteps2').addClass('passstep');
 $('#passsteps3').addClass('passstep');
 $scope.showstatus1 = true;
 $scope.showstatus2 = false;
 $scope.showstatus3 = false;
 $scope.verifyemail = function(staff){
   if(staff==''){ return false; }

   let staffemail = staff.email;
   doctorServices.getUserEmails({email:staffemail,type:'provider'})
            .then(function(result){
            
                if(result.data.status_code==200){
          let staffemail = result.data.result.email;
          let staffname = result.data.result.name;

          if(staffemail!='' && staffname!=''){
              $scope.stafftempemail = staffemail;
              $scope.stafftempname = staffname;
              $scope.stafftempid = result.data.result.id;

              doctorServices.forgototpsend({email:staffemail,id:result.data.result.id,name:staffname})
            .then(function(result){
             
                if(result.data.status_code==200){
               $('#passsteps1').removeClass('activepassstep');
                      $('#passsteps1').addClass('passstep');
                      $('#passsteps2').addClass('activepassstep');
                      $('#passsteps3').addClass('passstep');
                      $scope.showstatus1 = false;
                      $scope.showstatus2 = true;
                      $scope.showstatus3 = false;

                }else{ console.log('couldn\'t sent the verification code'); }
              
              });
             

          }else{ console.log('invalid provider'); }

                }else{

                    $mdDialog.show({
                controller: passwordCtrl,
                template: '\
                <md-dialog aria-label="Confirm" ng-cloak>\
                <md-dialog-content>\
                <div class="md-dialog-content">\
                    <p> Email Not Found </p>\
                </div>\
                </md-dialog-content>\
                <md-dialog-actions layout="row">\
                <span flex></span>\
                <md-button ng-click="cancel()" style="margin-right:20px;">\
                    Ok\
                </md-button>\
                </md-dialog-actions>\
                </md-dialog>\
                ',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: false
                })
                }
            
            });

          
    
 }

 $scope.verifyOtp = function(otpToVerify){
   if(otpToVerify==null || !$scope.stafftempemail){ return false; }
    
               $scope.param = {};
                $scope.param.otp = otpToVerify;
                $scope.param.verifyValue = $scope.stafftempemail;
                roomServices.verifyOTP($scope.param) 
                .then(function(result){
                 
                    if(result.data.status_code == 200){
                      $('#passsteps2').removeClass('activepassstep');
                      $('#passsteps2').addClass('passstep');
                      $('#passsteps1').addClass('passstep');
                      $('#passsteps3').addClass('activepassstep');
                      $scope.showstatus1 = false;
                      $scope.showstatus2 = false;
                      $scope.showstatus3 = true;

                      $scope.verifiedOtp = otpToVerify;
                    }else{
                        $mdDialog.show({
                        controller: passwordCtrl,
                        template: '\
                        <md-dialog aria-label="Confirm" ng-cloak>\
                        <md-dialog-content>\
                        <div class="md-dialog-content">\
                        <p> Invalid OTP. </p>\
                        </div>\
                        </md-dialog-content>\
                        <md-dialog-actions layout="row">\
                        <span flex></span>\
                        <md-button ng-click="cancel()" style="margin-right:20px;">\
                        Ok\
                        </md-button>\
                        </md-dialog-actions>\
                        </md-dialog>\
                        ',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        fullscreen: false
                        })
                    }
                  });


       
 }
  $scope.passwordStr = 0;

 $scope.checkNewPasswordStrength = function(password){
     
     let strength = 0
    if (password.length < 6) {
    $('#result').removeClass()
    $('#strength_check').removeClass()
    $('#result').addClass('short')
    $('#strength_check').addClass('short1')
    $scope.passwordvalidator = 0;
    return 'Too short'
    }
    if (password.length > 7) strength += 1
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    if (strength < 2) {
    $('#result').removeClass()
    $('#strength_check').removeClass()
    $('#result').addClass('weak')
    $('#strength_check').addClass('weak1')
    $scope.passwordvalidator = 0;
    return 'Weak'
    } else if (strength == 2) {
    $('#result').removeClass()
    $('#strength_check').removeClass()
    $('#result').addClass('good')
    $('#strength_check').addClass('good1')
    return 'Good'
    return false;
    } else {
    $('#result').removeClass()
    $('#strength_check').removeClass()
    $('#result').addClass('strong')
    $('#strength_check').addClass('strong1')
    $scope.passwordvalidator = 1;
    return 'Strong'
    }
 }

  $scope.resetPassword = function(newpassword,cnfmpassword){
      if(newpassword!=cnfmpassword){
              $mdDialog.show({
                controller: passwordCtrl,
                template: '\
                <md-dialog aria-label="Confirm" ng-cloak>\
                <md-dialog-content>\
                <div class="md-dialog-content">\
                <p> Passwords do not match </p>\
                </div>\
                </md-dialog-content>\
                <md-dialog-actions layout="row">\
                <span flex></span>\
                <md-button ng-click="cancel()" style="margin-right:20px;">\
                Ok\
                </md-button>\
                </md-dialog-actions>\
                </md-dialog>\
                ',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: false
                })
              return false;
      }
      let preOtp = $scope.verifiedOtp;

doctorServices.setPassword({otp:preOtp,email:$scope.stafftempemail,password:newpassword}) 
                .then(function(result){
                    
                    if(result.data.status_code == 200){
                      $mdDialog.show({
                controller: passwordCtrl,
                template: '\
                <md-dialog aria-label="Confirm" ng-cloak>\
                <md-dialog-content>\
                <div class="md-dialog-content">\
                <p> Password Updated </p>\
                </div>\
                </md-dialog-content>\
                <md-dialog-actions layout="row">\
                <span flex></span>\
                <md-button ng-click="redirectToLogin()" style="margin-right:20px;">\
                Ok\
                </md-button>\
                </md-dialog-actions>\
                </md-dialog>\
                ',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                fullscreen: false
                })
          }
          else{ alert('some error'); }
                    
                  });

  }

  $scope.matchPassword1 = function(newpassword,cnfmpassword){
    
     if(newpassword==cnfmpassword){ $scope.matchPassword = 1; }
     else{ $scope.matchPassword = 0; }
  }

  function passwordCtrl($scope,$mdDialog,$location){
    $scope.cancel = function(){
    $mdDialog.cancel();
     }
     $scope.redirectToLogin = function(){
      $mdDialog.cancel();
      $location.path('/');
     }
  } 

  $scope.resendPassOtp = function(){
    let staffname = $scope.stafftempname;
    let staffemail = $scope.stafftempemail;
    let staffid=  $scope.stafftempid;
    if(!staffname || !staffemail){ return false; }

     doctorServices.forgototpsend({email:staffemail,id:staffid,name:staffname})
            .then(function(result){
              
                if(result.data.status_code==200){
                  $mdDialog.show({
                      controller: passwordCtrl,
                      template: '\
                      <md-dialog aria-label="Confirm" ng-cloak>\
                      <md-dialog-content>\
                      <div class="md-dialog-content">\
                      <p> OTP sent again </p>\
                      </div>\
                      </md-dialog-content>\
                      <md-dialog-actions layout="row">\
                      <span flex></span>\
                      <md-button ng-click="cancel()" style="margin-right:20px;">\
                      Ok\
                      </md-button>\
                      </md-dialog-actions>\
                      </md-dialog>\
                      ',
                      parent: angular.element(document.body),
                      clickOutsideToClose: true,
                      fullscreen: false
                      })
                }else{ console.log('couldn\'t sent the verification code'); }
              });
    
  }

})	
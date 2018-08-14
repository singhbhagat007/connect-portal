/**
 * Created by root on 15/4/16.
 */
(function () {
  'use strict';
  var onlinedoctortemplate = function(){
    return {
      scope:{
        name: "="
      },

      templateUrl: './app/common/template/onlineDoctorOverlay.tpl.html',
      link: function(scope, element, attrs)
        {
            
        }
    }
  };
  angular.module('AkosPCP').directive('onlinedoctortemplate',onlinedoctortemplate);
})();
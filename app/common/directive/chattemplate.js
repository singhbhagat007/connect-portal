/**
 * Created by root on 15/4/16.
 */
(function () {
  'use strict';
  var chattemplate = function(){
    return {
      scope:{
        name: "=",
        id : "=",
        sender : "=",
        senderid : "=",
        sendername : "=",
        datatemplateid : "=",
        sendertext : "="
      },

      templateUrl: './app/common/template/chatBox.tpl.html',
      link: function(scope, element, attrs)
        {
            
        }
    }
  };
  angular.module('AkosPCP').directive('chattemplate',chattemplate);
})();

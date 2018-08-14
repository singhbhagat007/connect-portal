(function(){
    'use strict';   
    angular
        .module('AkosPCP')
        .controller('pdfChartingCtrl', pdfChartingCtrl);
    pdfChartingCtrl.$inject = ['$scope','$http','$rootScope','$location','$window','$log','pdfChartingService','tokenValidatorService','$cookieStore','$state','$uibModal','moment','config','doctorServices','$filter'];    
    function pdfChartingCtrl($scope,$http,$rootScope,$location,$window,$log,pdfChartingService,tokenValidatorService,$cookieStore,$state,$uibModal,moment,config,doctorServices,$filter) {
        $scope.oneAtATime = true; 

        //$scope.progressArray = {};
        $scope.removeDialogText = function(x){
            switch(x){
                case 1:
                $scope.progressArray.chiefComplaints = '';
                break;
                case 2:
                $scope.progressArray.hpi = '';
                break;
                case 3:
                $scope.progressArray.pastMedicalHistory = '';
                break;
                case 4:
                $scope.progressArray.pastSurgicalHistory = '';
                break;
                case 5:
                $scope.progressArray.socialHistory = '';
                break;
                case 6:
                $scope.progressArray.familyHistory = '';
                break;
                case 7:
                $scope.progressArray.reviewsOfSystemsvalue = '';
                break;
                case 8:
                $scope.progressArray.physicalExam = '';
                break;
                case 9:
                $scope.progressArray.labs = '';
                break;
                case 10:
                $scope.progressArray.imaging = '';
                break;
                case 11:
                $scope.progressArray.otherStudies = '';
                break;
                case 12:
                $scope.progressArray.assesment = '';
                break;
                case 13:
                $scope.progressArray.planOfCare = '';
                break;
                case 14:
                $scope.progressArray.followUp = '';
                break;

            }
        }

        $scope.downloadPDF = function(data,ICD,CPT,patientDetails){

            $scope.loading = true;
            $scope.progressNotePDFArray = data;
            $scope.progressNotePDFArray.doctorFirstName = JSON.parse(localStorage.getItem('pcpDocData')).name;
            $scope.progressNotePDFArray.doctorLastName = "";
            $scope.progressNotePDFArray.diagnosticAssesment =  ICD;
            $scope.progressNotePDFArray.az_cpt_code =  CPT;
            
            $scope.progressNotePDFArray = JSON.stringify(
                {
                    first_name : patientDetails.first_name,
                    last_name:patientDetails.last_name,
                    gender:patientDetails.gender,
                    email:patientDetails.email,
                    address1:patientDetails.address1,
                    address2:patientDetails.address2,
                    phone:patientDetails.phone,
                    city:patientDetails.city,
                    state:patientDetails.state,
                    zip_code:patientDetails.zip_code,
                    dateofbirth:moment( patientDetails.dateofbirth).format("MM/DD/YYYY"),
                    age: $filter('findAgeFilter')(patientDetails.dateofbirth),
                    call_started : moment( patientDetails.call_started).format("MM/DD/YYYY HH:mm:ss"),
                    'doctor_instruction':JSON.stringify($scope.progressNotePDFArray)
                });
            var data = $scope.progressNotePDFArray;
            doctorServices.downloadPDF(data)
            .then(function(result){
                var file_path = result.data; 
                var a = document.createElement('A');
                a.href = file_path;
                a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                $scope.loading = false;
                })
        }
        $scope.ICDArray = {};    
        //$scope.addeddiagnosisArray = [];
        $scope.searchgenerateICD = function(){
            $scope.param ={};
            $scope.param.key = $('#searchICDText').val();
            if($('#searchICDText').val().length >= 3){
                $scope.loading = true;
                doctorServices.getICDService($scope.param)
                .then(function(result){
                    $scope.loading = false;
                    $scope.ICDArray = result.data[3];
                })    
            }else{
                $scope.ICDArray = {};
            }
        }
        $scope.adddiagnosis = function(a,b){
            $scope.ICDArray = {};
            $scope.addeddiagnosisArray.push({"icdCode":a,"description":b});        
        }


        //$scope.CPTArray = [];
        $scope.removeSelectedCptBilling = function(x){
            var index = $scope.CPTArray.indexOf(x);
            if(index != -1){
                $scope.CPTArray.splice(x,1);
            } 
        }
        $scope.selectCPT = function(){
            $scope.loading = true;
            doctorServices.getCPTBilling()
            .then(function(result){
                if(result.data.success == 1){
                    $scope.loading = false;
                    $scope.cptBilling = result.data.result;    
                    var modalInstance = $uibModal.open({
                        templateUrl: "CPTProgressNoteModal.html",
                        controller: ModalInstanceCtrl,
                        scope: $scope,
                        windowClass: 'getbilling-cpt-pop-class',
                        size:'sm',
                        resolve: {
                            modalProgressValue: function () {
                            return "";
                            },
                            CPTBilling : function(){
                                return $scope.cptBilling;
                            },
                            lockEncounterData : function(){
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
            });
        }
        $scope.openProgressModal = function(a,b){
            $scope.returningValue = {};
            $scope.returningValue.head = a;
            $scope.returningValue.value = (angular.isUndefined(b)? "": b);


            var modalInstance = $uibModal.open({
                templateUrl: "progressNoteModal.html",
                controller: ModalInstanceCtrl,
                scope: $scope,
                size:'sm',
                resolve: {
                    modalProgressValue: function () {
                    return $scope.returningValue;
                    },
                    CPTBilling : function(){
                        return '';
                    },
                    lockEncounterData : function(){
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

        $scope.saveCallRecord = function(data,ICD,CPT,patientDetails,x){
                if(patientDetails.id != undefined){
                    $scope.isCallSaved = 1;
                    $scope.progressNoteInsArray = data;
                    $scope.progressNoteInsArray.operation = "save";
                    $scope.progressNoteInsArray.diagnosticAssesment =  ICD;
                    $scope.progressNoteInsArray.az_cpt_code =  CPT;
                    $scope.progressNotePDFArray = JSON.stringify(
                        {
                            doctor_instruction:$scope.progressNoteInsArray
                        
                    });
                    var data = $scope.progressNotePDFArray;

                    $scope.lockData = {};
                    $scope.lockData.call_id = patientDetails.id;
                    $scope.lockData.doctor_instruction = data;
                    pdfChartingService.lockCallEncounter($scope.lockData)
                    .then(function(result){
                        if(result.data.status_code == 200){
                            $scope.loading = false;
                            var modalInstance = $uibModal.open({
                                templateUrl: "logChartingSaved.html",
                                controller: ModalInstanceCtrl,
                                scope: $scope,
                                size:'sm',
                                resolve: {
                                    modalProgressValue: function () {
                                    return "";
                                    },
                                    CPTBilling : function(){
                                        return '';
                                    },
                                    lockEncounterData : function(){
                                        return "";
                                    }
                                }

                            });

                            modalInstance.result.then(function (selectedItem) {
                                $scope.selected = selectedItem;
                                }, function () {
                                $log.info('Modal dismissed at: ' + new Date());
                            });
                            


                            //$("#lockBTN2").show();
                            //$("#lockBTN1").hide();
                        }else{
                            $scope.loading = false;
                            alert("error");
                        }

                    })

                }else{
                    $scope.isCallSaved = 0;
                }

            }

        $scope.lockEncounter = function(data,ICD,CPT,patientDetails,x){
             $scope.progressNoteInsArray = data;
             $scope.progressNoteInsArray.operation = "lock";
            // $scope.progressNoteInsArray.doctorFirstName = JSON.parse(localStorage.getItem('pcpDocData')).name;
            // $scope.progressNoteInsArray.doctorLastName = "";
              $scope.progressNoteInsArray.diagnosticAssesment =  ICD;
              $scope.progressNoteInsArray.az_cpt_code =  CPT;
            
            $scope.progressNotePDFArray = JSON.stringify(
                {
                    // first_name : patientDetails.first_name,
                    // last_name:patientDetails.last_name,
                    // gender:patientDetails.gender,
                    // email:patientDetails.email,
                    // address1:patientDetails.address1,
                    // address2:patientDetails.address2,
                    // phone:patientDetails.phone,
                    // city:patientDetails.city,
                    // state:patientDetails.state,
                    // zip_code:patientDetails.zip_code,
                    // dateofbirth:moment( patientDetails.dateofbirth).format("MM/DD/YYYY"),
                    // age: $filter('findAgeFilter')(patientDetails.dateofbirth),
                    // call_started : moment( patientDetails.call_started).format("MM/DD/YYYY HH:mm:ss"),
                    doctor_instruction:$scope.progressNoteInsArray
                });
            var data = $scope.progressNotePDFArray;

            var modalInstance = $uibModal.open({
                templateUrl: "progressNoteLockModal.html",
                controller: ModalInstanceCtrl,
                scope: $scope,
                size:'sm',
                resolve: {
                    modalProgressValue: function () {
                    return "";
                    },
                    CPTBilling : function(){
                        return '';
                    },
                    lockEncounterData : function(){
                        return data;
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

    var ModalInstanceCtrl = function ($scope,$rootScope, $uibModalInstance,modalProgressValue,CPTBilling,$uibModal,$log,$state,doctorServices,pdfChartingService,lockEncounterData) {

        $scope.lockPpoupEncounter = function(){
            $scope.loading = true;
            $uibModalInstance.dismiss('cancel');
            $scope.lockData = {};
            $scope.lockData.call_id = $state.params.id;
            $scope.lockData.doctor_instruction = lockEncounterData;
            pdfChartingService.lockCallEncounter($scope.lockData)
            .then(function(result){
                if(result.data.status_code == 200){
                    $scope.loading = false;
                    doctorServices.updatePatientCallLog();
                    $('#lockBTN2').show();
                }else{
                    $scope.loading = false;
                    alert("error");
                }

            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        if(CPTBilling != ''){
            $scope.cptBilling = CPTBilling;
        }
        $scope.selectedCPTCode = function(a,b){
            
            if(a == true){
                var index = $scope.CPTArray.indexOf(b);
                if(index == -1){
                    $scope.CPTArray.push(b);
                }
            }else if(a == false){
                var index = $scope.CPTArray.indexOf(b);
                $scope.CPTArray.splice(index,1);
            }
        }

        switch(modalProgressValue.head){
            case 1: 
            $scope.modalHead = "Chief Complaints";
            $scope.modalInputValue = modalProgressValue.value;     
            break;
            case 2: 
            $scope.modalHead = "History of Present Illness (HPI)";
            $scope.modalInputValue = modalProgressValue.value;     
            break;
            case 3: 
            $scope.modalHead = "Past Medical History";
            $scope.modalInputValue = modalProgressValue.value;     
            break;
            case 4: 
            $scope.modalHead = "Past Surgical History";
            $scope.modalInputValue = modalProgressValue.value;     
            break;
            case 5: 
            $scope.modalHead = "Social History";
            $scope.modalInputValue = modalProgressValue.value;     
            break;
            case 6: 
            $scope.modalHead = "Family History";
            $scope.modalInputValue = modalProgressValue.value;     
            break;
            case 7: 
            $scope.modalHead = "Review of systems";
            $scope.modalInputValue = modalProgressValue.value;     
            break;
            case 8: 
            $scope.modalHead = "Physical Exam";
            $scope.modalInputValue = modalProgressValue.value;     
            break;
            case 9: 
            $scope.modalHead = "Labs";
            $scope.modalInputValue = modalProgressValue.value;     
            break;
            case 10: 
            $scope.modalHead = "Imaging";
            $scope.modalInputValue = modalProgressValue.value;     
            break;
            case 11: 
            $scope.modalHead = "Other Studies";
            $scope.modalInputValue = modalProgressValue.value;     
            break;
            case 12: 
            $scope.modalHead = "Assesment";
            $scope.modalInputValue = modalProgressValue.value;     
            break;
            case 13: 
            $scope.modalHead = "Plan of Care";
            $scope.modalInputValue = modalProgressValue.value;     
            break;
            case 14: 
            $scope.modalHead = "Follow Up";
            $scope.modalInputValue = modalProgressValue.value;     
            break;
        }

        $scope.saveProgressNote = function(x){

            switch(modalProgressValue.head){
            case 1: 
            $scope.progressArray.chiefComplaints = x;
            break;
            case 2: 
            $scope.progressArray.hpi = x;
            break;
            case 3: 
            $scope.progressArray.pastMedicalHistory = x;
            break;
            case 4: 
            $scope.progressArray.pastSurgicalHistory = x;
            break;
            case 5: 
            $scope.progressArray.socialHistory = x;
            break;
            case 6: 
            $scope.progressArray.familyHistory = x;
            break;
            case 7: 
            $scope.progressArray.reviewsOfSystemsvalue = x;
            break;
            case 8: 
            $scope.progressArray.physicalExam = x;
            break;
            case 9: 
            $scope.progressArray.labs = x;
            break;
            case 10: 
            $scope.progressArray.imaging = x;
            break;
            case 11: 
            $scope.progressArray.otherStudies = x;
            break;
            case 12: 
            $scope.progressArray.assesment = x;
            break;
            case 13: 
            $scope.progressArray.planOfCare = x;
            break;
            case 14: 
            $scope.progressArray.followUp = x;
            break;
        }        

        $uibModalInstance.dismiss('cancel');
        }
    }
})();


            

            


            

            
            
            
            
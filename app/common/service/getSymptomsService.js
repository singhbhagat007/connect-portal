(function(){
	'use strict';
	angular
		.module('AkosPCP')
		.factory('getSymptomsService',getSymptomsService);
		getSymptomsService.$inject = ['$http','$location','$log','config'];	
		function getSymptomsService($http,$location,$log,config){
			return{
				getSymptomsDetails : function(){
				var symptoms =[
								{
									heading: "GENERAL SYMPTOMS",values: ['Fever','Chills','Weakness','Fatigue','Insomnia','Weight loss']
								},
								{
								  heading: "NEUROLOGY/HEAD",values: ['Headache','Dizziness','Fainting','Seizure','Stroke-like symptoms*']	
								},
								{
								  heading: "EYES",values: ['Pink eye','Stye','Vision loss']	
								},
								{
								  heading: "NOSE",values: ['Sinus infection','Nasal discharge','Congestion','Seasonal allergies']	
								},
								{
								  heading: "EARS",values: ['Earache','Ear drainage','Ringing in the ears','Hearing loss']	
								},
								{
								  heading: "THROAT",values: ['Sore throat','Painful swallowing']	
								},
								{
								  heading: "NECK",values: ['Swollen glands']	
								},
								{
								  heading: "CARDIOVASCULAR",values: ['Chest pain/pressure','Palpitations']	
								},
								{
								  heading: "SKIN/DERMATOLOGY",values: ['Rash','Skin spots','Insect bites','Sores','Itching','Sunburn']	
								},
								{
								  heading: "TRAVEL-RELATED",values: ['Traveler’s diarrhea','Malaria (possible)','Dengue (possible)','Zika (possible)','Motion sickness','Altitude illness']	
								},
								{
								  heading: "MINOR INJURIES / MUSCULOSKELETAL",values: ['Back pain','Back injury','Ankle sprain','Joint pain/swelling','Bruises/contusions','Decreased range of motion','Puncture wound']	
								},
								{
								  heading: "RESPIRATORY",values: ['ness of breath*','Cough','Wheezing','Cold symptoms','Flu symptoms','Barky cough']	
								},
								{
								  heading: "GASTROINTESTINAL (GI)",values: ['Nausea','Vomiting','Diarrhea','Abdominal pain','Constipation','Acid reflux','Difficulty swallowing']	
								},
								{
								  heading: "GENITOURINARY (GU)",values: ['Flank pain','Burning to urinate','Painful urination','Bloody urine','Vaginal bleeding','Vaginal discharge','Penile discharge','Testicular pain']	
								},
								{
								  heading: "ALLERGIES",values: ['Rash','Itching','Tongue/throat swelling*']	
								},
								{
								  heading: "PSYCHIATRIC",values: ['Depression','Suicidal thoughts*','Homicidal thoughts*','Disorganized thinking']	
								},
								{
								  heading: "MAJOR/SERIOUS INJURIES*",values: ['Head injury*','Neck injury*','Chest trauma*','Abdominal trauma*','Trauma to the spine*','Fractures*','Dislocations*']	
								},
								{
								  heading: "SERIOUS OR POTENTIALLY SERIOUS CONDITIONS*",values: ['Stroke-like symptoms*','Sudden loss of vision*','Chest pain/tightness*','Palpitations*','Irregular heartbeat*','Skipped heartbeat*','Decreased exercise tolerance*','Leg swelling*','Significant weight gain*','Cuts or lacerations*']	
								}
								];
				return 	symptoms;			
			}

		}
			
	} 
	})();
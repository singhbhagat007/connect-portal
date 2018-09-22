angular.module('AkosPCP').constant('config', {

     serverBaseUrl: 'https://sandbox.connect-api.akosmd.com',
     socketBaseUrl: 'https://sandbox.connect-api.akosmd.com',
    opentokAPIKey: 45732912
   
}).constant('appConfig', {
    employerId: '',
    network_check_provider: false,
	messages: {
       callDisconnected: { title: "Call disconnected by provider", message: "The call has been ended by your provider. Thank you for using Akos Connect video consultation." },
        notifyMessage: { title: "Doctor Notification", message: "An Akos connect video call is on the way. Keep an eye on your email/text for a video conferencing link to join the teleconference." },
        alreadyInConference: { title: "Already in the conference", message: "We are not able to initiate the video conference because you are already in another active video conference. Please try again later." },
        callEndThanksMsg:{title:"",message:"Thank you for using Akos Teleclinic platform. Please inform the MA that your call has ended."},
        joinCallMsgBysingle:{title:"",message:"Thanks for joining my personal consultation room. I am aware of your arrival in this waiting room and will be with you shortly."},
        joinCallMsgBymultiple:{title:"",message:"Thanks for joining our consultation room. Our providers are aware of your arrival in this waiting room and they will be with you shortly."},
        callDisconnectedByProvider:{title:"",message:"call disconnected by provider"},
        callDisconnectedByClient:{title:"",message:"call disconnected by client"}
    }
    
}); 


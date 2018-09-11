angular.module('AkosPCP').constant('config', {

    serverBaseUrl: 'https://sandbox.connect-api.akosmd.com',
    socketBaseUrl: 'https://sandbox.connect-api.akosmd.com',
    opentokAPIKey: 45732912
    //serverBaseUrl : 'https://akosmd.com:3001',
    // socketBaseUrl: 'https://akosmd.com:3001',
    // serverBaseUrl: 'http://localhost:3001',
    // opentokAPIKey: 45732912

}).constant('appConfig', {

    employerId: '',
    network_check_provider: true,
	messages: {
       callDisconnected: { title: "Call disconnected by provider", message: "The call has been ended by your provider. Thank you for using Akos Connect video consultation." },
        notifyMessage: { title: "Doctor Notification", message: "An Akos connect video call is on the way. Keep an eye on your email/text for a video conferencing link to join the teleconference." }
    }
    
}); 


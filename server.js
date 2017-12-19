//require the express nodejs module  
var express = require('express'),
	bodyParser = require('body-parser'),
	path = require("path"),
	http = require('http'),
	https = require('https'),
	fs = require('fs'),
	//routes = require('./routes'),
  	api = require('./routes/api');
var cors = require('cors');

var app =  module.exports  =express();
 
// var opentokkeys = [];
// var sessionId; 	
// var token;
// var apiKey= 45732912;	
// var apiSecret = '4a0f1237f12c308521c1670c76d64b9d05a8103e';
// var OpenTok = require('opentok')
// 	opentok = new OpenTok(apiKey,apiSecret);

// opentok.createSession(function(err, session) {
//   if (err) return console.log(err);
  
//   sessionId = session.sessionId;
//   //db.save('session', session.sessionId, done);
//   token = opentok.generateToken(sessionId);
//   opentokkeys.push({'sessionid':sessionId,'token':token});
//   //app.set('opentokkeys',opentokkeys);
//   app.locals.opentokkeys = opentokkeys;
//   //app.locals();

// });





app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'www')));
app.use(cors({origin: '*'}));

// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', 'https://akosmd.com:3001/socket.io');
// });
/*app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://akosmd.com/test/akos-pcp/client');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
}); */


var key = fs.readFileSync('server.key','utf8');
var cert = fs.readFileSync( 'server.crt' ,'utf8');
//var csr = fs.readFileSync( 'server.csr' );

var options = {
 key: key, 
 cert: cert
};


var httpsserver = https.createServer(options, app);

//var server = https.createServer(app);
var io = require('socket.io').listen(httpsserver);

/* socket programming start */ 
io.on('connection', function(socket){
    // console.log("connection created");
    // var user = ["test"];
    // io.emit('message', { hello: 'world' });

    // io.on('sendmsg',function(user){
    //  console.log("it");
    //  io.emit("notify",user);
    //  });

    
    socket.on('userjoin', function(data){
        socket.broadcast.emit('userjoin',data.waitingId);
        //io.emit('userjoin');
    });

    socket.on('userleft',function(data){
        socket.broadcast.emit('userleft',{"waitingId":data.waitingId,"name":data.name});
        });

    socket.on('callDisconnectedByDoc',function(data){
        socket.broadcast.emit('callDisconnectedByDoc',{"test":"hello"});
        });



    

    });

/* socket programming end */

/*api call start*/
app.post('/api/pcp/doctorLogin',api.doctorLogin); /* doctor login api */
app.post('/api/pcp/updateDocRoomAlias',api.updateDocRoomAlias);   /* update alias room for doc */ 
app.post('/api/pcp/getWaitingUserList',api.getWaitingUserList);   /* get user waiting list for doc */ 
app.post('/api/pcp/getWaitingUserListFromUserId',api.getWaitingUserListFromUserId);   /* get user waiting list from user id for doc */ 
app.post('/api/pcp/getUserCallDetails',api.getUserCallDetails);   /* get user call details for doc */ 
app.post('/api/pcp/deleteWaitingUser',api.deleteWaitingUser);   /* delete user from waiting table for doc */ 
app.post('/api/pcp/doctorLogout',api.doctorLogout); /* doctor logout api */
app.post('/api/pcp/patientexists',api.patientexists); /* check user exists api */
app.post('/api/pcp/saveUserMeeting',api.saveUserMeeting); /* save user meeting details api */
app.post('/api/pcp/getSavedUserId',api.getSavedUserId); /* get user id api */
app.post('/api/pcp/getDocFromAlias',api.getDocFromAlias); /* get doc details from alias api */
app.post('/api/pcp/addUserToWaiting',api.addUserToWaiting); /* get doc details from alias api */
app.post('/api/pcp/getOpentokRoomKeys',api.getOpentokRoomKeys); //get opentok keys
app.post('/sessionDisconnect',api.sessionDisconnect);//disconnect from session
/*api calll end */

//wait for a connection
httpsserver.listen(3001, function () {
	
	console.log('Node Express server Started');
});
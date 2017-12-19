var serve = require('../server'); 
var crypto = require('crypto');
var moment = require('moment');
var db = require('../database/db');

var apiKey='45732912';	
var apiSecret = '4a0f1237f12c308521c1670c76d64b9d05a8103e'; 
var OpenTok = require('opentok')
	opentok = new OpenTok(apiKey,apiSecret);
 
/* open tok session and token for user  api start*/
exports.getOpentokRoomKeys = function(req,res){
	var params = {id:req.body.id};
	if(params.id == ''){
		res.status(201).json({"status_code":201,"status_message":"inavlid parameter or value passed"});
		return false;
	}
	var sql = db.query('SELECT session,token FROM pcp_waiting_room WHERE patient_id=\''+params.id+' \'',function(err,rows,fields){
		if(err){
			res.status(500).json({"status_code":500,"status_message":"internal server error"});
		}else{
			if(rows.length == 1){
				res.status(200).json({"status_code":200,"status_message":"opentok keys","result":rows});		
			}else{
				res.status(404).json({"status_code":404,"status_message":"user not found"});	
			}
		}
		})
}

exports.sessionDisconnect = function(req,res){
    opentok.forceDisconnect(req.body.sessionId, req.body.token, function(error) {
        if (error) return console.log("error:", error);
        console.log("session disconnected");
    });
}
/* open tok session and token  api end*/

/* doctor login api start */
exports.doctorLogin = function(req,res){
	var params = {email:req.body.email,password:req.body.password};
	if(params.email == '' || params.password == ''){
		res.status(201).json({"status_code":201,"status_message":"inavlid parameter or value passed"});
		return false;
	}
	var sql = db.query('SELECT id,name,email,phoneNo,room,room_alias FROM pcp_doctor WHERE email = "'+params.email+'" AND password = \''+crypto.createHash("md5").update(params.password).digest("hex")+'\'',function(err,rows,fields){
		if(err){
			res.status(500).json({"status_code":500,"status_message":"internal server error","res":err});
		}else{
			if(rows.length == 1){
				var doctor;
					doctor = {
					'id':rows[0].id,
					'name':rows[0].name,
					'email':rows[0].email,
					'phoneNo':rows[0].phoneNo,
					'room_alias':rows[0].room_alias,
					'token': randomValueBase64(72)
				}
				if(rows[0].room == ''){
					doctor.room = randomRoomNumber();
					var updateToken = db.query('UPDATE pcp_doctor SET  is_active = 1, token = \''+doctor.token+'\' , room = '+doctor.room+' WHERE id = '+doctor.id+'',function(err,rows,fields){
					if(rows){
						res.status(200).json({"status_code":200,"status_message":"successfully logged in","result":doctor});		
					}else{
						res.status(500).json({"status_code":500,"status_message":"internal server error"});
					}
					}); 
				}else{
					doctor.room = rows[0].room;
					var updateToken = db.query('UPDATE pcp_doctor SET is_active = 1, token = \''+doctor.token+'\' WHERE id = '+doctor.id+'',function(err,rows,fields){
					if(rows){
						res.status(200).json({"status_code":200,"status_message":"successfully logged in","result":doctor});		
					}else{
						res.status(500).json({"status_code":500,"status_message":"internal server error"});
					}
					});
				}
			}else{
				res.status(404).json({"status_code":404,"status_message":"docor not found"});	
			}
		}
	});
}
/* doctor login api end */

/* doctor update room alias api*/
exports.updateDocRoomAlias = function(req,res){
	var headers = {token:req.body.headers.Authorization_Token};
	if(headers.Authorization_Token == ''){
		res.status(201).json({"status_code":201,"status_message":"invalid parameter or value passed"});
		return false;
	}
	validateToken(headers.token,function(err,result){
		if(err){
			res.status(500).json({"status_code":500,"status_message":"internal server error"});
		}
		if(result.status_code == 200){
			var params = {id:req.body.body.id,room_alias:req.body.body.room_alias};		
			if(params.id == '' || params.room_alias == ''){
				res.status(201).json({"status_code":201,"status_message":"inavlid parameter or value passed"});
				return false;
			}
			var sql = db.query('UPDATE pcp_doctor SET room_alias = \''+params.room_alias+'\' WHERE id='+params.id, function(err,rows,fields){
				if(err){
					res.status(500).json({"status_code":500,"status_message":"internal server error"});
				}else if(rows){
					res.status(200).json({"status_code":200,"status_message":"alias updated"});
				}
			})
		}
	})
}
/* doctor update room alias end*/

/* doctor logout api */
exports.doctorLogout = function(req,res){
	var headers = {token:req.body.headers.Authorization_Token};
	if(headers.Authorization_Token == ''){
		res.status(201).json({"status_code":201,"status_message":"invalid parameter or value passed"});
		return false;
	}
	validateToken(headers.token,function(err,result){
		if(err){
			res.status(500).json({"status_code":500,"status_message":"internal server error"});	
		}
		if(result.status_code == 200){
			var params = {id:req.body.body.id};
			if(params.id == ''){
				res.status(201).json({'status_code':201,"status_message":"invalid parameter or value passed"});
				return false;
			}else{
				var sql = db.query('SELECT * FROM pcp_doctor WHERE id='+params.id,function(err,rows,fields){
					if(err){
						res.status(500).json({"status_code":500,"status_message":"internal server error"});
					}else{
						if(rows.length == 1){
							db.query('UPDATE pcp_doctor SET token = "" , is_active = 0 WHERE id='+params.id,function(err,rows,fields){
								if(err){
									res.status(500).json({"status_code":500,"status_message":"internal server error"});			
								}else{
									res.status(200).json({"status_code":200,"status_message":"successfully logged out"});
								}
							})
						}else{
							res.status(404).json({"status_code":404,"status_message":"doctor not found"});
						}
					}
				})
			}
		}

	})
}
/* doctor logout api end*/

/* doctor fetch waiting users api start*/
exports.getWaitingUserList = function(req,res){
	var headers = {token:req.body.headers.Authorization_Token};
	if(headers.Authorization_Token == ''){
		res.status(201).json({"status_code":201,"status_message":"invalid parameter or value passed"});
		return false;
	}
	validateToken(headers.token,function(err,result){
		if(err){
			res.status(500).json({"status_code":500,"status_message":"internal server error"});	
		}
		if(result.status_code == 200){
			var params = {id:req.body.body.id};
			if(params.id == ''){
				res.status(201).json({'status_code':201,"status_message":"invalid parameter or value passed"});
				return false;
			}else{
				var sql = db.query('SELECT patient.*,pcp_waiting_room.checked_in FROM patient JOIN pcp_waiting_room ON patient.id = pcp_waiting_room.patient_id WHERE patient.parent_id = 0 AND pcp_waiting_room.pcp_doctor_id ='+params.id,params, function(err,rows,fields){
					if(err){
						res.status(500).json({"status_code":500,"status_message":"internal server error","error":err});
						}else{
							if(rows){
								res.status(200).json({"status_code":200,"status_message":"user exists","result":rows});
								}else{
									res.status(404).json({"status_code":404,"status_message":"user not found"});
								}
						}
					})
			}
		}
	})
}
/* doctor fetch waiting users api end*/

/* doctor fetch waiting users from user id api start*/

exports.getWaitingUserListFromUserId = function(req,res){
	var headers = {token:req.body.headers.Authorization_Token};
	if(headers.token == ''){
		res.status(201).json({"status_code":201,"status_message":"invalid parameter or value passed"});
		return false;
	}
	validateToken(headers.token, function(err,result){
		if(err){
			res.status(500).json({"status_code":500,"status_message":"internal server error"});	
		}
		if(result.status_code == 200){
			var params = {patient_id : req.body.body.patient_id, pcp_doctor_id : req.body.body.pcp_doctor_id};
			if(params.patient_id == '' || params.pcp_doctor_id == ''){
				res.status(201).json({"status_code":201,"status_message":"invalid parameter or value passed"});
				return false;
			}else{
				var sql = db.query('SELECT * FROM patient  JOIN pcp_waiting_room ON patient.id = pcp_waiting_room.patient_id WHERE  patient.parent_id = 0 AND pcp_waiting_room.pcp_doctor_id = '+params.pcp_doctor_id+' AND pcp_waiting_room.patient_id='+params.patient_id,params, function(err,rows,fields){
					if(err){
						res.status(500).json({"status_code":500,"status_message":"internal server error","error":err});
						}else{
							if(rows){
								res.status(200).json({"status_code":200,"status_message":"user exists","result":rows});
								}else{
									res.status(404).json({"status_code":404,"status_message":"user not found"});
								}
						}
					})
			}
		}
		})
}


/* doctor fetch waiting users from user id api end*/

/* delete user from waiting table for doc api start*/ 
exports.deleteWaitingUser = function(req,res){
	var headers = {token:req.body.headers.Authorization_Token};
	if(headers.token == ''){
		res.status(201).json({"status_code":201,"status_message":"invalid parameter or value passed"});
		return false;	
	}
	validateToken(headers.token,function(err,result){
		if(err){
			res.status(500).json({"status_code":500,"status_message":"internal server error"});	
		}
		if(result.status_code == 200){
			var params = {patient_id : req.body.body.patient_id};
			if(params.patient_id == ''){
				res.status(201).json({"status_code":201,"status_message":"invalid parameter or value passed"});
				return false;				
			}else{
				var sql = db.query('DELETE FROM pcp_waiting_room WHERE patient_id='+params.patient_id,params,function(err,rows,fields){
					if(err){
						res.status(500).json({"status_code":500,"status_message":"internal server error"});	
						}else{
							if(rows){
								res.status(200).json({"status_code":200,"status_message":"user deleted"});
							}else{
								res.status(404).json({"status_code":404,"status_message":"user not found"});	
							}
						}
					})
			}
		}
		})
}



/* delete user from waiting table for doc api end*/ 

/* doctor fetch user call data api start*/

exports.getUserCallDetails = function(req,res){
	var headers = {token:req.body.headers.Authorization_Token};
	if(headers.Authorization_Token == ''){
		res.status(201).json({"status_code":201,"status_message":"invalid parameter or value passed"});
		return false;
	}
	validateToken(headers.token,function(err,result){
		if(err){
			res.status(500).json({"status_code":500,"status_message":"internal server error"});	
		}
		if(result.status_code == 200){
			var params = {id:req.body.body.id};
			if(params.id == ''){
				res.status(201).json({'status_code':201,"status_message":"invalid parameter or value passed"});
				return false;
			}else{
				var sql = db.query('SELECT * FROM patient  JOIN pcp_waiting_room ON patient.id = pcp_waiting_room.patient_id WHERE patient.parent_id = 0 AND pcp_waiting_room.patient_id ='+params.id,params, function(err,rows,fields){
					if(err){
						res.status(500).json({"status_code":500,"status_message":"internal server error","error":err});
					}else{
						if(rows){
								res.status(200).json({"status_code":200,"status_message":"user exists","result":rows});
							}else{
								res.status(404).json({"status_code":404,"status_message":"user not found"});
							}
					}		
				})
			}
		}
	})
}


/* doctor fetch user call data api end*/




/* check if user exists */
exports.patientexists = function(req,res){
	var params = {emailphone : req.body.emailphone};
	if(params.emailphone == ''){
		res.status(201).json({'status_code':201,"status_message":"invalid parameter or value passed"});
		return false;
	}else{
		var sql = db.query('SELECT * FROM patient WHERE parent_id = 0 AND (email= \''+params.emailphone+'\' OR phone=\''+params.emailphone+'\')',function(err,rows,fields){
			if(err){
				res.status(500).json({"status_code":500,"status_message":"internal server error","error":err});
				}else{
					if(rows.length == 1){
						res.status(200).json({"status_code":200,"status_message":"user exists","result":rows});
					}else{
						res.status(404).json({"status_code":404,"status_message":"user not found"});
					}
				}
			})
	}
}
/* check if user exists ends*/




/* save user meeting details api */

exports.saveUserMeeting = function(req,res){ 
	if(req.body.email == '' || req.body.phone == ''){ 
		res.status(201).json({'status_code':201,"status_message":"invalid parameter or value passed"});
		return false;
	}
	var params = {first_name:req.body.first_name,last_name:req.body.last_name,email:req.body.email,phone:req.body.phone,
					gender:req.body.gender,dateofbirth:req.body.dateofbirth,address1:req.body.address1,state:req.body.state,
					city:req.body.city,zip_code:req.body.zip_code,role:"PCP",registration_from:"WEB_CHECKIN"};
	var validParam = {email : req.body.email, phone : req.body.phone};
	var validateEmailPhone = db.query('SELECT * FROM patient  WHERE parent_id = 0 AND email =\''+validParam.email+'\' AND phone =\''+validParam.phone+'\'',validParam, function(err,rows,fields){
		if(err){
			res.status(500).json({"status_code":500,"status_message":"internal server error","error":err});
			}else{
				if(rows.length > 0){
					var sql = db.query('UPDATE patient SET ? WHERE email= \''+params.email+'\'',params,function(err,rows,fields){
					if(err){
						res.status(500).json({"status_code":500,"status_message":"internal server error","error":err});
						}else{
							if(rows){
								res.status(200).json({"status_code":200,"status_message":"user added"});
							}else{
								res.status(404).json({"status_code":404,"status_message":"user not found"});
							}
						}
					})
					//res.status(402).json({"status_code":402,"status_message":"email or phone already exists"});
				}else{
					var sql = db.query('INSERT INTO patient SET ?',params,function(err,rows,fields){
					if(err){
						res.status(500).json({"status_code":500,"status_message":"internal server error","error":err});
						}else{
							if(rows){
								res.status(200).json({"status_code":200,"status_message":"user added"});
							}else{
								res.status(404).json({"status_code":404,"status_message":"user not found"});
							}
						}
					})
				}
			}
		})
}



// exports.saveUserMeeting = function(req,res){
// 	var params = {id:req.body.id,first_name:req.body.first_name,last_name:req.body.last_name,email:req.body.email,phone:req.body.phone,
// 					gender:req.body.gender,date_of_birth:req.body.date_of_birth,address:req.body.address,state:req.body.state,
// 					city:req.body.city,zip:req.body.zip,role:"PCP",registration_from:"WEB_CHECKIN"};
// 	if(params.email == ''){
// 		res.status(201).json({'status_code':201,"status_message":"invalid parameter or value passed"});
// 		return false;
// 	}else{
// 		if(params.id){
// 			var sql = db.query('UPDATE patient SET ? WHERE id='+params.id,params,function(err,rows,fields){
// 			if(err){
// 				res.status(500).json({"status_code":500,"status_message":"internal server error","error":err});
// 				}else{
// 					if(rows){
// 						res.status(200).json({"status_code":200,"status_message":"user added"});
// 					}else{
// 						res.status(404).json({"status_code":404,"status_message":"user not found"});
// 					}
// 				}
// 			})	
// 		}else{
// 			var sql = db.query('INSERT INTO patient SET ?',params,function(err,rows,fields){
// 			if(err){
// 				res.status(500).json({"status_code":500,"status_message":"internal server error","error":err});
// 				}else{
// 					if(rows){
// 						res.status(200).json({"status_code":200,"status_message":"user added"});
// 					}else{
// 						res.status(404).json({"status_code":404,"status_message":"user not found"});
// 					}
// 				}
// 			})
// 		}
		
// 	}	
// }

/* get user id api */

exports.getSavedUserId = function(req,res){
	var params = {email : req.body.email};
	if(params.email == ''){
		res.status(201).json({'status_code':201,"status_message":"invalid parameter or value passed"});
		return false;
		}else{
			var sql = db.query('SELECT id FROM patient WHERE parent_id =0 AND email = \''+params.email+'\'',params,function(err,rows,fields){
				if(rows.length){
					res.status(200).json({"status_code":200,"status_message":"user id","result":rows});
				}else{
					res.status(404).json({"status_code":404,"status_message":"doctor not found","result":rows});
				}
				})
		}
}

/* get doc data from alias api */
exports.getDocFromAlias = function(req,res){
	var params = {alias : req.body.alias};
	if(params.alias == ''){
		res.status(201).json({'status_code':201,"status_message":"invalid parameter or value passed"});
		return false;
		}else{
			var sql = db.query('SELECT id,name FROM pcp_doctor WHERE room_alias = \''+params.alias+'\'  OR room = \''+params.alias+'\'',params,function(err,rows,fields){
				if(err){
					res.status(500).json({"status_code":500,"status_message":"internal server error","error":err});	
				}else{
					if(rows){
						res.status(200).json({"status_code":200,"status_message":"doctor data","result":rows});
					}else{
						res.status(404).json({"status_code":404,"status_message":"doctor not found"});
					}
				}
				})
		}
}
 

/* add user to waiting room api */

exports.addUserToWaiting = function(req,res){
	var params = {pcp_doctor_id : req.body.docId,patient_id: req.body.userId};
	if(params.docId == '' || params.userId == ''){
		res.status(201).json({'status_code':201,"status_message":"invalid parameter or value passed"});
		return false;
		}else{
			var sql1 = db.query('SELECT * FROM pcp_waiting_room WHERE patient_id='+params.patient_id,params,function(err,rows,fields){
				if(err){
					res.status(201).json({'status_code':201,"status_addUserToWaitingmessage":"invalid parameter or value passed"});
					return false;
					}else{
						if(rows.length > 0){

							getOpenTokCallback(function(err,resultOpentok){
								if(resultOpentok.status_code == 200){
									params.session = resultOpentok.result[0].session;
									params.token = resultOpentok.result[0].token;
									params.checked_in = new Date();
									var sql = db.query('UPDATE pcp_waiting_room SET ? WHERE patient_id ='+params.patient_id+'',params,function(err,rows,fields){
										if(err){
											res.status(201).json({'status_code':201,"status_message":"invalid parameter or value passed"});
											return false;
										}else{
										if(rows){
											res.status(200).json({"status_code":200,"status_message":"data saved successfully"});
										}else{
											res.status(404).json({"status_code":404,"status_message":"sorry unable to save"});
											}
										}
									})
								}

								})
						}else{
							getOpenTokCallback(function(err,resultOpentok){
								if(resultOpentok.status_code == 200){
									params.session = resultOpentok.result[0].session;
									params.token = resultOpentok.result[0].token;
									var sql = db.query('INSERT INTO pcp_waiting_room SET ?',params,function(err,rows,fields){
										if(err){
											res.status(201).json({'status_code':201,"status_message":"invalid parameter or value passed"});
											return false;
										}else{
										if(rows){
											res.status(200).json({"status_code":200,"status_message":"data saved successfully"});
										}else{
											res.status(404).json({"status_code":404,"status_message":"sorry unable to save"});
											}
										}
									})
								}

								})
							//res.status(200).json({"status_code":200,"status_message":"already in waiting table"});
						}
					}
				})
		}
}



function randomValueBase64(len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

function randomRoomNumber(){
	return Math.floor(100000 + Math.random() * 900000);
}

var validateToken = function(token,callback){
	var query = 'SELECT * FROM pcp_doctor WHERE token = \"'+token+'\"';
	db.query(query,function(error,rows){
		if(error){
			callback(null,{"status_code":500,"status_message":"internal server error"});
		}else{
			if(rows){
				callback(null,{"status_code":200,"status_message":"token is valid"});	
			}else{
				callback(null,{"status_code":404,"status_message":"token not found"});	
			}
		}

		})
}


var getOpenTokCallback = function(callback){
	var opentokArray = [];
	var sessionId;
	var token;
	opentok.createSession(function(err, session) {
		if (err) return console.log(err);
		sessionId = session.sessionId;
	  	token = opentok.generateToken(sessionId);
	  	//app.locals.opentokkeys = opentokkeys;
	  	//app.locals();
	  	opentokArray.push({'session':sessionId,'token':token});
		callback(null,{"status_code":200,"result":opentokArray});
	});
}
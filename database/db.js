var mysql  = require("mysql");
var con = mysql.createConnection({
	host: "10.138.0.31",
	user: "akosmd",
	password: "cty5SpU2gehmDuAw",
	database: "akosmd_prod"
	});
	con.connect(function(err){
    	if(err) throw err;
    	console.log('connected');

	});

module.exports = con;

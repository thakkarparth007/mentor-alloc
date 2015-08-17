var express = require('express');
var router = express.Router();
var fs = require('fs');

function validateLogin(uname, pwd, cb) {
	function log(uname,pwd,dept,success) {
		fs.open('./logs/login_log.txt','a',function(err, fd) {
			var buf = new Buffer("[ " + new Date() + " ] LOGIN " + uname + ":" + pwd + "@" + dept + "\tStatus: " + (success ? "Logged In\n" : "Login Failed\n"));
			fs.write(fd, buf, 0, buf.length, null, function(err) {
				if(err)	throw err;
				fs.close(fd, function(err) {
					if(err) throw err;
				});
			});
		});
	}

	var logins = [
		["Snigdha","chhotu motu","ARCHI"],

		["Parth","epicboss","CSE"],
		["Suhith","utubeapi","CSE"],
		["Sachin","quackitbbz","CSE"],
		
		["Kavya","parth is awesome","PROD"],
		["Daksh","saale bhen****","PROD"],
		["Suraj","yeda samjha hai?","PROD"],
		["Rajesh","treasurer123","PROD"],
		["Anu","bouncing babe","PROD"],

		["Varun","mangoes from village","MECH"],
		["Shakthidhar","the epic run","MECH"],
		
		["Aishwaryaa","i'm the dasa girl","ECE"],
		["Sashank","fafaank","ECE"],
		
		["Stutee","anda ka fanda","MME"],
		
		["Shriya","i hate you","ICE"],
		
		["Shubham","mallu gf","CHEM"],
		["Preetham","mike testing","CHEM"],
		["Teja","bheja fry","CHEM"],
		
		["Sivagar","anime? i love you","EEE"],
		
		["Varshini","settings.ini","CIVIL"],
		["Saikiran","baalti bhar paani","CIVIL"]
	];
	for(var i = 0; i < logins.length; i++) {
		if(uname == logins[i][0] && pwd == logins[i][1]) {
			log(uname,pwd,logins[i][2],true);
			return cb(null, { department: logins[i][2]});
		}
	}
	log(uname,pwd,"N/A",false);
	cb(null, false);
}

/* login page */
router.get('/login', function(req, res, next) {
	if(req.session.isLoggedIn) {
		res.redirect('/');
		return;
	}
	res.set('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
	res.render('login');
});

router.post('/login', function(req, res) {
	if(req.session.isLoggedIn) {
		res.redirect('/');
		return;
	}
	var uname = req.body.username,
		pwd = req.body.password;

	var errorMessages = [];
	if(!uname || typeof uname !== "string" || !uname.trim())
	{
		errorMessages.push("Username missing.");
	}
	else if(!uname || typeof uname !== "string" || !uname.trim())
	{
		errorMessages.push("Password missing.");
	}
	else {
		validateLogin(uname,pwd,function(err,result) {
			if(err) {
				console.log(err);
				res.render('error', {
					message: 'Internal Server Error. Retry in a while.',
					error: {}
				});
			}
			else if(result) {
				req.session.isLoggedIn = true;
				req.session.username = uname;
				req.session.department = result.department;
				res.redirect('/');
			}
			else {
				res.render('login', {
					errorMessage: 'Invalid login credentials.'
				});
			}
		});
		return;
	}

	res.render('login',{
		errorMessage: errorMessages.join("<br>")
	});
});

module.exports = router;

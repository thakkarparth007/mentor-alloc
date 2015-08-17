var express = require('express');
var fs = require('fs');
var router = express.Router();

function validateLogin(uname, pwd, cb) {
	if(uname == "Parth" && pwd == "password")
		cb(null, { department: 'CSE' });
	else
		cb(null, false);
}

/* GET home page. */
router.get('/', function(req, res, next) {
	var dept = req.session.department.toUpperCase();
	res.set('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
	res.render('dashboard',{
		department: dept
	});
});

module.exports = router;

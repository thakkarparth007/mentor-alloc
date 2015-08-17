var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/logout', function(req,res,next) {
	function log(uname,dept) {
		fs.open('./logs/login_log.txt','a',function(err, fd) {
			var buf = new Buffer("[ " + new Date() + " ] LOGOUT: " + uname + "@" + dept + "\n");
			fs.write(fd, buf, 0, buf.length, null, function(err) {
				if(err)	throw err;
				fs.close(fd, function(err) {
					if(err)	throw err;
				});
			});
		});
	}
	log(req.session.username, req.session.department);
	req.session.destroy();
	res.redirect('/');
	res.end();
});

module.exports = router;

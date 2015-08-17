var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET allotted page. */
router.get('/allotted', function(req, res, next) {
	var dept = req.session.department.toUpperCase();
	fs.exists("./alloc/output/" + dept + "-allotted.js", function(exists) {
		if(exists) {
			var last_modified = fs.statSync("./alloc/output/" + dept + "-allotted.js").mtime;
			res
				.set({
					'Cache-Control': 'no-cache',
					'Last-Modified': last_modified
				});

			last_modified = Math.floor(last_modified.getTime() / 1000) * 1000;
			var ifmodifiedsince = (new Date(req.get('If-Modified-Since'))).getTime();

			//if(ifmodifiedsince !== 'Invalid Date' && last_modified <= ifmodifiedsince) {
			//	res.status(304).end("");
			//}
			//else {
				res.type('application/json').end(fs.readFileSync("./alloc/output/" + dept + "-allotted.js", {encoding: 'utf8'}));
			//}

		}
		else {
			res.json({
				Female: [],
				Male: []
			});
		}
	});
});

/* GET unallocated page. */
router.get('/unallocated', function(req, res, next) {
	var dept = req.session.department.toUpperCase();
	fs.exists("./alloc/output/" + dept + "-unallocated.js", function(exists) {
		if(exists) {
			var last_modified = fs.statSync("./alloc/output/" + dept + "-unallocated.js").mtime;
			res
				.set({
					'Cache-Control': 'no-cache',
					'Last-Modified': last_modified
				});

			last_modified = Math.floor(last_modified.getTime() / 1000) * 1000;
			var ifmodifiedsince = (new Date(req.get('If-Modified-Since'))).getTime();

			//if(ifmodifiedsince !== 'Invalid Date' && last_modified <= ifmodifiedsince) {
			//	res.status(304).end("");
			//}
			//else {
				res.type('application/json').end(fs.readFileSync("./alloc/output/" + dept + "-unallocated.js", {encoding: 'utf8'}));
			//}

		}
		else {
			res.json({
				Female: [],
				Male: []
			});
		}
	});
});

router.post('/allotted', function(req, res, next) {
	var dept = req.session.department.toUpperCase();
	fs.writeFileSync("./alloc/output/" + dept + "-allotted.js", JSON.stringify(req.body));
	res.end("");
});

router.post('/unallocated', function(req, res, next) {
	var dept = req.session.department.toUpperCase();
	fs.writeFileSync("./alloc/output/" + dept + "-unallocated.js", JSON.stringify(req.body));
	res.end("");
});

module.exports = router;

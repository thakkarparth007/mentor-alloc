var fs = require('fs');

var departments = "CSE,MME,PROD,MECH,ECE,ICE,CIVIL,CHEM,EEE".split(",");

var fullstate = {};
var unallocated = [];

var locktime = new Date();

for(var i = 0; i < departments.length; i++) {
	fullstate[departments[i]] = {};

	if(!fs.existsSync('./output/' + departments[i] + '-allotted.js'))
		continue;

	var tmpallotted = JSON.parse(fs.readFileSync('./output-cross-backup/' + departments[i] + "-allotted.js").toString());
	var tmpunallocated = []; //JSON.parse(fs.readFileSync('./output/' + departments[i] + "-unallocated.js").toString());

	var gens = ['Male','Female'];
	for(var j = 0; j < 2; j++) {
		var gender = gens[j];

		for(var k = 0; k < tmpallotted[gender].length; k++) {
			for(var z = 0; z < tmpallotted[gender][k].MenteesList.length; z++) {
				if(!tmpallotted[gender][k].MenteesList[z].__locked)
					tmpallotted[gender][k].MenteesList[z].__locked = locktime;
			}
		}

		unallocated = unallocated.concat(tmpunallocated[gender]);
		
		fullstate[departments[i]][gender] = tmpallotted[gender];
	}

	fs.writeFileSync('./output-cross-backup/' + departments[i] + "-allotted.js",JSON.stringify(tmpallotted));
}

fs.writeFileSync('ALLOTTED.json', JSON.stringify(fullstate));
fs.writeFileSync('UNALLOCATED.json', JSON.stringify(unallocated));
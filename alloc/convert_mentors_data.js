var fs = require('fs');

if(process.argv.length != 3) {
	console.log("Expected exactly one argument - the name of the tsv file containing the MENTOR-form data");
	process.exit();
}

var form_file = process.argv[2];
var formdata = fs.readFileSync(form_file).toString();

var lines = formdata.split("\n");

var data = [];
try {
	//data = JSON.parse(fs.readFileSync('./new.mentors.uncategorized.json').toString());
}
catch(e) {}

// 0th line has the column headers
for(var i = 1; i < lines.length; i++) {
	var col = lines[i].split("\t");
	data.push({
		// col[0] is the timestamp
		id: "Mentor:" + col[3] + ":" + col[8] + ":" + col[1],
		Name: col[1].trim(),
		Department: col[2].trim(),
		RollNum: col[3].trim(),
		Gender: col[4].trim(),
		Languages: col[5].trim(),
		State: col[6].trim(),
		Country: col[7].trim(),
		PhNum: col[8].trim(),
		Email: col[9].trim()
	});
}

fs.writeFileSync('./new.mentors-23-7-2015.uncategorized.json', JSON.stringify(data));
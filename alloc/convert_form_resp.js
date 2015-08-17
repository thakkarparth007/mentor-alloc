var fs = require('fs');

if(process.argv.length != 3) {
	console.log("Expected exactly one argument - the name of the tsv file containing the form data");
	process.exit();
}

var form_file = process.argv[2];
var formdata = fs.readFileSync(form_file).toString();

var lines = formdata.split("\n");

var data = [];
try {
	data = JSON.parse(fs.readFileSync('./UNALLOCATED.json').toString());
}
catch(e) {}

// 0th line has the column headers
for(var i = 1; i < lines.length; i++) {
	var col = lines[i].split("\t");
	data.push({
		// col[0] is the timestamp
		id: "Mentee:" + col[2] + ":" + col[3] + ":" + col[1],
		Name: col[1].trim(),
		RollNum: col[2].trim(),
		PhNum: col[3].trim(),
		Gender: col[4].trim(),
		Department: col[5].trim(),
		Languages: col[6].trim(),
		State: col[7].trim(),
		Country: col[8].trim()
	});
}

fs.writeFileSync('./UNALLOCATED.json', JSON.stringify(data));
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
	//data = JSON.parse(fs.readFileSync('./UNALLOCATED.json').toString());
}
catch(e) {}

var new_data = {};

for(var i = 0; i < data.length; i++) {
	var key = data[i].Email;
	if(!key)
		key = Math.random().toString(16);
	new_data[key] = data[i];
}
// 0th line has the column headers
for(var i = 1; i < lines.length; i++) {
	var col = lines[i].split("\t");

	var phnum = col[2].trim().replace(/,/g,"");
	if(/^\d+$/.test(phnum))
		phnum = phnum.substr(0,10);

	var key = col[8].trim() + ":" + phnum;

	new_data[key] = {
		// col[0] is the timestamp
		id: "Mentee:" + phnum + ":" + col[8] + ":" + col[1],
		Name: col[1].trim(),
		RollNum: "",
		PhNum: phnum,
		Gender: col[3].trim(),
		Department: col[4].trim(),
		Languages: col[5].trim(),
		State: col[6].trim(),
		Country: col[7].trim() || "India",
		Email: col[8].trim()
	};
}

for(var roll in new_data) {
	data.push(new_data[roll]);
}

fs.writeFileSync('./UNALLOCATED.json', JSON.stringify(data));
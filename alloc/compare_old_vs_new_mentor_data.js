var fs = require('fs');

if(process.argv.length != 3) {
	console.log("Expected exactly one argument - the name of the .categorized.json file containing the mentors-form data");
	process.exit();
}

var original_mentors_map = {};
var new_mentors_map = {};

var tmp_orig_mentors = JSON.parse(fs.readFileSync('./mentors.categorized.backup.json'));
var tmp_new_mentors = JSON.parse(fs.readFileSync(process.argv[2]));

if(tmp_new_mentors instanceof Array) {
	console.log("The new mentors data must be first categorized and only then can this script run");
	process.exit();
}

function convert(old, map) {
	for(var dept in old) {

		var gens = ['Male','Female'];
		for(var i = 0; i < 2; i++) {
			var gen = gens[i];
			var mentors = old[dept][gen];
			for(var j = 0; j < mentors.length; j++) {
				if(map[ mentors[j].RollNum ]) {
					console.log("Double entry for %s, %s, %s", mentors[j].Name, mentors[j].RollNum, mentors[j].Department);
				}
				else {
					map[ mentors[j].RollNum ] = mentors[j];
				}
			}
		}
	}
}

console.log("Converting old mentors data...");
convert(tmp_orig_mentors, original_mentors_map);

console.log("\nConverting new mentors data...");
convert(tmp_new_mentors, new_mentors_map);

// count of those who haven't filled the new doc yet
var left_count = {};
var total_left = 0;
var changed_phnums = {};

for(var roll in original_mentors_map) {
	if( !new_mentors_map[roll] )
	{
		var person = original_mentors_map[roll];
		left_count[ person.Department ] = left_count[ person.Department ] || [];
		left_count[ person.Department ].push([roll, person.Name]);
		total_left++;
		console.log(roll + " has not filled yet.");
	}
	else if(new_mentors_map[roll].PhNum != original_mentors_map[roll].PhNum) {
		var dept = original_mentors_map[roll].Department;
		changed_phnums[dept] = changed_phnums[dept] || [];
		changed_phnums[dept].push(original_mentors_map[roll].Name + "\t changed phone number from " + original_mentors_map[roll].PhNum + " to " + new_mentors_map[roll].PhNum);
	}
}

console.log("Yet to fill:\n==========================\n");
for(var dept in left_count) {
	console.log(dept, left_count[dept].length);
	var names = [];
	for(var i = 0; i < left_count[dept].length; i++) {
		console.log(left_count[dept][i][0], left_count[dept][i][1]);
	}
	console.log("\n");
}

console.log("Totally, %d are yet to fill.", total_left);

console.log("\n=========================\n");

for(var dept in changed_phnums) {
	console.log(dept, changed_phnums[dept].length);
	for(var i = 0; i < changed_phnums[dept].length; i++) {
		console.log(changed_phnums[dept][i]);
	}
	console.log("\n");
}
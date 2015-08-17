// file to count the number of unallocated and allotted people per department.

var fs = require('fs');

var alloc = {};
var unalloc = {}; 
var o = "ARCHI,CHEM,CIVIL,CSE,ECE,EEE,ICE,MECH,MME,PROD".split(",");

for(var dept in o) {
	if(o[dept] == "ARCHI") continue;
	alloc[o[dept]] = JSON.parse(fs.readFileSync('./output/' + o[dept].toUpperCase() + '-allotted.js'));
	unalloc[o[dept]] = JSON.parse(fs.readFileSync('./output/' + o[dept].toUpperCase() + '-unallocated.js'));
}

var ans = "";
var bad_depts = [];
var total_unalloc = 0;
var total_alloc = 0;
for(var dept in unalloc) { 
	var x = unalloc[dept].Male.length + unalloc[dept].Female.length;
	var y = 0;

	var gen = ["Male","Female"];
	for(var i = 0; i < 2; i++)
	{
		for(var j = 0; j < alloc[dept][gen[i]].length; j++)
			y += alloc[dept][gen[i]][j].MenteesList.length;
	}

	ans += dept + "\tAllotted: " + y + "\tUnallocated: " + x + "\tTotal: " + (x+y) + "\n";

	if(x !== 0) bad_depts.push(dept + "(" + x + "/" + (x+y) + ")");

	total_unalloc += x;
	total_alloc += y;
}

console.log(ans);
console.log("Bad departments: ", bad_depts.join(", "));
console.log('Allotted: %d\nUnallocated: %d\nTotal: %d', total_alloc, total_unalloc, total_unalloc + total_alloc);
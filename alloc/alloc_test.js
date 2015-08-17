var util = require('util');
var Alloc = require('./alloc_cross_dept.js').Alloc;

console.log("WARNING: Using cross-allocation.");

function log(o) {
	console.log(util.inspect(o, false, null));
}

var TestAlloc = (function() {

	function ranElem(ar) {
		var i = Math.floor(Math.random() * ar.length);
		return ar[i];
	}
	var names = "Parth,Arun,Harshitha,Akshaya,GS,Shruthi,Subs,Panda,Shradha,Kaushik,Snigdha,Shubham,Arjun,Hithesh,Arvind,Ayush,Arvindmani".split(",");
	var rollNums = [];
	for(var i = 101; i < 111; i++)
	   for(var j = 0; j < 100; j++)
	      rollNums.push(i + "114" + j);
	var departments = "CSE,MME,PROD,MECH,ECE,ICE,Civil,Chem,Archi,EEE".split(",");
	var languages = "Hindi,Gujarati,Tamil,Telugu,Kannada,Marathi,Malayalam,Rajasthani".split(",");
	var States = "Jammu Kashmir,Himachal Pradesh,Punjab,Uttarakhand," +
					"Punjab,Haryana,Delhi,Uttar Pradesh,Rajasthan,Bihar," +
					"Gujarat,Madhya Pradesh,Chhattisgarh,Orissa,Odisha," +
					"West Bengal,Maharashtra,Telangana,Andhra Pradesh,Tamil Nadu," +
					 "Sikkim,Meghalaya,Assam,Asom,Nagaland," +
					"Arunachal Pradesh,Manipur,Mizoram,Tripura,Kerala";
	States = States.split(",");
	
	var countries = "India,India,India,India,India,India,India,India,India,UAE,India,USA,Egypt,India,India,Singapore,India,India".split(",");

	return {
		stats: function(arr) {
			var stats = {};
			for(var i = 0; i < arr.length; i++) {
				var p = arr[i];
				stats[p.Department] = stats[p.Department] || { Female: 0, Male: 0, states: {}};
				stats[p.Department][p.Gender]++;
				stats[p.Department].states[p.State] = stats[p.Department].states[p.State] || { Female: 0, Male: 0};
				stats[p.Department].states[p.State][p.Gender]++;
			}
			return stats;
		},
		makePerson: function() {
		   var o = {};
		   o.Name = ranElem(names) + " " + ranElem(names);
		   o.RollNum = ranElem(rollNums);
		   o.PhNum = 9000000000 + Math.floor(Math.random() * 999999999);
		   o.Gender = ranElem( ["Male","Male","Male","Female"] );
		   o.Department = ranElem(departments);
		   o.Languages = "English," + ranElem(languages) + "," + ranElem(languages);
		   o.State = ranElem(States);
		   o.Country = ranElem(countries);
		   return o;
		},
		makeArrays: function(mentors, mentees, M, m) {
			var depts = {};
			/*
				{
					Female: howmany,
					Male: howmay
					states: { 'Tamil Nadu': { Female: ?, Male: ?} ... }
				}
			*/
			var mentor_stats = {};
			var mentee_stats = {};
			for(var i = 0; i < M; i++) {
				var p = this.makePerson();
				mentors.push(p);
				depts[p.Department] = 1;
			}
			depts = Object.keys(depts);
			for(var i = 0; i < m; i++) {
				var p = this.makePerson();
				p.Department = ranElem(depts);
				mentees.push(p);
			}

			mentor_stats = this.stats(mentors);
			mentee_stats = this.stats(mentees);
			return {
				mentor_stats: mentor_stats,
				mentee_stats: mentee_stats
			};
		}
	};
})();

var alert = console.error;
var mentors = [], mentees = [];
var stats = null;

// read input from input files. Don't generate random data
if(process.argv.length == 4) {
	mentors = JSON.parse( require('fs').readFileSync(process.argv[2]) );
	mentees = JSON.parse( require('fs').readFileSync(process.argv[3]) );
	
	stats = {
		mentor_stats: TestAlloc.stats(mentors),
		mentee_stats: TestAlloc.stats(mentees)
	};

	work();	
}
// generate random data, store in mentors.in and mentees.in
// Don't process
else if(process.argv.length == 3 && process.argv[2] == "--generate") {
	TestAlloc.makeArrays(mentors, mentees, 200, 1000);

	require('fs').writeFileSync('mentors.in', JSON.stringify(mentors));
	require('fs').writeFileSync('mentees.in', JSON.stringify(mentees));
	return;
}
// generate random data and 
else if(process.argv.length == 2) {
	stats = TestAlloc.makeArrays(mentors, mentees, 200, 1000);
	work();
}
// error
else {
	console.log("Error. Bad number of arguments.");
	return;
}

function work() {
/*	console.log("Test case stats:\n******************************************************");
	log(stats);
	console.log("Mentors:\n*************************************************************");
	log(mentors);
	console.log("Mentees:\n*************************************************************");
	log(mentees);
	console.log("\n\n\n*************************************************************");*/
	var x = (Alloc.allot( mentors, mentees ));
/*	console.log("**********************\n\n\n\n\n\n\n\n");
	log(x);
	console.log("\n\n***************************\n\n\n");
	console.log('Allotment stats');

	function ML(arr, un) {
		if(un) return arr.length;
		return arr.reduce(function(prev_val,cur_val,idx,arr) {
			return prev_val + cur_val.MenteesList.length;
		}, 0);
	}

	for(var d in x.allotted) {
		console.log(d + ": ");
		console.log("\tAllotted: (f,m) " + ML(x.allotted[d].Female) + ", " + ML(x.allotted[d].Male));
		console.log("\tUnallotted: (f,m) " + ML(x.unallocated[d].Female, true) + ", " + ML(x.unallocated[d].Male, true));
		console.log("\n");
	}*/
}
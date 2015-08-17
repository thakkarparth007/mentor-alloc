/*
	Module: alloc.js
	Description: Given an array of mentors and mentees, it returns an
				 object containing lists of allocated and unallocated
				 mentees along with their mentors (for allocated people)
 */

/*
	Input:
		2 arrays of objects of type (first array - list of mentors, second - list of mentees):
		The input must have the full department name
{
	Name,
	RollNum,
	PhNum,
	Gender,
	Department,
	Languages,      (in order of proficiency; space-separated-string)
	State           (State in India)
	Country         (India for non-DASAs)
}
	Output:
		An object of type:
		{
			allocated: {
				Department: {
					"Female": [
						Name,
						RollNum,
						PhNum,
						Gender,
						Department,
						Languages,
						State,
						Country,
						MenteesList: array of objects of type: {
							Name,
							RollNum,
							PhNum,
							Gender,
							Department,
							Languages,
							State,
							Country
						}
					],
					"Male": [ . . . ],
				}
				.
				.
				.
			},
			unallocated: {
				Department: {
					Female: [...]
					Male: [...]
				}
				.
				.
				.
			}
		}
*/

var fs = require('fs');

var Alloc = {
	error:      function(msg) { },
	categorize: function(list) { },
	id: 		function(pos,person) { },
	matchLanguage:      function(person1, person2) { },
	handleDepartment:   function(deptMentorsList, deptMenteesList) { },
	handleGender:       function(mentorsList, menteesList) { },
	UPPER_ALLOTMENT_LIM : 6,
	LOWER_ALLOTMENT_LIM : 3,
	calcSaturation: 	function(mentor) { },
	allot:       function(mentorsList, menteesList) { },
};

Alloc.error = function(msg) {
	//if(alert !== undefined) alert(msg);
	var args = Array.prototype.slice.call(arguments);
	console.error.apply(this, args);
	console.log(args);
};

Alloc.id = function(pos, person) {
	return pos + ":" + person.RollNum + ":" + person.PhNum + ":" + person.Name;
};

Alloc.categorize = function(list, grp) {
	/* 
		Put the mentors/mentees in separate arrays based on their departments
		Sample:
		categorizedList = {
			"CSE": {
				"Female": [
					{   Name, RollNum, PhNum, Department, Gender, Languages, State  }
					...
				],
				"Male": [
					{   Name, RollNum, PhNum, Department, Gender, Languages, State  }
					...
				]
			},
			"ICE": {
				...
			}
			.
			.
			.
		}
	*/ 
	var categorizedList = {};
	for(var i = 0; i < list.length; i++) {
		if(list[i].Department == "ARCHI") continue;
		if( !categorizedList[ grp ? '*' : list[i].Department ] )
			categorizedList[ grp ? '*' : list[i].Department ] = { "Male": [], "Female": [] };

		if(/female/i.test(list[i].Gender))
			list[i].Gender = "Female";
		else
			list[i].Gender = "Male";

		categorizedList[ grp ? '*' : list[i].Department ][ list[i].Gender ].push( list[i] );
	}
	return categorizedList;
};

function toLowerCase(str) { return str ? str.toLowerCase() : "N/A"; }
function toTitleCase(str) {
	var _casefn = "toUpperCase";
	var newstr = "";
	for(var i = 0; i < str.length; i++) {
		newstr += str.substr(i,1)[_casefn]();
		if(/[a-z]/i.test(str.substr(i,1))) {
			_casefn = "toLowerCase";
		}
		else {
			_casefn = "toUpperCase";
		}
	}
	return newstr;
}


Alloc.allot = function(mentorsList, menteesList) {
	var categorizedMentors = mentorsList;
	var categorizedMentees = this.categorize(menteesList, true);

	// unpack the mentors
	categorizedMentors['*'] = {Male: [], Female: []};
	for(var dept in categorizedMentors) {
		if(dept == "*" || dept == "ARCHI") continue;
		categorizedMentors['*'].Male = categorizedMentors['*'].Male.concat(categorizedMentors[dept].Male);
		categorizedMentors['*'].Female = categorizedMentors['*'].Female.concat(categorizedMentors[dept].Female);
		delete categorizedMentors[dept];
	}

	var everything = this.handleDepartment(categorizedMentors['*'], categorizedMentees['*']);
	var leftovers = [];
	var table = [];
	['Male','Female'].forEach(function(gender) {
		for(var i = 0; i < everything[gender].length; i++) {
			var mentor = everything[gender][i];
			for(var j = 0; j < mentor.MenteesList.length; j++) {
				var mentee = mentor.MenteesList[j];
				table.push([
					mentee.Department,
					toTitleCase(mentee.Name),
					toTitleCase(mentor.Name),
					mentor.PhNum,
					mentor.Department
				]);
			}
		}

		var unallocated = categorizedMentees['*'];
		for(var i = 0; i < unallocated[gender].length; i++) {
			var mentee = unallocated[gender];
			if(unallocated[gender].Mentor === null) {
				leftovers.push([
					mentee.Department,
					toTitleCase(mentee.Name),
					"-", "-", "-"
				]);
			}
		}
	});

	table.sort(function(a, b) {
		// mentee-department first
		if(a[0] < b[0]) return -1;
		if(a[0] > b[0]) return 1;

		if(a[1] < b[1]) return -1;
		if(a[1] > b[1]) return 1;

		return 0;
	});

	table = table.map(x => x.join("\t"));
	leftovers = leftovers.map(x => x.join("\t"));

	table = table.concat(leftovers);

	fs.writeFileSync('./output-cross/TOTAL-ALLOTMENTS.tsv', "Mentee Name\tMentee Department\tMentor Name\tMentor Ph.Num\tMentor Department\n" + table.join("\n"));
	/*log(categorizedMentors);
	console.log("****************\n\n\n\n\n\n")
	log(categorizedMentees);
*/
	return {
		"allotted" : "",
		"unallocated": ""
	};
};

Alloc.handleDepartment = function(deptMentorsList, deptMenteesList) {
	var dept = {
		Female: {},
		Male:   {}
	};
	dept.Female = this.handleGender(deptMentorsList.Female, deptMenteesList.Female);
	dept.Male   = this.handleGender(deptMentorsList.Male, deptMenteesList.Male);

	return dept;
};

/*
	1. Make a list of form:
		{
			State: {
				mentors: [],
				mentees: []
			}
			.
			.
			.
		}
	2. For each State in the list,
		For each mentee:
			allot a mentor with the highest "degree of unsaturation"
			Make sure languages match (shouldn't be a problem. English is common)
			Do NOT allot more than UPPER_ALLOTMENT_LIM or less than LOWER_ALLOTMENT_LIM
		Once the mentees list has been iterated through, 
		collect the unsaturated mentors and unallocated mentees
		Add them in the leftOvers[] list.
	3. Once all States are done, we deal with leftOvers[] list
	4. For each mentee in the leftOvers[] list:
		Make a list of mentors that are from the same region (Hindi/Telugu/Tamil/NorthEast),
		Allot to the mentor with highest "degree of unsaturation"

	For DASAs,
		Allot mentors to mentees such that they share common country and (indian) State first.
		Next round, allot the remaining ones based on common country
		Next round, allot the remaining ones based on indian State
*/

Alloc.calcSaturation = function(mentor) {
	if(!mentor) return -1;
	return mentor.MenteesList.length / Alloc.UPPER_ALLOTMENT_LIM;
};
Alloc.okayJustAllotNow = function(mentors, mentees) {
	for(var i = 0; i < mentees.length; i++) {
		var m = mentees[i];
		m.id = Alloc.id('Mentee', m);
		
		m.Mentor = null;
		var M1 = mentors[0];		// max unsaturated mentor so far
		for(var j = 1; j < mentors.length; j++) {
			var M2 = mentors[j];
			if( (Alloc.calcSaturation(M1) > Alloc.calcSaturation(M2)) && 
				(M2.MenteesList.length < Alloc.UPPER_ALLOTMENT_LIM)) {
				M1 = M2;
			}
		}
		if(Alloc.calcSaturation(M1) >= 0 && Alloc.calcSaturation(M1) < 1) {
			m.Mentor = Alloc.id('Mentor',M1);
			M1.MenteesList.push(m);
		}
		else {
			m.Mentor = null;
		}
	}
};
Alloc.regionalise = function(leftOvers, type, arr) {
	for(var i = 0; i < arr.length; i++) {
		var m = arr[i];
		if(type == "mentees" && m.Mentor)
			continue;
		else if(type == "mentor" && m.MenteeList.length == UPPER_ALLOTMENT_LIM)
			continue;

		var region = null;
		if(m.Country.toLowerCase() != 'india') {
			leftOvers.DASA[type].push(m);
		}
		else if(RegExp(m.State, "i").test(leftOvers.Hindi.States)) {
			leftOvers.Hindi[type].push(m);
		}
		else if(RegExp(m.State, "i").test(leftOvers.Telugu.States)) {
			leftOvers.Telugu[type].push(m);
		}
		else if(RegExp(m.State, "i").test(leftOvers.NorthEast.States)) {
			leftOvers.NorthEast[type].push(m);
		}
		else {
			leftOvers.Others[type].push(m);
		}
	}
};

Alloc.handleGender = function(mentorsList, menteesList) {
	// allotment now has to be done solely based on language and State
	var DASA 	  = [];
	var States    = {};
	var leftOvers = {
		Hindi: 	{
			States: "Jammu Kashmir,Himachal Pradesh,Punjab,Uttarakhand," +
					"Punjab,Haryana,Delhi,Uttar Pradesh,Rajasthan,Bihar," +
					"Gujarat,Madhya Pradesh,Chhattisgarh,Orissa,Odisha," +
					"West Bengal,Maharashtra",
			mentors: [],
			mentees: []
		},
		Telugu: {
			States: "Telangana,Andhra Pradesh",
			mentors: [],
			mentees: []
		},
		NorthEast: {
			States: "Sikkim,Meghalaya,Assam,Asom,Nagaland," +
					"Arunachal Pradesh,Manipur,Mizoram,Tripura",
			mentors: [],
			mentees: []
		},
		DASA: {
			States: "",		// only for consistency
			mentors: [],
			mentees: []
		},
		Others: {
			mentors: [],
			mentees: []
		}
	};

	for(var i = 0; i < mentorsList.length; i++) {
		mentorsList[i].MenteesList = mentorsList[i].MenteesList || [];
		var ar = [];
		for(var j = 0; j < mentorsList[i].MenteesList.length; j++) {
			if(mentorsList[i].MenteesList[j].__locked)
				ar.push(mentorsList[i].MenteesList[j]);
		}
		mentorsList[i].MenteesList = ar;

		var State = mentorsList[i].State = mentorsList[i].State.toLowerCase();
		var Country = mentorsList[i].Country = mentorsList[i].Country.toLowerCase();
		if( Country != "india" ) {
			if(!DASA[Country])
				DASA[Country] = { mentors: [], mentees: [] };

			DASA[Country].mentors.push( mentorsList[i] );
		}
		else {
			if( !States[ State ] )
				States[ State ] = { mentors: [], mentees: [] };
			States[ State ].mentors.push( mentorsList[i] );
		}
	}

	for(var i = 0; i < menteesList.length; i++) {
		if(menteesList[i].__locked) {
			continue;
		}

		menteesList[i].Mentor = null;
		var State = menteesList[i].State = menteesList[i].State.toLowerCase();
		var Country = menteesList[i].Country = menteesList[i].Country.toLowerCase();
		if( Country != "india" ) {
			if(!DASA[Country])
				DASA[Country] = { mentors: [], mentees: [] };

			DASA[Country].mentees.push( menteesList[i] );
		}
		else {
			if( !States[ State ] )
				States[ State ] = { mentors: [], mentees: [] };
			States[ State ].mentees.push( menteesList[i] );
		}
	}

	for(var c in DASA) {
		var Country = DASA[c];
		Alloc.okayJustAllotNow(Country.mentors, Country.mentees);

		Alloc.regionalise(leftOvers, "mentees", Country.mentees);
		Alloc.regionalise(leftOvers, "mentors", Country.mentors);
	}

	for(var s in States) {
		var State = States[s];
		Alloc.okayJustAllotNow(State.mentors, State.mentees);

		Alloc.regionalise(leftOvers, "mentees", State.mentees);
		Alloc.regionalise(leftOvers, "mentors", State.mentors);
	}

	for(var r in leftOvers) {
		var region = leftOvers[r];
		Alloc.okayJustAllotNow(region.mentors, region.mentees);
	}

	return mentorsList;
};

exports.Alloc = Alloc;
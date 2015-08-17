var fs = require('fs');
var Mailgun = require('mailgun-js');
var Handlebars = require('../public/javascripts/handlebars-v3.0.3.js');

var api_key = "key-ce911a908bf38a9b8724ba9d3641b9de";
var domain = "sandbox5528b259ab0644928f1a1625a2004eb1.mailgun.org";

var mailgun = new Mailgun({ apiKey: api_key, domain: domain});
var from = "Orienation Team | NITT <orientation.nitt@gmail.com>";

// handlebars helpers
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
function formatLanguages(str) {
	str = toTitleCase(str);
	return str.split(/ *, */).join(", ");
}

Handlebars.registerHelper('toLowerCase', toLowerCase);
Handlebars.registerHelper('toTitleCase', toTitleCase);
Handlebars.registerHelper('formatLanguages', formatLanguages);

// mail-template
var tmpl = Handlebars.compile( fs.readFileSync('mail_tmpl_mentee.hbs').toString() );

// expects a Mentor object
function generate_mail(data) {
	return {
		from: from,
		to: data.Name + " <" + data.Email + ">",
		subject: "Mentorship Programme",
		html: tmpl(data)
	};
}

var data = JSON.parse(fs.readFileSync('./ALLOTTED.json'));
var mail_count = 0;
var mail_queue = [];
for(var dept in data) {
	//
	// DON'T SEND TO ARCHI!!!!
	//
	if(dept == "ARCHI") continue;
	
	var gen = ['Male','Female'];
	for(var j = 0; j < 2; j++) {
		for(var z = 0; z < data[dept][gen[j]].length; z++) {
			var should_send = false;
			var person = data[dept][gen[j]][z];

			for(var k = 0; k < person.MenteesList.length; k++) {
				var mentee = person.MenteesList[k];
				if(mentee.__locked && mentee.Email && !mentee.__emailed_abt_mentor) {
					should_send = true;
					mentee.__emailed_abt_mentor = true;
					mail_count++;
					
					mail_queue.push([mentee,generate_mail({
						Name: mentee.Name,
						Email: mentee.Email,
						MentorName: person.Name,
						MentorPhNum: person.PhNum,
						MentorDepartment: person.Department,
						MentorEmail: person.Email
					})]);
					console.log(mentee.Name + "\t" + mentee.Email);

					//fs.writeFileSync('./email-mentee/' + mentee.Department + "-" + mentee.Name + '.html', mail_queue[mail_queue.length-1][1].html);
				}
			}

			if(!should_send) continue;
			
			//if(!mail_queue.length)
		}
	}
	fs.writeFileSync('./output/' + dept + '-allotted.js',JSON.stringify(data[dept]));
}

console.log("Sending %d emails.", mail_count);
var sent_mails = 0;

var errors = [];
for(var i = 0; i < mail_queue.length; i++) {
	(function(i) {
		var mail = mail_queue[i][1];
		var person = mail_queue[i][0];

		mailgun.messages().send(mail, function(err, result) {
			sent_mails++;
			if(err) {
				errors.push(err);
				console.log(err);
				person.__emailed_abt_mentor = false;
			}
			else {
				console.log(i+1, result);
			}
			if(sent_mails === mail_queue.length) {
				console.log("%d failures.", errors.length);
				fs.writeFileSync('./ALLOTTED.json',JSON.stringify(data));

				for(var dept in data) {
					fs.writeFileSync('./output/' + dept + '-allotted.js',JSON.stringify(data[dept]));
				}
			}

		});
	})(i);
}
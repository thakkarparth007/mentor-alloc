var fs = require('fs');
var Mailgun = require('mailgun-js');
var Handlebars = require('../public/javascripts/handlebars-v3.0.3.js');

var api_key = "key-526370cd747348169544b56da5c08e7c";
var domain = "sandbox7adb339c063d4fb69dcc6a2703202737.mailgun.org";

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
var tmpl = Handlebars.compile( fs.readFileSync('mail_temp.hbs').toString() );

// expects a Mentor object
function generate_mail(data) {
	return {
		from: from,
		to: data.Name + " <" + data.Email + ">",
		subject: "New mentees allotted",
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
				if(person.MenteesList[k].__locked && new Date(person.MenteesList[k].__locked).getDate() == new Date().getDate() /*!person.MenteesList[k].__emailed*/) {
					should_send = true;
					person.MenteesList[k].__emailed = true;
				}
			}

			if(!should_send) continue;
			
			mail_count++;
			//if(!mail_queue.length)
			mail_queue.push([person,generate_mail(person)]);
			console.log(person.Name);
			//fs.writeFileSync('./email/' + person.RollNum + '.html', generate_mail(person).html);
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
			if(sent_mails === mail_queue.length) {
				console.log("%d failures.", errors.length);
				fs.writeFileSync('./ALLOTTED.json',JSON.stringify(data));

				for(var dept in data) {
					fs.writeFileSync('./output/' + dept + '-allotted.js',JSON.stringify(data[dept]));
				}
			}

			if(err) {
				errors.push(err);
			}
			else {
				console.log(i+1, result);
			}
		});
	})(i);
}
var fs = require('fs');

function categorize(list) {
	var categorizedList = {};
	for(var i = 0; i < list.length; i++) {
		if( !categorizedList[ list[i].Department ] )
			categorizedList[ list[i].Department ] = { "Male": [], "Female": [] };

		if(/female/i.test(list[i].Gender))
			list[i].Gender = "Female";
		else
			list[i].Gender = "Male";

		categorizedList[ list[i].Department ][ list[i].Gender ].push( list[i] );
	}
	return categorizedList;
}

if(process.argv.length != 3) {
	console.log("Exactly 1 argument expected - name of the file containing the uncategorized list");
	process.exit();
}

var oldfile = process.argv[2];

var old_data = JSON.parse(fs.readFileSync(oldfile));

console.log(JSON.stringify(categorize(old_data)));

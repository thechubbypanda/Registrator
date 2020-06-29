const fs = require('fs');
const config = require('../src/config/config.json');

// Line format = FIRSTNAME LASTNAME GROUP1 GROUP2 ...
function encodeJSON(fileContents){
	const lines = fileContents.split('\n');
	// console.log(lines);
	var groups = {};

	lines.forEach(line => {
		const tokens = line.split(' ');
		const firstName = tokens[0];
		const lastName = tokens[1]; 
		for(var i = 2; i < tokens.length; i++)
		{
			if(groups[tokens[i]])
				groups[tokens[i]].push(firstName + ' ' + lastName);
			else {
				groups[tokens[i]] = [(firstName + ' ' + lastName)];
			}
		}
	});

	return JSON.stringify(groups);
}

const fileNameToRead = (process.argv[2]) ? process.argv[2] : config.encode.defaultRegisterFile;
const fileNameToWrite = config.encode.registerOutputFile;

if(!fileNameToRead)
{
	console.error("No file name passed and config.encode.defaultRegisterFile is not set.");
	process.exit(1);
}

fs.readFile(fileNameToRead, 'utf8', (err, data) => {
	if(err){
		console.error(`Could not read ${fileNameToRead}.`);
		process.exit(1);
	} else {
		fs.writeFile(fileNameToWrite, encodeJSON(data), 'utf8', err => {
			if(err)
			{
				console.error("Could not write register.json");
				console.exit(1);
			}
		});
	}
});
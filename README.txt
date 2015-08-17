PROCESS

1. Get the input from the forms.
2. run `node convert_form_resp formdata.tsv`
	-> Stores the input in the UNALLOCATED.json file (takes care to include the previously unallocated people)
3. run `node alloc_test ALLOTTED.json UNALLOCATED.json`
4. Start the server.
5. Let the people make changes.
6. Stop the server.
7. run `node lock`
	-> merges all the files of type `./output/{dept}-allotted.js` into ALLOTTED.json
	-> merges all the files of type `./output/{dept}-unallocated.json` into UNALLOCATED.json

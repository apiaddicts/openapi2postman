'use strict'

const _ = require('lodash');

global.definition = require('./src/parser/definition.js')();
const title = require('./src/parser/title.js')();
const endpointsParsed = require('./src/parser/endpoints.js')();
_.forEach(endpointsParsed, function(endpointParsed,i) {	
	endpointsParsed[i].status = require('./src/parser/status.js')(endpointParsed.verb,endpointParsed.path);
	if (endpointParsed.verb === 'POST' || endpointParsed.verb === 'PUT' || endpointParsed.verb === 'PATCH') {
		endpointsParsed[i].body = require('./src/parser/body.js')(endpointParsed.verb,endpointParsed.path);
		endpointsParsed[i].consumes = require('./src/parser/consumes.js')(endpointParsed.verb,endpointParsed.path);
	}
	endpointsParsed[i].pathParameters = require('./src/parser/pathParameters.js')(endpointParsed.verb,endpointParsed.path);
	endpointsParsed[i].bodyResponse = require('./src/parser/body.js')(endpointParsed.verb,endpointParsed.path,true);
});


const endpointsPostman = require('./src/generator/endpoints.js')(endpointsParsed);
_.forEach(endpointsPostman, function(endpointPostman,i) {	
	endpointsPostman[i] = require('./src/generator/testStatus.js')(endpointPostman);
	endpointsPostman[i] = require('./src/generator/testBody.js')(endpointPostman);
	endpointsPostman[i] = require('./src/generator/body.js')(endpointsPostman[i]);
	endpointsPostman[i] = require('./src/generator/contentType.js')(endpointsPostman[i]);
});
require('./src/generator/collection.js')(title,endpointsPostman);
require('./src/generator/environment.js')(title,endpointsParsed);
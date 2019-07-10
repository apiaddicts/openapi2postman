'use strict'

const _ = require('lodash');

const definition = require('./src/parser/definition.js')();
const title = require('./src/parser/title.js')(definition);
const endpointsParsed = require('./src/parser/endpoints.js')(definition);
_.forEach(endpointsParsed, function(endpointParsed,i) {	
	endpointsParsed[i].status = require('./src/parser/status.js')(definition,endpointParsed.verb,endpointParsed.path);
	if (endpointParsed.verb === 'POST' || endpointParsed.verb === 'PUT' || endpointParsed.verb === 'PATCH') {
		endpointsParsed[i].body = require('./src/parser/body.js')(definition,endpointParsed.verb,endpointParsed.path);
		endpointsParsed[i].consumes = require('./src/parser/consumes.js')(definition,endpointParsed.verb,endpointParsed.path);
	}
});


const endpointsPostman = require('./src/generator/endpoints.js')(endpointsParsed);
_.forEach(endpointsPostman, function(endpointPostman,i) {	
	endpointsPostman[i] = require('./src/generator/testStatus.js')(endpointPostman);
	endpointsPostman[i] = require('./src/generator/body.js')(endpointsPostman[i]);
	endpointsPostman[i] = require('./src/generator/contentType.js')(endpointsPostman[i]);
});
require('./src/generator/collection.js')(title,endpointsPostman);
'use strict'

const _ = require('lodash');

const definition = require('./src/parser/definition.js')();
const title = require('./src/parser/title.js')(definition);
const endpointsParsed = require('./src/parser/endpoints.js')(definition);
_.forEach(endpointsParsed, function(endpointParsed,i) {	
	endpointsParsed[i].responses = require('./src/parser/responses.js')(definition,endpointParsed.verb,endpointParsed.path);
});


const endpointsPostman = require('./src/generator/endpoints.js')(endpointsParsed);
_.forEach(endpointsPostman, function(endpointPostman,i) {	
	endpointsPostman[i] = require('./src/generator/testStatus.js')(endpointPostman);
});
require('./src/generator/collection.js')(title,endpointsPostman);
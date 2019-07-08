'use strict'

const definition = require('./src/parser/definition.js')();
const title = require('./src/parser/title.js')(definition);
const endpointsParsed = require('./src/parser/endpoints.js')(definition);
const endpointsPostman = require('./src/generator/endpoints.js')(endpointsParsed);
require('./src/generator/collection.js')(title,endpointsPostman);
const assert = require('assert');

describe('generator-endpoints', () => {
  
  it('good', () => {

    const definitionInitial = require('../seeds/generatorEndpointsInitial.json');
    const definitionResult = require('../seeds/generatorEndpointsResult.json');

    const definition = require('../src/generator/endpoints.js')(definitionInitial);
    assert.deepStrictEqual(definition, definitionResult);
  });

  it('good with queryParams', () => {

    const definitionInitial = require('../seeds/generatorEndpointsQueryParamsInitial.json');
    const definitionResult = require('../seeds/generatorEndpointsQueryParamsResult.json');

    const definition = require('../src/generator/endpoints.js')(definitionInitial);
    assert.deepStrictEqual(definition, definitionResult);
  });

});
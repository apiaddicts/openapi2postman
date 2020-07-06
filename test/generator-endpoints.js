/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');

describe('generator-endpoints', () => {
  
  it('good', () => {

    const definitionInitial = require('../seeds/generatorEndpointsInitial.json');
    const definitionResult = require('../seeds/generatorEndpointsResult.json');

    const definition = require('../src/generator/endpoints.js')(definitionInitial);
    assert.deepStrictEqual(definition, definitionResult);
  });

});
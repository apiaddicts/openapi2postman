/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');

describe('generator-contentType', () => {
  
  it('good', () => {

    const definitionInitial = require('../seeds/generatorContentTypeInitial.json');
    const definitionResult = require('../seeds/generatorContentTypeResult.json');

    const definition = require('../src/generator/contentType.js')(definitionInitial);
    assert.deepStrictEqual(definition, definitionResult);
  });

});
/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');

describe('generator-testStatus', () => {
  
  it('good', () => {

    const definitionInitial = require('../seeds/generatorTestStatusInitial.json');
    const definitionResult = require('../seeds/generatorTestStatusResult.json');

    const definition = require('../src/generator/testStatus.js')(definitionInitial);
    assert.deepStrictEqual(definition, definitionResult);
  });

});
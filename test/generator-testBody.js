/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');

describe('generator-testBody', () => {
  
  it('good', () => {

    const definitionInitial = require('../seeds/generatorTestBodyInitial.json');
    const definitionResult = require('../seeds/generatorTestBodyResult.json');

    const definition = require('../src/generator/testBody.js')(definitionInitial, {schema_pretty_print: false});
    assert.deepStrictEqual(definition, definitionResult);
  });

});
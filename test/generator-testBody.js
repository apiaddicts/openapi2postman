const assert = require('assert');

describe('generator-testBody', () => {
  
  it('good', () => {

    const definitionInitial = require('../seeds/generatorTestBodyInitial.json');
    const definitionResult = require('../seeds/generatorTestBodyResult.json');

    const definition = require('../src/generator/testBody.js')(definitionInitial);
    assert.deepStrictEqual(definition, definitionResult);
  });

});
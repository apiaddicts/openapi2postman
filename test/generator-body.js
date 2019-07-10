const assert = require('assert');

describe('generator-body', () => {
  
  it('good', () => {

    const definitionInitial = require('../seeds/generatorBodyInitial.json');
    const definitionResult = require('../seeds/generatorBodyResult.json');

    const definition = require('../src/generator/body.js')(definitionInitial);
    assert.deepStrictEqual(definition, definitionResult);
  });

});
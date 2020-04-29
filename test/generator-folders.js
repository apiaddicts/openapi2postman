const assert = require('assert');

describe('generator-folders', () => {
  
  it('good', () => {

    const input = require('../seeds/generatorFoldersInitial.json')
    const output = require('../seeds/generatorFoldersResult.json')

    const outputResult = require('../src/generator/folders.js')(input,{ auth: true })
    assert.deepStrictEqual(output, outputResult)
  });

});
/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');

describe('generator-folders', () => {
  
  it('good', () => {

    const input = require('../seeds/generatorFoldersInitial.json')
    const output = require('../seeds/generatorFoldersResult.json')

    const outputResult = require('../src/generator/folders.js')(input,{ auth: true })
    assert.deepStrictEqual(output, outputResult)
  });

});
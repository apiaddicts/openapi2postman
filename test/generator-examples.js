/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');

describe('generator-examples', () => {
    //Check if the function returns an empty string when there are no examples
    it('no examples', () => {
        global.definition = require('../seeds/generatorExamplesInitial.json')
        const examples = require('../src/generator/examples.js')('/user/{username}','get','400')
        assert.strictEqual(examples, false);
    })
    // Check if the function returns an example when there are examples
    it('with examples', () => {
        global.definition = require('../seeds/generatorExamplesInitial.json')
        const examples = require('../src/generator/examples.js')('/user/{username}','get','200')
        assert.notStrictEqual(examples, false);
    })

});
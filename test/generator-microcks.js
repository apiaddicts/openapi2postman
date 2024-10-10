/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert')
const _ = require('lodash')

describe('generator-microcks', () => {
    it('good', () => {
        global.definition = require('../seeds/generatorMicroksInitialGlobal.json')
        const input = require('../seeds/generatorMicroksResult.json')
        const inputdResultMicroks = _.find(_.get(input,'request.header') ,  { key: 'X-Microcks-Response-Name'})
        const outputResult = require('../src/generator/microcks.js')(input)
        const outputResultMicroks = _.find(_.get(outputResult,'request.header') ,  { key: 'X-Microcks-Response-Name'})
        assert.equal(inputdResultMicroks, outputResultMicroks)
    })
})



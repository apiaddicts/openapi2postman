/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');

describe('generator-authorization', () => {
  
  it('good', () => {

    let endpoint = require('../seeds/generatorEndpointInitial.json');
    const endpointResult = require('../seeds/generatorEndpointResult.json');

    endpoint = require('../src/generator/authorization.js')(endpoint,true);
    assert.deepStrictEqual(endpoint, endpointResult);
  });

});
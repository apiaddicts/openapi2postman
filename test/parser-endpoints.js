/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');
const sinon = require('sinon');

describe('parser-endpoints', () => {
  
  before(() => {
    sinon.stub(process, 'exit');
  })

  after(() => {
    process.exit.restore();
  })

  it('bad swagger2', () => {

    global.definition = require('../seeds/parserEndpointsInitialBad.json');

    require('../src/parser/endpoints.js')();

    sinon.assert.called(process.exit);
    sinon.assert.calledWith(process.exit, 1);
  })

  it('good swagger2', () => {

    global.definition = require('../seeds/parserEndpointsInitialGood.json');

    const endpoints = require('../src/parser/endpoints.js')();
    assert.deepEqual(endpoints, [ 
        { verb: 'GET', path: '/pets' },
        { verb: 'POST', path: '/pets' },
        { verb: 'GET', path: '/pets/{id}' },
        { verb: 'DELETE', path: '/pets/{id}' } 
      ])
  })

  it('good openapi3', () => {

    global.definition = require('../seeds/parserInitialGoodOpenApi3.json');

    const endpoints = require('../src/parser/endpoints.js')();
    assert.deepEqual(endpoints, [ 
        { verb: 'GET', path: '/pets' },
        { verb: 'POST', path: '/pets' },
        { verb: 'GET', path: '/pets/{petId}' } 
      ])
  })


})
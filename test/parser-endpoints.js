/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');
const sinon = require('sinon');

describe('parser-endpoints', () => {
  
before(() => {
    sinon.stub(process, 'exit');
    sinon.stub(console, 'log');
    sinon.stub(console, 'error');
  })

  after(() => {
    process.exit.restore();
    console.log.restore();
    console.error.restore();
  })

  it('endpoints bad swagger2', () => {

    global.definition = require('../seeds/parserEndpointsInitialBad.json');

    require('../src/parser/endpoints.js')();

    sinon.assert.called(process.exit);
    sinon.assert.calledWith(process.exit, 1);
  })

  it('endpoints good swagger2', () => {

    global.definition = require('../seeds/parserEndpointsInitialGood.json');

    const endpoints = require('../src/parser/endpoints.js')();
    assert.deepEqual(endpoints, [ 
        { verb: 'GET', path: '/pets' },
        { verb: 'POST', path: '/pets' },
        { verb: 'GET', path: '/pets/{id}' },
        { verb: 'DELETE', path: '/pets/{id}' } 
      ])
  })

  it('endpoints good openapi3.0', () => {

    global.definition = require('../seeds/parserInitialGoodOpenApi3.json');

    const endpoints = require('../src/parser/endpoints.js')();
    assert.deepEqual(endpoints, [ 
        { verb: 'GET', path: '/pets' },
        { verb: 'POST', path: '/pets' },
        { verb: 'GET', path: '/pets/{petId}' } 
      ])
  })


  it('endpoints good openapi3.1', () => {

    global.definition = require('../seeds/parserInitialGoodOpenApi3.1.json');

    const endpoints = require('../src/parser/endpoints.js')();
    assert.deepEqual(endpoints, [ 
        { verb: 'GET', path: '/pets' },
        { verb: 'POST', path: '/pets' },
        { verb: 'GET', path: '/pets/{petId}' } 
      ])
  })

})
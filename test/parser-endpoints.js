const assert = require('assert');
const sinon = require('sinon');

describe('parser-endpoints', () => {
  
  before(() => {
    sinon.stub(process, 'exit');
  });

  after(() => {
    process.exit.restore();
  });

  it('bad', () => {

    global.definition = require('../seeds/parserEndpointsInitialBad.json');

    require('../src/parser/endpoints.js')();

    sinon.assert.called(process.exit);
    sinon.assert.calledWith(process.exit, 1);
  });

  it('good', () => {

    global.definition = require('../seeds/parserEndpointsInitialGood.json');

    const endpoints = require('../src/parser/endpoints.js')();
    assert.deepEqual(endpoints, [ 
        { verb: 'GET', path: '/pets' },
        { verb: 'POST', path: '/pets' },
        { verb: 'GET', path: '/pets/{id}' },
        { verb: 'DELETE', path: '/pets/{id}' } 
      ]);
  });
});
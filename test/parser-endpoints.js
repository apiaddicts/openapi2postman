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

    const badDefinition = require('../seeds/parserEndpointsInitialBad.json');

    require('../src/parser/endpoints.js')(badDefinition);

    sinon.assert.called(process.exit);
    sinon.assert.calledWith(process.exit, 1);
  });

  it('good', () => {

    const definition = require('../seeds/parserEndpointsInitialGood.json');

    const endpoints = require('../src/parser/endpoints.js')(definition);
    assert.deepEqual(endpoints, [ 
        { verb: 'GET', path: '/pets' },
        { verb: 'POST', path: '/pets' },
        { verb: 'GET', path: '/pets/{id}' },
        { verb: 'DELETE', path: '/pets/{id}' } 
      ]);
  });
});
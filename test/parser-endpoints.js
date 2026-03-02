/** Part of APIAddicts. See LICENSE file or full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');
const sinon = require('sinon');
const getEndpoints = require('../src/parser/endpoints.js');

describe('parser-endpoints', () => {

  before(() => {
    sinon.stub(process, 'exit');
    sinon.stub(console, 'log');
    sinon.stub(console, 'error');
  });

  afterEach(() => {
    process.exit.resetHistory();
  });

  after(() => {
    process.exit.restore();
    console.log.restore();
    console.error.restore();
  });

  const testCases = [
    {
      name: 'endpoints bad swagger2',
      seed: 'parserEndpointsInitialBad.json',
      shouldExit: true
    },
    {
      name: 'endpoints good swagger2',
      seed: 'parserEndpointsInitialGood.json',
      expected: [
        { verb: 'GET', path: '/pets' }, { verb: 'POST', path: '/pets' },
        { verb: 'GET', path: '/pets/{id}' }, { verb: 'DELETE', path: '/pets/{id}' }
      ]
    },
    {
      name: 'endpoints good openapi3.0',
      seed: 'parserInitialGoodOpenApi3.json',
      expected: [
        { verb: 'GET', path: '/pets' }, { verb: 'POST', path: '/pets' },
        { verb: 'GET', path: '/pets/{petId}' }
      ]
    },
    {
      name: 'endpoints good openapi3.1',
      seed: 'parserInitialGoodOpenApi3.1.json',
      expected: [
        { verb: 'GET', path: '/pets' }, { verb: 'POST', path: '/pets' },
        { verb: 'GET', path: '/pets/{petId}' }
      ]
    }
  ];

  testCases.forEach(({ name, seed, expected, shouldExit }) => {
    it(name, () => {
      globalThis.definition = require(`../seeds/${seed}`);
      const endpoints = getEndpoints();

      if (shouldExit) {
        sinon.assert.calledWith(process.exit, 1);
      } else {
        assert.deepEqual(endpoints, expected);
      }
    });
  });

});
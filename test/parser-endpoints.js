/** Part of APIAddicts. See LICENSE file or full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('node:assert');
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

  const checkEndpoints = (name, seed, expectedFile, shouldExit = false) => {
    it(name, () => {
      globalThis.definition = require(`../seeds/${seed}`);
      const endpoints = getEndpoints();

      if (shouldExit) {
        sinon.assert.calledWith(process.exit, 1);
      } else {
        const expected = require(`../seeds/${expectedFile}`);
        assert.deepStrictEqual(endpoints, expected);
      }
    });
  };

  checkEndpoints('endpoints bad swagger2', 'parserEndpointsInitialBad.json', null, true);

  checkEndpoints('endpoints good swagger2', 'parserEndpointsInitialGood.json', 'parserEndpointsGoodSwagger2Result.json');

  checkEndpoints('endpoints good openapi3.0', 'parserInitialGoodOpenApi3.json', 'parserEndpointsGoodOpenApi3Result.json');

  checkEndpoints('endpoints good openapi3.1', 'parserInitialGoodOpenApi3.1.json', 'parserEndpointsGoodOpenApi3Result.json');

});
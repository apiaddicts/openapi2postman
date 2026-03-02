/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');

describe('parser-queryParams', () => {

  const testQuery = (name, parserPath, seed, method, path, expected) => {
    it(name, () => {
      globalThis.definition = require(`../seeds/${seed}`);
      const queryParams = require(`../src/parser/${parserPath}/queryParams.js`)(method, path);
      assert.deepStrictEqual(queryParams, expected);
    });
  };

  const results = {
    empty: [],
    tagsLimit: (reqLimit) => [
      { "name": "tags", "required": false, "type": "array" },
      { "name": "limit", "required": reqLimit, "type": "integer" }
    ]
  };

  testQuery('queryParams fill swagger2', 'swagger2', 'parserQueryParamsGood.json', 'GET', '/pets', results.tagsLimit(false));
  testQuery('queryParams void swagger2', 'swagger2', 'parserQueryParamsGood.json', 'POST', '/pets', results.empty);

  testQuery('queryParams fill openapi3.0', 'openapi3', 'parserInitialGoodOpenApiExpanded3.json', 'GET', '/pets', results.tagsLimit(true));
  testQuery('queryParams void openapi3.0', 'openapi3', 'parserInitialGoodOpenApiExpanded3.json', 'POST', '/pets', results.empty);

  testQuery('queryParams fill openapi3.1', 'openapi3', 'parserInitialGoodOpenApiExpanded3.1.json', 'GET', '/pets', results.tagsLimit(true));
  testQuery('queryParams void openapi3.1', 'openapi3', 'parserInitialGoodOpenApiExpanded3.1.json', 'POST', '/pets', results.empty);

});
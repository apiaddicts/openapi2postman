const assert = require('assert');

describe('parser-summary', () => {
  
  it('good', () => {

    global.definition = require('../seeds/parserSummaryInitial.json');

    const summary = require('../src/parser/summary.js')('POST','/pets');
    assert.equal(summary, "Create a pet");
  });
});
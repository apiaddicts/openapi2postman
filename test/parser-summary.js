const assert = require('assert');

describe('parser-summary', () => {
  
  it('good swagger2', () => {

    global.definition = require('../seeds/parserSummaryInitial.json')

    const summary = require('../src/parser/summary.js')('POST','/pets')
    assert.equal(summary, "Create a pet")
  })

  it('good swagger2', () => {

    global.definition = require('../seeds/parserSummaryOpenApi3.json')

    const summary = require('../src/parser/summary.js')('POST','/pets')
    assert.equal(summary, "Create pet")
  })

})
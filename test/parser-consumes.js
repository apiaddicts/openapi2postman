const assert = require('assert');

describe('parser-consumes', () => {
  
  it('specifies', () => {

    global.definition = require('../seeds/parserConsumesInitial.json');

    const consumes = require('../src/parser/consumes.js')('POST','/pets');
    assert.equal(consumes, 'application/xml');
  });

  it('general', () => {

    global.definition = require('../seeds/parserConsumesInitial.json');

    const consumes = require('../src/parser/consumes.js')('POST','/pets/{id}');
    assert.equal(consumes, 'application/json');
  });

});
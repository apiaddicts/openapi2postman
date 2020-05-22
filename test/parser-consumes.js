const assert = require('assert');

describe('parser-consumes', () => {
  
  it('specifies swagger2', () => {

    global.definition = require('../seeds/parserConsumesInitial.json');

    const consumes = require('../src/parser/swagger2/consumes.js')('POST','/pets');
    assert.equal(consumes, 'application/xml');
  });

  it('general swagger2', () => {

    global.definition = require('../seeds/parserConsumesInitial.json');

    const consumes = require('../src/parser/swagger2/consumes.js')('POST','/pets/{id}');
    assert.equal(consumes, 'application/json');
  });

});
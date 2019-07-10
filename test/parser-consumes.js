const assert = require('assert');

describe('parser-consumes', () => {
  
  it('specifies', () => {

    const definition = require('../seeds/parserConsumesInitial.json');

    const consumes = require('../src/parser/consumes.js')(definition,'POST','/pets');
    assert.equal(consumes, 'application/xml');
  });

  it('general', () => {

    const definition = require('../seeds/parserConsumesInitial.json');

    const consumes = require('../src/parser/consumes.js')(definition,'POST','/pets/{id}');
    assert.equal(consumes, 'application/json');
  });

});
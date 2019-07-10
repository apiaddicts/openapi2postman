const assert = require('assert');

describe('parser-status', () => {
  
  it('void', () => {

    const definition = require('../seeds/parserInitialGood.json');

    const body = require('../src/parser/body.js')(definition,'GET','/pets');
    assert.deepStrictEqual(body, undefined);
  });

  it('fill', () => {

    const definition = require('../seeds/parserInitialGood.json');

    const body = require('../src/parser/body.js')(definition,'POST','/pets');
    assert.deepStrictEqual(body, {"type":"object","required":["name"],"properties":{"name":{"type":"string"},"tag":{"type":"string"}}});
  });

});
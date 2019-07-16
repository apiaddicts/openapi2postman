const assert = require('assert');

describe('parser-body', () => {
  
  it('void request', () => {

    global.definition = require('../seeds/parserInitialGood.json');

    const body = require('../src/parser/body.js')('GET','/pets');
    assert.deepStrictEqual(body, undefined);
  });

  it('fill request', () => {

    global.definition = require('../seeds/parserInitialGood.json');

    const body = require('../src/parser/body.js')('POST','/pets');
    assert.deepStrictEqual(body, {"type":"object","required":["name"],"properties":{"name":{"type":"string"},"tag":{"type":"string"}}});
  });

  it('items, ref and allof response', () => {

    global.definition = require('../seeds/parserInitialGood.json');

    const body = require('../src/parser/body.js')('GET','/pets',true);
    assert.deepStrictEqual(body, {"200":{"type":"array","items":{"type":"object","required":["name","id"],"properties":{"name":{"type":"string"},"tag":{"type":"string"},"id":{"type":"integer","format":"int64"}}}},"500":{"type":"object","required":["code","message"],"properties":{"code":{"type":"integer","format":"int32"},"message":{"type":"string"}}}});
  });

  it('ref and allof response', () => {

    global.definition = require('../seeds/parserInitialGood.json');

    const body = require('../src/parser/body.js')('POST','/pets',true);
    assert.deepStrictEqual(body, {"200":{"type":"object","required":["name","id"],"properties":{"name":{"type":"string"},"tag":{"type":"string"},"id":{"type":"integer","format":"int64"}}},"500":{"type":"object","required":["code","message"],"properties":{"code":{"type":"integer","format":"int32"},"message":{"type":"string"}}}});
  });

  it('allof loop', () => {

    global.definition = require('../seeds/parserBodyAllofLoopInitial.json');

    const body = require('../src/parser/body.js')('POST','/apple');
    assert.deepStrictEqual(body, {"required":["red","orange"],"properties":{"red":{"type":"string","maxLength":50},"orange":{"type":"number","maxLength":9},"water":{"required":["paramAiden"],"properties":{"paramAiden":{"type":"string"},"paramBiden":{"type":"string"},"paramCiden":{"type":"string"}},"type":"object"}},"type":"object"});
  });

});
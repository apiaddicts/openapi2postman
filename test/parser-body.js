/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert')

describe('parser-body', () => {
  
  it('void request swagger2', () => {

    global.definition = require('../seeds/parserInitialGood.json')

    const body = require('../src/parser/swagger2/body.js')('GET','/pets')
    assert.deepStrictEqual(body, undefined)
  })

  it('void request openapi3', () => {

    global.definition = require('../seeds/parserInitialGoodOpenApi3.json')

    const body = require('../src/parser/openapi3/body.js')('GET','/pets')
    assert.deepStrictEqual(body, undefined)
  })

  it('void request openapi3 2', () => {

    global.definition = require('../seeds/parserInitialGoodOpenApi3.json')

    const body = require('../src/parser/openapi3/body.js')('POST','/pets')
    assert.deepStrictEqual(body, undefined)
  })

  it('fill request swagger2', () => {

    global.definition = require('../seeds/parserInitialGood.json')

    const body = require('../src/parser/swagger2/body.js')('POST','/pets')
    assert.deepStrictEqual(body, {"type":"object","required":["name"],"properties":{"name":{"type":"string"},"tag":{"type":"string"}}})
  })

  it('fill request openapi3', () => {

    global.definition = require('../seeds/parserInitialGoodOpenApi3Expanded.json')

    const body = require('../src/parser/openapi3/body.js')('POST','/pets')
    assert.deepStrictEqual(body, {"type":"object","required":["name"],"properties":{"name":{"type":"string"},"tag":{"type":"string"}}})
  })

  it('items, ref and allof response swagger2', () => {

    global.definition = require('../seeds/parserInitialGood.json')

    const body = require('../src/parser/swagger2/body.js')('GET','/pets',true)
    assert.deepStrictEqual(body, {"200":{"type":"array","items":{"type":"object","required":["name","id"],"properties":{"name":{"type":"string"},"tag":{"type":"string"},"id":{"type":"integer","format":"int64"}}}},"500":{"type":"object","required":["code","message"],"properties":{"code":{"type":"integer","format":"int32"},"message":{"type":"string"}}}})
  })

  it('items, ref and allof response openapi3', () => {

    global.definition = require('../seeds/parserInitialGoodOpenApi3Expanded.json')

    const body = require('../src/parser/openapi3/body.js')('GET','/pets',true)
    assert.deepStrictEqual(body, {"200":{"type":"array","items":{"type":"object","required":["name","id"],"properties":{"name":{"type":"string"},"tag":{"type":"string"},"id":{"type":"integer","format":"int64"}}}},"500":{"type":"object","required":["code","message"],"properties":{"code":{"type":"integer","format":"int32"},"message":{"type":"string"}}}})
  })

  it('ref and allof response swagger2', () => {

    global.definition = require('../seeds/parserInitialGood.json')
    global.circularTail = []

    const body = require('../src/parser/swagger2/body.js')('POST','/pets',true)
    assert.deepStrictEqual(body, {"200":{"type":"object","required":["name","id"],"properties":{"name":{"type":"string"},"tag":{"type":"string"},"id":{"type":"integer","format":"int64"}}},"500":{"type":"object","required":["code","message"],"properties":{"code":{"type":"integer","format":"int32"},"message":{"type":"string"}}}})
  })

  it('ref and allof response openapi3', () => {

    global.definition = require('../seeds/parserInitialGoodOpenApi3Expanded.json')
    global.circularTail = []

    const body = require('../src/parser/openapi3/body.js')('POST','/pets',true)
    assert.deepStrictEqual(body, {"200":{"type":"object","required":["name","id"],"properties":{"name":{"type":"string"},"tag":{"type":"string"},"id":{"type":"integer","format":"int64"}}},"500":{"type":"object","required":["code","message"],"properties":{"code":{"type":"integer","format":"int32"},"message":{"type":"string"}}}})
  })

  it('allof loop swagger2', () => {

    global.definition = require('../seeds/parserBodyAllofLoopInitial.json')

    const body = require('../src/parser/swagger2/body.js')('POST','/apple')
    assert.deepStrictEqual(body, {"required":["red","orange"],"properties":{"red":{"type":"string","maxLength":50},"orange":{"type":"number","maxLength":9},"water":{"required":["paramAiden"],"properties":{"paramAiden":{"type":"string"},"paramBiden":{"type":"string"},"paramCiden":{"type":"string"}},"type":"object"}},"type":"object"})
  })

  it('allof string swagger2', () => {

    global.definition = require('../seeds/parserBodyAllofString.json')

    const body = require('../src/parser/swagger2/body.js')('POST','/apple')
    assert.deepStrictEqual(body, {"type":"object","properties":{"red":{"type":"string","maxLength":50}}})
  })

})
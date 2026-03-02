/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert')

describe('parser-body', () => {

  it('body void request swagger2', () => {

    globalThis.definition = require('../seeds/parserInitialGood.json')

    const body = require('../src/parser/swagger2/body.js')('GET','/pets')
    assert.deepStrictEqual(body, undefined)
  })

  it('body void request openapi3.0', () => {

    globalThis.definition = require('../seeds/parserInitialGoodOpenApi3.json')

    const body = require('../src/parser/openapi3/body.js')('GET','/pets')
    assert.deepStrictEqual(body, undefined)
  })

  it('body void request openapi3.0 2', () => {

    globalThis.definition = require('../seeds/parserInitialGoodOpenApi3.json')

    const body = require('../src/parser/openapi3/body.js')('POST','/pets')
    assert.deepStrictEqual(body, undefined)
  })

  it('body void request openapi3.1', () => {

    globalThis.definition = require('../seeds/parserInitialGoodOpenApi3.1.json')

    const body = require('../src/parser/openapi3/body.js')('GET','/pets')
    assert.deepStrictEqual(body, undefined)
  })

  it('body fill request swagger2', () => {

    globalThis.definition = require('../seeds/parserInitialGood.json')

    const body = require('../src/parser/swagger2/body.js')('POST','/pets')
    assert.deepStrictEqual(body, {"type":"object","required":["name"],"properties":{"name":{"type":"string"},"tag":{"type":"string"}}})
  })

  it('body fill request openapi3.0', () => {

    globalThis.definition = require('../seeds/parserInitialGoodOpenApiExpanded3.json')

    const body = require('../src/parser/openapi3/body.js')('POST','/pets')
    assert.deepStrictEqual(body, {"type":"object","required":["name"],"properties":{"name":{"type":"string"},"tag":{"type":"string"}}})
  })

  it('body fill request openapi3.1', () => {

    globalThis.definition = require('../seeds/parserInitialGoodOpenApiExpanded3.1.json')

    const body = require('../src/parser/openapi3/body.js')('POST','/pets')
    assert.deepStrictEqual(body, {"type":"object","required":["name"],"properties":{"name":{"type":"string"},"tag":{"type":"string"}}})
  })

  it('body items, ref and allof response swagger2', () => {

    globalThis.definition = require('../seeds/parserInitialGood.json')

    const body = require('../src/parser/swagger2/body.js')('GET','/pets',true)
    assert.deepStrictEqual(body, {"200":{"type":"array","items":{"type":"object","required":["name","id"],"properties":{"name":{"type":"string"},"tag":{"type":"string"},"id":{"type":"integer","format":"int64"}}}},"500":{"type":"object","required":["code","message"],"properties":{"code":{"type":"integer","format":"int32"},"message":{"type":"string"}}}})
  })

  it('body items, ref and allof response openapi3.0', () => {

    globalThis.definition = require('../seeds/parserInitialGoodOpenApiExpanded3.json')

    const body = require('../src/parser/openapi3/body.js')('GET','/pets',true)
    assert.deepStrictEqual(body, {"200":{"type":"array","items":{"type":"object","required":["name","id"],"properties":{"name":{"type":"string"},"tag":{"type":"string"},"id":{"type":"integer","format":"int64"}}}},"500":{"type":"object","required":["code","message"],"properties":{"code":{"type":"integer","format":"int32"},"message":{"type":"string"}}}})
  })

  it('body items, ref and allof response openapi3.1', () => {

    globalThis.definition = require('../seeds/parserInitialGoodOpenApiExpanded3.1.json')

    const body = require('../src/parser/openapi3/body.js')('GET','/pets',true)
    assert.deepStrictEqual(body, {"200":{"type":"array","items":{"type":"object","required":["name","id"],"properties":{"name":{"type":"string"},"tag":{"type":"string"},"id":{"type":"integer","format":"int64"}}}},"500":{"type":"object","required":["code","message"],"properties":{"code":{"type":"integer","format":"int32"},"message":{"type":"string"}}}})
  })

  it('body ref and allof response swagger2', () => {

    globalThis.definition = require('../seeds/parserInitialGood.json')
    globalThis.circularTail = []

    const body = require('../src/parser/swagger2/body.js')('POST','/pets',true)
    assert.deepStrictEqual(body, {"200":{"type":"object","required":["name","id"],"properties":{"name":{"type":"string"},"tag":{"type":"string"},"id":{"type":"integer","format":"int64"}}},"500":{"type":"object","required":["code","message"],"properties":{"code":{"type":"integer","format":"int32"},"message":{"type":"string"}}}})
  })

  it('body ref and allof response openapi3.0', () => {

    globalThis.definition = require('../seeds/parserInitialGoodOpenApiExpanded3.json')
    globalThis.circularTail = []

    const body = require('../src/parser/openapi3/body.js')('POST','/pets',true)
    assert.deepStrictEqual(body, {"200":{"type":"object","required":["name","id"],"properties":{"name":{"type":"string"},"tag":{"type":"string"},"id":{"type":"integer","format":"int64"}}},"500":{"type":"object","required":["code","message"],"properties":{"code":{"type":"integer","format":"int32"},"message":{"type":"string"}}}})
  })

  it('body ref and allof response openapi3.1', () => {

    globalThis.definition = require('../seeds/parserInitialGoodOpenApiExpanded3.1.json')
    globalThis.circularTail = []

    const body = require('../src/parser/openapi3/body.js')('POST','/pets',true)
    assert.deepStrictEqual(body, {"200":{"type":"object","required":["name","id"],"properties":{"name":{"type":"string"},"tag":{"type":"string"},"id":{"type":"integer","format":"int64"}}},"500":{"type":"object","required":["code","message"],"properties":{"code":{"type":"integer","format":"int32"},"message":{"type":"string"}}}})
  })

  it('body allof loop swagger2', () => {

    globalThis.definition = require('../seeds/parserBodyAllofLoopInitial.json')

    const body = require('../src/parser/swagger2/body.js')('POST','/apple')
    assert.deepStrictEqual(body, {"required":["red","orange"],"properties":{"red":{"type":"string","maxLength":50},"orange":{"type":"number","maxLength":9},"water":{"required":["paramAiden"],"properties":{"paramAiden":{"type":"string"},"paramBiden":{"type":"string"},"paramCiden":{"type":"string"}},"type":"object"}},"type":"object"})
  })

  it('body allof string swagger2', () => {

    globalThis.definition = require('../seeds/parserBodyAllofString.json')

    const body = require('../src/parser/swagger2/body.js')('POST','/apple')
    assert.deepStrictEqual(body, {"type":"object","properties":{"red":{"type":"string","maxLength":50}}})
  })

})
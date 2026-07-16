/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('node:assert');

const validateSchema = require('../src/generator/validateSchema.js');

const AJV_ACTIVE = [
  'var Ajv = require("ajv");',
  'const ajv = new Ajv();',
  '});'
];

const AJV_DISABLED = [
  '/*var Ajv = require("ajv");',
  'const ajv = new Ajv();',
  '});*/'
];

function buildCollection(urlPath) {
  return [
    {
      item: [
        {
          item: [
            {
              request: {
                url: {
                  path: [urlPath]
                }
              },
              event: [
                {
                  script: {
                    exec: [
                      'var Ajv = require("ajv");',
                      'const ajv = new Ajv();',
                      '});'
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

function execOf(collection) {
  return collection[0].item[0].item[0].event[0].script.exec
}

function withCapturedWarnings(fn) {
  const originalWarn = console.warn
  const calls = []
  console.warn = (...args) => calls.push(args)
  try {
    fn()
  } finally {
    console.warn = originalWarn
  }
  return calls
}

describe('generator-validateSchema', () => {

  // Recognized as true/false without any warning: real booleans plus the
  // "true"/"false" strings (case-insensitive, trimmed) that motivated the fix.
  const silentCases = [
    { label: 'boolean true', value: true, expected: AJV_ACTIVE },
    { label: 'boolean false', value: false, expected: AJV_DISABLED },
    { label: 'undefined (not configured)', value: undefined, expected: AJV_DISABLED },
    { label: 'null', value: null, expected: AJV_DISABLED },
    { label: 'string "true"', value: 'true', expected: AJV_ACTIVE },
    { label: 'string "TRUE" (uppercase)', value: 'TRUE', expected: AJV_ACTIVE },
    { label: 'string " true " (whitespace)', value: ' true ', expected: AJV_ACTIVE },
    { label: 'string "false"', value: 'false', expected: AJV_DISABLED },
    { label: 'string "FALSE" (uppercase)', value: 'FALSE', expected: AJV_DISABLED },
    { label: 'string " false " (whitespace)', value: ' false ', expected: AJV_DISABLED },
  ];

  // Anything else is not recognized: schema validation is disabled (safe
  // default, same as the original behavior) but a warning is logged so it's
  // no longer silent.
  const unrecognizedCases = [
    { label: 'string "1"', value: '1' },
    { label: 'string "0"', value: '0' },
    { label: 'number 1', value: 1 },
    { label: 'number 0', value: 0 },
    { label: 'number 2', value: 2 },
    { label: 'empty string ""', value: '' },
    { label: 'unrecognized string "yes"', value: 'yes' },
    { label: 'unrecognized string "enabled"', value: 'enabled' },
    { label: 'object {}', value: {} },
    { label: 'array []', value: [] },
  ];

  silentCases.forEach(({ label, value, expected }) => {
    const activeOrDisabled = expected === AJV_ACTIVE ? 'active' : 'disabled';
    it(`keeps AJV validation ${activeOrDisabled} and does not warn when validate_schema is ${label}`, () => {
      const collection = buildCollection('users')
      const calls = withCapturedWarnings(() => validateSchema(collection, value))
      assert.deepStrictEqual(execOf(collection), expected);
      assert.strictEqual(calls.length, 0);
    });
  });

  unrecognizedCases.forEach(({ label, value }) => {
    it(`disables AJV validation and warns when validate_schema is ${label}`, () => {
      const collection = buildCollection('users')
      const calls = withCapturedWarnings(() => validateSchema(collection, value))
      assert.deepStrictEqual(execOf(collection), AJV_DISABLED);
      assert.strictEqual(calls.length, 1);
      assert.ok(calls[0].some((arg) => typeof arg === 'string' && arg.includes('not recognized')));
    });
  });

  it('comments out AJV validation when the request uses $select/$exclude, even with validate_schema true', () => {
    const collection = buildCollection('users?$select=id')
    validateSchema(collection, true)
    assert.deepStrictEqual(execOf(collection), AJV_DISABLED);
  });

  it('handles multiple requests across nested folders consistently', () => {
    const collection = [
      {
        item: [
          {
            item: [
              {
                request: { url: { path: ['a'] } },
                event: [{ script: { exec: ['var Ajv = require("ajv");', '});'] } }]
              },
              {
                request: { url: { path: ['b?$select=x'] } },
                event: [{ script: { exec: ['var Ajv = require("ajv");', '});'] } }]
              }
            ]
          },
          {
            item: [
              {
                request: { url: { path: ['c'] } },
                event: [{ script: { exec: ['var Ajv = require("ajv");', '});'] } }]
              }
            ]
          }
        ]
      }
    ]
    validateSchema(collection, 'true')
    assert.deepStrictEqual(collection[0].item[0].item[0].event[0].script.exec, ['var Ajv = require("ajv");', '});']);
    assert.deepStrictEqual(collection[0].item[0].item[1].event[0].script.exec, ['/*var Ajv = require("ajv");', '});*/']);
    assert.deepStrictEqual(collection[0].item[1].item[0].event[0].script.exec, ['var Ajv = require("ajv");', '});']);
  });

});

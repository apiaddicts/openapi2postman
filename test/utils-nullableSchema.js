/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('node:assert');

const applyNullableTypes = require('../src/utils/nullableSchema.js');

describe('utils-nullableSchema', () => {

  it('turns a nullable scalar type into a type list including null', () => {
    const schema = applyNullableTypes({ type: 'string', nullable: true, maxLength: 70 });

    assert.deepStrictEqual(schema, { type: ['string', 'null'], nullable: true, maxLength: 70 });
  });

  it('accepts the swagger2 x-nullable extension', () => {
    const schema = applyNullableTypes({ type: 'integer', 'x-nullable': true });

    assert.deepStrictEqual(schema, { type: ['integer', 'null'], 'x-nullable': true });
  });

  it('adds null to an existing type list only once', () => {
    const schema = applyNullableTypes({ type: ['string', 'null'], nullable: true });

    assert.deepStrictEqual(schema, { type: ['string', 'null'], nullable: true });
  });

  it('adds null to the allowed values of a nullable enum', () => {
    const schema = applyNullableTypes({ type: 'string', nullable: true, enum: ['ALTA', 'BAJA'] });

    assert.deepStrictEqual(schema, { type: ['string', 'null'], nullable: true, enum: ['ALTA', 'BAJA', null] });
  });

  it('adds a null alternative when a nullable node has no type but delegates to oneOf', () => {
    const schema = applyNullableTypes({ nullable: true, oneOf: [{ type: 'string' }] });

    assert.deepStrictEqual(schema, { nullable: true, oneOf: [{ type: 'string' }, { type: 'null' }] });
  });

  it('leaves a nullable node without type or alternatives untouched', () => {
    const schema = applyNullableTypes({ nullable: true, description: 'anything goes' });

    assert.deepStrictEqual(schema, { nullable: true, description: 'anything goes' });
  });

  it('leaves nodes that are not nullable untouched', () => {
    const schema = applyNullableTypes({ type: 'string', enum: ['ALTA'] });

    assert.deepStrictEqual(schema, { type: 'string', enum: ['ALTA'] });
  });

  it('reaches nullable nodes nested in properties, items and additionalProperties', () => {
    const schema = applyNullableTypes({
      type: 'object',
      properties: {
        telefonos: { type: 'array', items: { type: 'string', nullable: true } },
        extras: { type: 'object', additionalProperties: { type: 'boolean', nullable: true } }
      }
    });

    assert.deepStrictEqual(schema, {
      type: 'object',
      properties: {
        telefonos: { type: 'array', items: { type: ['string', 'null'], nullable: true } },
        extras: { type: 'object', additionalProperties: { type: ['boolean', 'null'], nullable: true } }
      }
    });
  });

  it('does not loop forever on a self referencing schema', () => {
    const schema = { type: 'object', properties: { hijo: { type: 'object', nullable: true } } };
    schema.properties.hijo.properties = { padre: schema };

    applyNullableTypes(schema);

    assert.deepStrictEqual(schema.properties.hijo.type, ['object', 'null']);
  });

});

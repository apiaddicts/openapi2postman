/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

const NULL_TYPE = 'null';

module.exports = function() {

  return function applyNullableTypes(schema) {
    walk(schema, new WeakSet());
    return schema;
  }

  function walk(schema, seen) {
    if (!_.isObject(schema) || seen.has(schema)) return;
    seen.add(schema);

    if (Array.isArray(schema)) {
      schema.forEach(item => walk(item, seen));
      return;
    }

    if (isNullable(schema)) allowNull(schema);

    _.forEach(schema.properties, property => walk(property, seen));
    walk(schema.items, seen);
    walk(schema.additionalProperties, seen);
    walk(schema.oneOf, seen);
    walk(schema.anyOf, seen);
    walk(schema.allOf, seen);
  }

  function isNullable(schema) {
    return schema.nullable === true || schema['x-nullable'] === true;
  }

  function allowNull(schema) {
    if (Array.isArray(schema.enum) && !schema.enum.includes(null)) {
      schema.enum.push(null);
    }

    if (Array.isArray(schema.type)) {
      if (!schema.type.includes(NULL_TYPE)) schema.type.push(NULL_TYPE);
      return;
    }

    if (typeof schema.type === 'string') {
      if (schema.type !== NULL_TYPE) schema.type = [schema.type, NULL_TYPE];
      return;
    }

    const alternatives = Array.isArray(schema.oneOf) ? schema.oneOf : schema.anyOf;
    if (Array.isArray(alternatives) && !alternatives.some(alternative => alternative?.type === NULL_TYPE)) {
      alternatives.push({ type: NULL_TYPE });
    }
  }

}()

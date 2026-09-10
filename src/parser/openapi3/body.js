/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash')
const checkCircularReferences = require('../../utils/circularRef.js');
const applyNullableTypes = require('../../utils/nullableSchema.js');

const STREAMING_CONTENT_TYPES = [
  'application/jsonl',
  'application/ndjson',
  'application/x-ndjson',
  'text/event-stream',
  'multipart/mixed',
]

module.exports = function () {

  const MAX_DEPTH_LEVEL = 20;
  let seenSchemas = new WeakSet();

  return function get(verb, path, bodyResponse) {
    seenSchemas = new WeakSet();

    const hasPaths = _.isObject(globalThis.definition.paths);
    const hasWebhooks = _.isObject(globalThis.definition.webhooks);

    if (!hasPaths) {
      if (hasWebhooks) return bodyResponse ? {} : undefined;
      require('../../utils/error.js')('paths is required');
    }
    const endpoint = globalThis.definition.paths[path][_.toLower(verb)]
    if (!endpoint) return undefined;

    if (!bodyResponse) {
      let body = endpoint['requestBody'];
      if (!body) return undefined;

      if (body['$ref']) {
        let componentType = body['$ref'].split('/')[2]
        const ref = _.replace(body['$ref'], '#/components/' + componentType + '/', '')
        body = globalThis.definition.components[componentType][ref]
      }
      if (!body.content['application/json']) {
        const contentsArray = Object.keys(body.content);
        let schema;
        let properContent = false;
        let index = 0;
        while (!properContent && index < contentsArray.length) {
          const mediaType = body.content[contentsArray[index]];

          const effectiveSchema = mediaType.schema || mediaType.itemSchema;

          if (!effectiveSchema) {
            if (contentsArray[index] === 'application/octet-stream') {
              return {
                type: 'string',
                format: 'binary'
              };
            }
            index++;
            continue;
          }

          const withoutRefs = replaceRefs(effectiveSchema, 1);
          switch (contentsArray[index]) {
            case 'application/x-www-form-urlencoded':
              schema = replaceAllOfs(withoutRefs);
              properContent = true;
              break;
            case 'multipart/form-data':
              schema = replaceAllOfs(body.content[contentsArray[index]].schema || body.content[contentsArray[index]].itemSchema);
              properContent = true;
              break;
            default:
              properContent = false;
              break;
          }
          index++;
        }

        if (!properContent && contentsArray.length > 0) {
          const firstContentType = contentsArray[0];
          const mediaType = body.content[firstContentType];
          const effectiveSchema = mediaType?.schema || mediaType?.itemSchema;

          if (effectiveSchema) {
            const withoutRefs = replaceRefs(effectiveSchema, 1);
            return replaceAllOfs(withoutRefs);
          }
        }

        if (!properContent) console.warn('\x1b[33m%s\x1b[0m', `Warning: cannot create body due to unknown content type (Endpoint: ${verb} ${path})`);
        return schema;
      }
      const withOutRefs = replaceRefs(body.content['application/json'].schema, 1);
      return replaceAllOfs(withOutRefs);
    }
    const bodyResponses = {}
    _.forEach(endpoint['responses'], function (response, status) {
      let schema = null

      if (response?.content?.['application/json']?.schema) {
        schema = response.content['application/json'].schema
      } else if (response?.content) {
        for (const streamType of STREAMING_CONTENT_TYPES) {
          const mt = response.content[streamType]
          if (mt) {
            schema = mt.schema || mt.itemSchema
            if (schema) break
          }
        }
      }

      if (schema) {
        const withOutRefs = replaceRefs(schema, 1)
        bodyResponses[status] = applyNullableTypes(replaceAllOfs(withOutRefs, true))
        if (bodyResponses[status].hasOwnProperty('required')) {
          const requiredWtihoutDuplicates = bodyResponses[status].required.filter((value, index, arr) => {
            return arr.indexOf(value) === index;
          });
          bodyResponses[status].required = requiredWtihoutDuplicates;
        }
      }
    })
    return bodyResponses
  }

  function replaceRefs(schema, depthLevel) {
    if (!_.isObject(schema)) {
      return schema;
    }
    let result = {}
    if (depthLevel < MAX_DEPTH_LEVEL) {
      for (const i in schema) {
        if (i === '$ref') {
          let componentType = schema[i].split('/')[2]
          const ref = _.replace(schema[i], '#/components/' + componentType + '/', '')
          if (checkCircularReferences(ref, 3, 2) || checkCircularReferences(ref, 3, 3) || checkCircularReferences(ref, 3, 4)) {
            return {
              type: 'string',
              description: 'Circular REF solved swagger2postman'
            }
          }

          let entity = globalThis.definition.components[componentType][ref]
          if (!entity) {
            require('../../utils/error.js')('ref ' + ref + ' is not defined')
          }

          entity = replaceRefs(entity, depthLevel + 1);
          result = _.merge({}, result, entity)
        } else if (Array.isArray(schema[i]) && i !== 'required') {
          const arrayResult = []
          if (i === 'example' || i === 'examples') {
            result[i] = schema[i];
            continue;
          }
          for (const k in schema[i]) {
            arrayResult.push(replaceRefs(schema[i][k], depthLevel + 1))
          }
          result[i] = arrayResult
        } else if (_.isObject(schema[i]) && i !== 'required') {
          result[i] = replaceRefs(schema[i], depthLevel + 1);
        } else {
          result[i] = schema[i];
        }
      }
    }
    return result
  }

  function replaceAllOfs(schema, keepTypeList) {
    if (!_.isObject(schema)) return schema;

    if (seenSchemas.has(schema)) {
      return {
        type: "string",
        description: "Circular schema avoided"
      };
    }
    seenSchemas.add(schema);

    let result = {}
    resolveTypeKeyword(schema, result, keepTypeList)

    for (let i in schema) {
      result = copyKeyword(schema, result, i, keepTypeList)
    }

    if (typeof result.exclusiveMinimum === 'number') {
      result.minimum = result.exclusiveMinimum;
      result.exclusiveMinimum = true;
    }
    if (typeof result.exclusiveMaximum === 'number') {
      result.maximum = result.exclusiveMaximum;
      result.exclusiveMaximum = true;
    }
    if (schema.contentEncoding) {
      result.contentEncoding = schema.contentEncoding;
    }
    if (schema.contentMediaType) {
      result.contentMediaType = schema.contentMediaType;
    }
    return result
  }

  function resolveTypeKeyword(schema, result, keepTypeList) {
    if (!Array.isArray(schema.type)) return;

    if (keepTypeList) {
      result.type = [...schema.type];
      return;
    }
    const nonNullType = schema.type.find(t => t !== 'null');
    result.type = nonNullType || schema.type[0];
  }

  function copyKeyword(schema, result, key, keepTypeList) {
    if (key === 'type' && Array.isArray(schema.type)) return result;

    if (key === 'allOf' && Array.isArray(schema[key])) {
      return _.merge({}, result, mergeAllOf(schema, keepTypeList))
    }
    if (Array.isArray(schema[key]) && key !== 'required') {
      result[key] = copyArray(schema[key], keepTypeList)
      return result;
    }
    if (_.isObject(schema[key]) && key !== 'required') {
      const value = replaceAllOfs(schema[key], keepTypeList);
      const fusionable = _.isPlainObject(value) && _.isPlainObject(result[key]);
      result[key] = fusionable ? _.merge({}, result[key], value) : value;
      return result;
    }
    result[key] = schema[key]
    return result;
  }

  function copyArray(values, keepTypeList) {
    if (values.every(v => !_.isObject(v))) return [...values];
    return values.map(item => replaceAllOfs(item, keepTypeList));
  }

  function mergeAllOf(schema, keepTypeList) {
    let merged = { 'required': [], 'properties': {}, 'type': 'object' }

    for (let t in schema['allOf']) {
      const member = schema['allOf'][t]

      if (member['type'] === 'string') {
        merged = member
        continue
      }
      for (let k in member) {
        mergeAllOfKeyword(merged, member, k, schema, keepTypeList)
      }
    }
    return merged
  }

  function mergeAllOfKeyword(merged, member, key, schema, keepTypeList) {
    switch (key) {
      case 'type':
        merged['type'] = member[key]
        break
      case 'required':
        merged['required'] = [].concat(merged['required'], member['required'])
        break
      case 'properties':
        for (let z in member['properties']) {
          merged['properties'][z] = replaceAllOfs(member['properties'][z], keepTypeList)
        }
        break
      case 'allOf': {
        let downSchema = replaceAllOfs(schema['allOf'], keepTypeList)
        if (downSchema['0']) {
          downSchema = downSchema['0']
        }
        merged['required'] = [].concat(merged['required'], downSchema['required'])
        merged['properties'] = _.merge(merged['properties'], downSchema['properties'])
        break
      }
      case 'nullable':
        if (member[key] === true) merged['nullable'] = true
        break
      case 'description':
      case 'items':
        break
      default:
        console.warn('the property ' + key + ' of allOf is not implemented')
    }
  }

}()

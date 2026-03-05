/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash')
const checkCircularReferences = require('../../utils/circularRef.js');

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

          if (!mediaType.schema) {
            if (contentsArray[index] === 'application/octet-stream') {
              return {
                type: 'string',
                format: 'binary'
              };
            }
            continue;
          }

          const withoutRefs = replaceRefs(mediaType.schema, 1);
          switch (contentsArray[index]) {
            case 'application/x-www-form-urlencoded':
              schema = replaceAllOfs(withoutRefs);
              properContent = true;
              break;
            case 'multipart/form-data':
              schema = replaceAllOfs(body.content[contentsArray[index]].schema);
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

          if (mediaType?.schema) {
            const withoutRefs = replaceRefs(mediaType.schema, 1);
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
      if (response?.content?.['application/json']?.schema) {
        const withOutRefs = replaceRefs(response.content['application/json'].schema, 1)
        bodyResponses[status] = replaceAllOfs(withOutRefs)
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
        } else if (_.isArray(schema[i]) && i !== 'required') {
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

  function replaceAllOfs(schema) {
    if (!_.isObject(schema)) return schema;

    if (seenSchemas.has(schema)) {
      return {
        type: "string",
        description: "Circular schema avoided"
      };
    }
    seenSchemas.add(schema);

    let result = {}

    if (Array.isArray(schema.type)) {
      const nonNullType = schema.type.find(t => t !== 'null');
      result.type = nonNullType || schema.type[0];
    }

    for (let i in schema) {
      if (i === 'type' && Array.isArray(schema.type)) {
        continue;
      }
      if (i === 'allOf' && _.isArray(schema[i])) {
        let merged = { 'required': [], 'properties': {}, 'type': 'object' }
        for (let t in schema[i]) {

          if (schema[i][t]['type'] === 'string') {
            merged = schema[i][t]
          } else {

            for (let k in schema[i][t]) {
              if (k === 'type') {
                merged['type'] = schema[i][t][k]
              } else if (k === 'required') {
                merged['required'] = _.concat(merged['required'], schema[i][t]['required'])
              } else if (k === 'properties') {
                for (let z in schema[i][t]['properties']) {
                  merged['properties'][z] = replaceAllOfs(schema[i][t]['properties'][z])
                }
              } else if (k === 'allOf') {
                let downSchema = replaceAllOfs(schema[k])
                if (downSchema['0']) {
                  downSchema = downSchema['0']
                }
                merged['required'] = _.concat(merged['required'], downSchema['required'])
                merged['properties'] = _.merge(merged['properties'], downSchema['properties'])
                continue
              } else if (k === 'description') {
                continue
              } else if (k === 'items') {
                continue
              } else {
                console.warn('the property ' + k + ' of allOf is not implemented')
              }
            }

          }

        }
        result = _.merge({}, result, merged)
      } else if (_.isArray(schema[i]) && i !== 'required') {
        if (schema[i].every(v => !_.isObject(v))) {
          result[i] = [...schema[i]];
        } else {
          result[i] = schema[i].map(item => replaceAllOfs(item));
        }
      } else if (_.isObject(schema[i]) && i !== 'required') {
        const value = replaceAllOfs(schema[i]);

        if (_.isPlainObject(value) && _.isPlainObject(result[i])) {
          result[i] = _.merge({}, result[i], value);
        } else {
          result[i] = value;
        }
      } else {
        result[i] = schema[i]
      }
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

}()
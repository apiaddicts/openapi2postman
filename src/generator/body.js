/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {

  return function get(postmanRequest,withoutRequired,withWrongParam){
    postmanRequest = _.cloneDeep(postmanRequest);
    if (!postmanRequest.aux.body){
      return postmanRequest;
    }

    const urlWithoutParams = postmanRequest.request.url.path[0].split('?');
    if (postmanRequest.aux.suffix !== undefined && urlWithoutParams[1] !== undefined) {
      
      _.forEach(postmanRequest.aux.queryParams, function (value) {
        if (value.required !== true) {
          urlWithoutParams[1] = _.replace(urlWithoutParams[1], value.name + '={{' + value.name + '}}', '');
          urlWithoutParams[1] = urlWithoutParams[1].length <= 1 
            ? _.replace(urlWithoutParams[1], urlWithoutParams[1], '') 
            : urlWithoutParams[1].replace(/&+/g, '&').replace(/^(\?&+)/, '?'); 
        }
        urlWithoutParams[1] = urlWithoutParams[1].replace(/&$/, '');
      })
    }
    if (urlWithoutParams[1] === undefined) {
      urlWithoutParams[1] = '';
    }
    postmanRequest.request.url.path[0] = urlWithoutParams[0] + urlWithoutParams[1];

    let parent;
    if (withoutRequired){
      parent = 'without';
    } else if (withWrongParam){
      parent = 'with';
    } 

    global.prefix =  ''
    global.wrongParamsCatch = withWrongParam;
    global.requiredParamsCatch = withoutRequired;

    const body = require('../swagger2json/index.js')(postmanRequest.aux.body,'',parent);
    let requestBody = {
      mode: "raw",
      raw: JSON.stringify(body, null, 4)
    };
    const contentType = postmanRequest.request.header.find(h => h.key === 'Content-Type');
    const consumes = contentType ? contentType.value : 'application/json';

    if (consumes.includes('x-www-form-urlencoded')) {
      requestBody.mode = 'urlencoded';
      requestBody.urlencoded = [];

      Object.keys(body).forEach(key => {
        let item = {
          type: 'text'
        };
        item.key = key;

        if (typeof body[key] === 'object') {
          item.value = JSON.stringify(body[key]);
        } else {
          item.value = body[key];
        }
        requestBody.urlencoded.push(item);
      });
      delete requestBody.raw;
    } else if (consumes.includes('multipart/form-data')) {
      requestBody.mode = 'formdata';
      requestBody.formdata = [];

      Object.keys(body).forEach(key => {
        let item = {
          type: 'file'
        };
        item.key = key;

        if (typeof body[key] === 'object') {
          item.value = JSON.stringify(body[key]);
        } else {
          item.value = '';
        }
        requestBody.formdata.push(item);
      });
      delete requestBody.raw;
    }

    postmanRequest.request.body = requestBody;

    return postmanRequest;
  };

}()
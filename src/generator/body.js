/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(postmanRequest,withoutRequired,withWrongParam){
  	postmanRequest = _.cloneDeep(postmanRequest);
    if (!postmanRequest.aux.body){
  		return postmanRequest;
    }

    let parent;
    if (withoutRequired){
      parent = 'without';
    } else if (withWrongParam){
      parent = 'with';
    } 

    global.prefix =  ''
    global.wrongParamsCatch = withWrongParam;
    global.requiredParamsCatch = withoutRequired;

  	postmanRequest.request.body = {
		mode: "raw",
		raw: JSON.stringify(require('../swagger2json/index.js')(postmanRequest.aux.body,'',parent), null, 4)
	};
  	return postmanRequest;
  };

}()
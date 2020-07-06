/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(verb,path){
  	if (!_.isObject(global.definition.paths)) {
		require('../../utils/error.js')('paths is required')
	}

	const responses = global.definition.paths[path][_.toLower(verb)]['responses']
	const keys = _.keys(responses)
	for (let i in keys) {
		keys[i] = _.toInteger(keys[i])
		if (keys[i] < 200) {
			keys[i] = 500
		}
	}
	return keys
  }

}()
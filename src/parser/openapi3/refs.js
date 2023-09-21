/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

function eachRecursive(obj) {
	for (var k in obj) {
		if (typeof obj[k] == "object" && obj[k] !== null) {
			eachRecursive(obj[k]);
		} else {
			if (k == '$ref') {
				let property = obj[k]
				property = property.replace('#/', '')
				let propertiesArray = property.split('/')
				let refObject = findObject(global.definition, propertiesArray)
				// Clear ref property
				delete obj[k]
				// Assign properties refOcject
				Object.assign(obj, refObject)
			}
		}
	}
}

function findObject(obj, propertiesArray) {
	if(propertiesArray.length < 1) {
		return obj
	}

	let property = propertiesArray.shift()
	return findObject(obj[property], propertiesArray)
}

module.exports = function() {
	return function get() {
		eachRecursive(global.definition)
		return global.definition
	}
}()
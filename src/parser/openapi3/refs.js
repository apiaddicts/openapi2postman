/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

function eachRecursive(obj) {
	for (let k in obj) {
		if (typeof obj[k] == "object" && obj[k] !== null) {
			eachRecursive(obj[k]);
		} else if (k == '$ref') {
			let property = obj[k]
			property = property.replace('#/', '')
			let propertiesArray = property.split('/')
			let refObject = findObject(globalThis.definition, propertiesArray)
			delete obj[k]
			Object.assign(obj, refObject)
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
		eachRecursive(globalThis.definition)
		return globalThis.definition
	}
}()
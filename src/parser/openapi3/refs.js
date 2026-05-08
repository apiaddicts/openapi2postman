/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

function eachRecursive(obj) {
	for (let k in obj) {
		if (typeof obj[k] == "object" && obj[k] !== null) {
			eachRecursive(obj[k]);
		} else if (k == '$ref') {
			const siblings = {}
			for (const sib of Object.keys(obj)) {
				if (sib !== '$ref') {
					siblings[sib] = obj[sib]
				}
			}
			let property = obj[k]
			property = property.replace('#/', '')
			let propertiesArray = property.split('/')
			let refObject = findObject(globalThis.definition, propertiesArray)
			delete obj[k]
			Object.assign(obj, refObject, siblings)
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

function liftAdditionalOperations() {
	if (!globalThis.definition.paths) return
	for (const path in globalThis.definition.paths) {
		const pathItem = globalThis.definition.paths[path]
		if (pathItem && typeof pathItem.additionalOperations === 'object' && pathItem.additionalOperations !== null) {
			for (const method in pathItem.additionalOperations) {
				pathItem[method.toLowerCase()] = pathItem.additionalOperations[method]
			}
			delete pathItem.additionalOperations
		}
	}
}

module.exports = function() {
	return function get() {
		eachRecursive(globalThis.definition)
		liftAdditionalOperations()
		return globalThis.definition
	}
}()
/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const createRefsModule = require('../refs')

function collectSiblings(obj) {
	const siblings = {}
	for (const sib of Object.keys(obj)) {
		if (sib !== '$ref') siblings[sib] = obj[sib]
	}
	return siblings
}

const resolveRefs = createRefsModule({ prepareSiblings: collectSiblings })

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
	return async function get() {
		await resolveRefs(globalThis.definition, globalThis.definition)
		liftAdditionalOperations()
		return globalThis.definition
	}
}()

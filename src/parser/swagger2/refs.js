/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const createRefsModule = require('../refs')

const resolveRefs = createRefsModule()

module.exports = function() {
	return async function get() {
		await resolveRefs(globalThis.definition, globalThis.definition)
		return globalThis.definition
	}
}()

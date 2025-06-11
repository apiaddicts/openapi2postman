/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');
const fs   = require('fs');

module.exports = function() {
  
  return function get(postmanRequest, configurationFile) {
		
		if ((!postmanRequest.aux.bodyResponse || !postmanRequest.aux.bodyResponse[postmanRequest.aux.status]) && postmanRequest.aux.status === 200) {
			console.warn(
				'\x1b[33m%s\x1b[0m',
				`Test: ${postmanRequest.request.method} ${postmanRequest.name} (${postmanRequest.aux.suffix === undefined ? 'main test' : postmanRequest.aux.suffix.trim()}) without schema validation test because it has a different response than 'application/json'`
				);
			return postmanRequest;
		} 
		let schemaJSON;

		if (configurationFile.schema_is_inline === false) {
			schemaJSON = 'pm.environment.get("schemaTest")';
		} else {
			schemaJSON = configurationFile.schema_pretty_print === true
			? JSON.stringify(postmanRequest.aux.bodyResponse[postmanRequest.aux.status], null, 4) 
			: JSON.stringify(postmanRequest.aux.bodyResponse[postmanRequest.aux.status]);
		}
		postmanRequest.event[0].script.exec = _.concat(postmanRequest.event[0].script.exec,[
			"",
			"var json = null;",
			"",
			"try {",
			"	json = pm.response.json();",
			"	// Guardar variables en environment",
			"	// pm.environment.set('nombreVariable', json.data.variable);",
			"} catch (e) {",
			"	pm.test(\"A JSON response was expected\", function() {",
			"		pm.expect(json, \"responseBody no es un JSON\").not.to.be.null;",
			"	});",
			"}",
			"",
			"var schema = "+schemaJSON+";",
			"",
			"var Ajv = require(\"ajv\");",
			"var ajv = new Ajv({ logger: console, allErrors: false, unknownFormats: ['int32', 'int64', 'float', 'double', 'password'] });",
			"var validate = ajv.compile(schema);",
			"var valid = validate(json);",
			"pm.test(\"Schema is valid according to AJV\", function () {",
			"	pm.expect(valid, JSON.stringify(validate.errors, null, 2)).to.be.true;",
			"});"
		]);
		return postmanRequest;
};

}()
/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(postmanRequest){
  	if (!postmanRequest.aux.bodyResponse || !postmanRequest.aux.bodyResponse[postmanRequest.aux.status]){
  		return postmanRequest;
  	}
  	postmanRequest.event[0].script.exec = _.concat(postmanRequest.event[0].script.exec,[
		"",
		"var json = null;",
		"",
		"try {",
		"	json = JSON.parse(responseBody);",
		"} catch (e) {",
		"	postMessage.test(\"Se esperaba una respuesta JSON\", function() {",
		"		pm.expect(json, \"responseBody no es un JSON\").not.to.be.null;",
		"	});",
		"}",
		"",
		"function guardarVariableBody(nombreVariable, rutaResponse) {",
		"    try {",
		"        var json = pm.response.json();",
		"        let levels = rutaResponse.split('.');",
		"        let valor = json;",
		"        for (let i = 0; i < levels.length; i++) {",
		"            valor = valor[levels[i]];",
		"        }",
		"        pm.environment.set(nombreVariable, valor);",
		"        console.log(`Guardada variable ${nombreVariable} = ${valor}`);",
		"    } catch (e) {",
		"        console.log(`ERROR guardando variable ${rutaResponse} \\n${e}`);",
		"    }",
		"}",
		"",
		"var schema = "+JSON.stringify(postmanRequest.aux.bodyResponse[postmanRequest.aux.status])+";",
		"",
		"pm.test('Schema is valid', function() {",
		"	pm.expect(tv4.validate(json, schema)).to.be.true;",
		"});"
	]);
  	return postmanRequest;
  };

}()
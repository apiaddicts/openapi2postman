/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {

    return function get(collection){
			const items = []
			const itemKeys = []
			for (let i in collection){
				for (let j in collection[i].item) {
					if (collection[i].item[j].request) {
						parseRequest(collection[i].item[j].aux.numerateItem,collection[i].item[j].request,items,itemKeys,'')
					} else {
						for (let k in collection[i].item[j].item) {
							let id = collection[i].item[j].item[k].request.method + collection[i].item[j].item[k].request.url.path[0]
							id = id.replace(/{{/g,'{').replace(/}}/g,'}').split('?')[0]
							parseRequest(collection[i].item[j].item[k].aux.numerateItem, collection[i].item[j].item[k].request, items, itemKeys, id, collection[i].item[j].item[k].aux.queryParams)
							
							if (collection[i].item[j].item[k].event[0].script.exec, collection[i].item[j].item[k].aux.numerateItem, items) {
								extractVariablesFromTest(
									collection[i].item[j].item[k].aux,
									collection[i].item[j].item[k].event[0].script.exec,
									collection[i].item[j].item[k].aux.numerateItem,
									items
									);
							}
						}
					}
				}
			}
			return items
    }

	function parseRequest(numerateItem, request, items, itemKeys, id, queryParams) {
		request.url.raw = extractVariablesFromString(numerateItem,request.url.raw,items,itemKeys,id, undefined, queryParams)
		if (request.url.path && request.url.path[0]){
			request.url.path[0] = extractVariablesFromString(numerateItem,request.url.path[0],items,itemKeys,id, undefined, queryParams);
		}
		if(request.header){
			for (let i in request.header){
				request.header[i].key = extractVariablesFromString(numerateItem,request.header[i].key,items,itemKeys,id);
				request.header[i].value = typeof request.header[i].value == 'number' || typeof request.header[i].value == 'object' ? request.header[i].value : extractVariablesFromString(numerateItem, request.header[i].value, items, itemKeys, id, request.header[i].key === 'Authorization');
			}
		}
		if (request.body && request.body.raw) {
			request.body.raw = extractVariablesFromString(numerateItem,request.body.raw,items,itemKeys,id);
		} else if (request.body && request.body.mode && request.body[request.body.mode]){
			for (let i in request.body[request.body.mode]){
				request.body[request.body.mode][i].key = extractVariablesFromString(numerateItem,request.body[request.body.mode][i].key,items,itemKeys,id);
				request.body[request.body.mode][i].value = extractVariablesFromString(numerateItem,request.body[request.body.mode][i].value,items,itemKeys,id);
			}
		}
		if (request.auth && request.auth.type && request.auth[request.auth.type]){
			for (let i in request.auth[request.auth.type]){
				request.auth[request.auth.type][i].key = extractVariablesFromString(numerateItem,request.auth[request.auth.type][i].key,items,itemKeys,id)
				request.auth[request.auth.type][i].value = extractVariablesFromString(numerateItem,request.auth[request.auth.type][i].value,items,itemKeys,id)
			}
		}
	}
	
	function extractVariablesFromString(numerateItem, string, items, itemKeys, id, isUserToken, queryParams = []){
		const re = /\{\{(.*?)\}\}/g
		const newItems = string.match(re)
		for (let i in newItems){
			newItems[i] = newItems[i].substring(0,newItems[i].length - 2).substring(2);
			if (_.includes(['host','port','basePath'], newItems[i])){
				continue;
			}
			let key = isUserToken? newItems[i] : numerateItem + newItems[i];
			if (!_.includes(itemKeys, key)) {
				let value = typeof global.environmentVariables[id+newItems[i]] !== 'undefined' ? global.environmentVariables[id+newItems[i]] : '';
				if (newItems[i].includes('_not_found')) {
						value = require('../utils/exampleForField.js')( 
						{ 
							name: newItems[i], 
							type: 'string', 
							example: value 
						}, 
						true
					);
				}
				if (queryParams.length > 0 && queryParams.filter(s => s.example !== 'application/pdf')) {
					if (!!queryParams.find(s => s.name === newItems[i])) {
						const queryItem = queryParams.find(s => s.name === newItems[i]);
						const exampleExist = !!queryItem;
						value = require('../utils/exampleForField.js')( 
							{ 
								name: newItems[i], 
								type: queryItem.type, 
								example: validExample(queryItem),
							}, 
							!exampleExist
						);
					}
					if (newItems[i].includes('_wrong')) {
						const queryItem = queryParams.find(s => s.name === newItems[i].replace('_wrong', ''));
						value = require('../utils/exampleForField.js')( 
							{ 
								name: newItems[i], 
								type: queryItem.type, 
								example: validExample(queryItem),
							}, 
							true
						);
					}
				}
				// Cuando la variable is_inline del fichero de configuración no diga lo contrario,
				// se guardarán las variables de entorno
				if (!global.configurationFile.is_inline || isUserToken) {
					items.push({
						"description": {
							"content": "",
							"type": "text/plain"
						},
						"value": value,
						"key": key,
						"enabled": true
					});
					itemKeys.push(key);
					string = string.replace('{{'+newItems[i]+'}}', '{{'+key+'}}');
				} else {
					// Se añade el valor del campo en el propio objeto de la petición
					if (typeof value !== 'string') {
						string = string.replace(`"{{${newItems[i]}}}"`, value);
					}
					string = string.replace(`{{${newItems[i]}}}`, value);
				}
			} else {
				if (!global.configurationFile.is_inline || isUserToken) {
					string = string.replace('{{'+newItems[i]+'}}', '{{'+key+'}}');
				}
			}
		}
		return string;
	}
	function extractVariablesFromTest(aux, execCode, numerateItem, items){
		if (global.configurationFile.schema_is_inline === false) {
			const key = numerateItem + 'schemaTest';
			for (let i in execCode){
				if (execCode[i] === 'var schema = pm.environment.get("schemaTest");'){
					execCode[i] = 'var schema = pm.environment.get("' + key + '");';
				}
			}
			let schemaJSON = configurationFile.schema_pretty_print === true
				? JSON.stringify(aux.bodyResponse[aux.status], null, 4) 
				: JSON.stringify(aux.bodyResponse[aux.status]);
				
			items.push({
				"description": {
					"content": "",
					"type": "text/plain"
				},
				"value": schemaJSON,
				"key": key,
				"enabled": true
			});
		}
	}

	function validExample(queryItem) {
		let queryParamExample;
		if (queryItem.type === 'array') {
			if (queryItem.example !== undefined) {
				queryParamExample = queryItem.example.toString();
			} else {
				queryParamExample = '';
			}
		} else {
			queryParamExample = queryItem.example;
		}

		return queryParamExample;
	}
}()
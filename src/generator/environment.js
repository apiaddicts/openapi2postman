'use strict'

const fs   = require('fs');
const argv = require('yargs').argv
const _ = require('lodash');

module.exports = function() {
  
	return function post(target,title,host,port,schemaHostBasePath,endpointsPostmanWithFolders){
		if (! argv.target ){
			argv.target = process.cwd()+'/'
		}

		let items = []
		const itemKeys = []

		items.push({
  		"description": {
    		"content": "",
    		"type": "text/plain"
  		},
  		"value": host,
  		"key": 'host',
  		"enabled": true
		})
		itemKeys.push('host')

		items.push({
  		"description": {
    		"content": "",
    		"type": "text/plain"
  		},
  		"value": port,
  		"key": 'port',
  		"enabled": true
		})
		itemKeys.push('port')

		items.push({
  		"description": {
    		"content": "",
    		"type": "text/plain"
  		},
  		"value": schemaHostBasePath.basePath,
  		"key": 'basePath',
  		"enabled": true
		})
		itemKeys.push('basePath')

		addVariables(endpointsPostmanWithFolders,items,itemKeys)

		items = _.orderBy(items, ['key'], ['asc']);

		const output = {
  		"id": "10a413ae-b106-43fe-9cc5-8481250a4bfe",
  		"name": title,
  		"values": items,
  		"_postman_variable_scope": "environment"
		}

		try {
			fs.writeFileSync(target+'/'+title+'.postman_environment.json', JSON.stringify(output));
		  	console.log(`Environment ${target+'/'+title+'.postman_environment.json'} was succesfully created`);
		} catch(err) {
			require('../utils/error.js')('Error writing the environment output');
		}
	}

	function addVariables(collection,items,itemKeys){
    	for (let i in collection){
      		for (let j in collection[i].item) {
				if (collection[i].item[j].request) {
					parseRequest(collection[i].item[j].request,items,itemKeys)
				} else {
					for (let k in collection[i].item[j].item){
						parseRequest(collection[i].item[j].item[k].request,items,itemKeys)
					}
				}
      		}
    	}
	}

	function parseRequest(request,items,itemKeys){
		extractVariablesFromString(request.url.raw,items,itemKeys)
		if (request.url.path && request.url.path[0]){
			extractVariablesFromString(request.url.path[0],items,itemKeys)
		}
		if(request.header){
			for (let i in request.header){
				extractVariablesFromString(request.header[i].key,items,itemKeys)
				extractVariablesFromString(request.header[i].value,items,itemKeys)
			}
		}
		if (request.body && request.body.raw) {
			extractVariablesFromString(request.body.raw,items,itemKeys)
		} else if (request.body && request.body.mode && request.body[request.body.mode]){
			for (let i in request.body[request.body.mode]){
				extractVariablesFromString(request.body[request.body.mode][i].key,items,itemKeys)
				extractVariablesFromString(request.body[request.body.mode][i].value,items,itemKeys)
			}
		} 
		if (request.auth && request.auth.type && request.auth[request.auth.type]){
			for (let i in request.auth[request.auth.type]){
				extractVariablesFromString(request.auth[request.auth.type][i].key,items,itemKeys)
				extractVariablesFromString(request.auth[request.auth.type][i].value,items,itemKeys)
			}
		}
	}

	function extractVariablesFromString(string,items,itemKeys){
		const re = /\{\{(.*?)\}\}/g
		const newItems = string.match(re)
		for (let i in newItems){
			newItems[i] = newItems[i].substring(0,newItems[i].length - 2).substring(2)
			if (!_.includes(itemKeys, newItems[i])){
				items.push({
					"description": {
					  "content": "",
					  "type": "text/plain"
					},
					"value": '',
					"key": newItems[i],
					"enabled": true
				})
				itemKeys.push(newItems[i])
			}
		}
	}
	
}()
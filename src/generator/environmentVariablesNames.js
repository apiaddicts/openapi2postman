'use strict'

const _ = require('lodash');

module.exports = function() {
  
    return function get(collection){
        const items = []
        const itemKeys = []
        for (let i in collection){
            for (let j in collection[i].item) {
                if (collection[i].item[j].request) {
                    parseRequest(collection[i].item[j].aux.numerateItem,collection[i].item[j].request,items,itemKeys)
                } else {
                    for (let k in collection[i].item[j].item){
                        parseRequest(collection[i].item[j].item[k].aux.numerateItem,collection[i].item[j].item[k].request,items,itemKeys)
                    }
                }
            }
        }
        return items
    }

	function parseRequest(numerateItem,request,items,itemKeys){
		request.url.raw = extractVariablesFromString(numerateItem,request.url.raw,items,itemKeys)
        if (request.url.path && request.url.path[0]){
			request.url.path[0] = extractVariablesFromString(numerateItem,request.url.path[0],items,itemKeys)
		}
		if(request.header){
			for (let i in request.header){
				request.header[i].key = extractVariablesFromString(numerateItem,request.header[i].key,items,itemKeys)
				request.header[i].value = extractVariablesFromString(numerateItem,request.header[i].value,items,itemKeys)
			}
		}
		if (request.body && request.body.raw) {
			request.body.raw = extractVariablesFromString(numerateItem,request.body.raw,items,itemKeys)
		} else if (request.body && request.body.mode && request.body[request.body.mode]){
			for (let i in request.body[request.body.mode]){
				request.body[request.body.mode][i].key = extractVariablesFromString(numerateItem,request.body[request.body.mode][i].key,items,itemKeys)
				request.body[request.body.mode][i].value = extractVariablesFromString(numerateItem,request.body[request.body.mode][i].value,items,itemKeys)
			}
		} 
		if (request.auth && request.auth.type && request.auth[request.auth.type]){
			for (let i in request.auth[request.auth.type]){
				request.auth[request.auth.type][i].key = extractVariablesFromString(numerateItem,request.auth[request.auth.type][i].key,items,itemKeys)
				request.auth[request.auth.type][i].value = extractVariablesFromString(numerateItem,request.auth[request.auth.type][i].value,items,itemKeys)
			}
		}
    }
    
	function extractVariablesFromString(numerateItem,string,items,itemKeys){
		const re = /\{\{(.*?)\}\}/g
		const newItems = string.match(re)
		for (let i in newItems){
			newItems[i] = newItems[i].substring(0,newItems[i].length - 2).substring(2)
			if (_.includes(['host','port','basePath'], newItems[i])){
				continue
			}
			let key = numerateItem+newItems[i]
			if (!_.includes(itemKeys, key)){
				let value = typeof global.environmentVariables[newItems[i]] !== 'undefined' ? global.environmentVariables[newItems[i]] : ''
				items.push({
					"description": {
					  "content": "",
					  "type": "text/plain"
					},
					"value": value,
					"key": key,
					"enabled": true
				})
				itemKeys.push(key)
            }
            string = string.replace('{{'+newItems[i]+'}}','{{'+key+'}}')
        }
        return string
	}

}()
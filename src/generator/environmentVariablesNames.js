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
                    for (let k in collection[i].item[j].item){
						let id = collection[i].item[j].item[k].request.method + collection[i].item[j].item[k].request.url.path[0]
						id = id.replace(/{{/g,'{').replace(/}}/g,'}').split('?')[0]
                        parseRequest(collection[i].item[j].item[k].aux.numerateItem,collection[i].item[j].item[k].request,items,itemKeys,id)
                    }
                }
            }
        }
        return items
    }

	function parseRequest(numerateItem,request,items,itemKeys,id){
		request.url.raw = extractVariablesFromString(numerateItem,request.url.raw,items,itemKeys,id)
        if (request.url.path && request.url.path[0]){
			request.url.path[0] = extractVariablesFromString(numerateItem,request.url.path[0],items,itemKeys,id)
		}
		if(request.header){
			for (let i in request.header){
				request.header[i].key = extractVariablesFromString(numerateItem,request.header[i].key,items,itemKeys,id)
				request.header[i].value = extractVariablesFromString(numerateItem,request.header[i].value,items,itemKeys,id)
			}
		}
		if (request.body && request.body.raw) {
			request.body.raw = extractVariablesFromString(numerateItem,request.body.raw,items,itemKeys,id)
		} else if (request.body && request.body.mode && request.body[request.body.mode]){
			for (let i in request.body[request.body.mode]){
				request.body[request.body.mode][i].key = extractVariablesFromString(numerateItem,request.body[request.body.mode][i].key,items,itemKeys,id)
				request.body[request.body.mode][i].value = extractVariablesFromString(numerateItem,request.body[request.body.mode][i].value,items,itemKeys,id)
			}
		} 
		if (request.auth && request.auth.type && request.auth[request.auth.type]){
			for (let i in request.auth[request.auth.type]){
				request.auth[request.auth.type][i].key = extractVariablesFromString(numerateItem,request.auth[request.auth.type][i].key,items,itemKeys,id)
				request.auth[request.auth.type][i].value = extractVariablesFromString(numerateItem,request.auth[request.auth.type][i].value,items,itemKeys,id)
			}
		}
    }
    
	function extractVariablesFromString(numerateItem,string,items,itemKeys,id){
		const re = /\{\{(.*?)\}\}/g
		const newItems = string.match(re)
		for (let i in newItems){
			newItems[i] = newItems[i].substring(0,newItems[i].length - 2).substring(2)
			if (_.includes(['host','port','basePath'], newItems[i])){
				continue
			}
			let key = numerateItem+newItems[i]
			if (!_.includes(itemKeys, key)){
				let value = typeof global.environmentVariables[id+newItems[i]] !== 'undefined' ? global.environmentVariables[id+newItems[i]] : ''
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
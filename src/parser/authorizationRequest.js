'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(authorizationToken,authorizationRequests){
  	if (authorizationRequests){
  		const request = _.find(authorizationRequests.item, ['name', authorizationToken.name]);
  		if (!request) {
  			require('../utils/error.js')(authorizationToken.name+' not found in collection');
  		}
  		request.authType = true;
  		return request;
  	}
  	return buildRequest(authorizationToken.name,authorizationToken['x-auth-type'],authorizationToken['x-scope']);
  };

  function buildRequest(authorizationTokenName,xAuthType,xScope)
  {
		const body = {
			"mode": "urlencoded",
			"urlencoded": [
			]
		}

  		let grantType;
  		let name = false
  		if (_.lowerCase(xAuthType) === 'application user'){
  			grantType = 'password'
  			if (_.lowerCase(xScope) === 'autologin'){
		  		body.urlencoded.push({
							"key": "ticket",
							"value": "{{autologin_ticket}}",
							"type": "text"
				})
				require('../utils/addVariable.js')('autologin_ticket','string');
  			} else if(xScope){
		  		body.urlencoded.push({
							"key": "username",
							"value": "{{"+xScope+"_username}}",
							"type": "text"
				})
				require('../utils/addVariable.js')(xScope+"_username",'string');
		  		body.urlencoded.push({
							"key": "password",
							"value": "{{"+xScope+"_password}}",
							"type": "text"
				})
				require('../utils/addVariable.js')(xScope+"_password",'string');
  			}

  			if (xScope){
		  		body.urlencoded.push({
							"key": "scope",
							"value": xScope,
							"type": "text"
				})
				name = grantType+'-'+xScope
  			} 
  		} else if(_.lowerCase(xAuthType) === 'application'){
  			grantType = 'client_credentials'
  		} else {
  			require('../utils/error.js')(xAuthType+' is a incorrect x-auth-type');
  		}

  		body.urlencoded.push({
					"key": "grant_type",
					"value": grantType,
					"type": "text"
		})

		if (!name){
			name = grantType
		}
		require('../utils/addVariable.js')("client_secret",'string');
		require('../utils/addVariable.js')("client_id",'string');
		return {
			"name": name,
			"event": [
				{
					"listen": "test",
					"script": {
						"id": "709a51c0-5c91-46ae-a1da-daa22d948b92",
						"exec": [
							"pm.test(\"Status code is 200\", function () {",
							"    pm.response.to.have.status(200);",
							"});",
							"",
							"var jsonData = JSON.parse(responseBody);",
							"",
							"postman.setEnvironmentVariable(\""+authorizationTokenName+"\", jsonData.access_token);"
						],
						"type": "text/javascript"
					}
				}
			],
			"authType": true,
			"request": {
				"auth": {
					"type": "basic",
					"basic": [
						{
							"key": "password",
							"value": "{{client_secret}}",
							"type": "string"
						},
						{
							"key": "username",
							"value": "{{client_id}}",
							"type": "string"
						}
					]
				},
				"method": "POST",
				"header": [],
				"body": body,
				"url": {
					"raw": "{{host}}{{port}}/token",
					"host": [
						"{{host}}{{port}}"
					],
					"path": [
						"token"
					]
				}
			},
			"response": []
		}
  }

}()
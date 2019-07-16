'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(postmanRequest){
  	if (!postmanRequest.aux.bodyResponse || !postmanRequest.aux.bodyResponse[postmanRequest.aux.status]){
  		return postmanRequest;
  	}
  	postmanRequest.event[0].script.exec = _.concat(postmanRequest.event[0].script.exec,[
		"",
		"var json = JSON.parse(responseBody);",
		"",
		"var schema = "+JSON.stringify(postmanRequest.aux.bodyResponse[postmanRequest.aux.status])+";",
		"",
		"pm.test('Schema is valid', function() {",
		"  pm.expect(tv4.validate(json, schema)).to.be.true;",
		"});"
	]);
  	return postmanRequest;
  };

}()
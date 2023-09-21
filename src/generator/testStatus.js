/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(postmanRequest){
  	postmanRequest.event = [{
			listen: "test",
			script: {
				id: "63142ff5-28a4-40b2-8314-dcbeeaa89325",
				type: "text/javascript",
				exec: [
					"pm.test(\"Status code is "+postmanRequest.aux.status+"\", function () {",
					"    pm.response.to.have.status("+postmanRequest.aux.status+");",
					"});"
				]
			}
  	}];
  	return postmanRequest;
  };

}()
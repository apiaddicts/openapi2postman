/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');


module.exports = function() {
  
  return function get(oAuthDefinition){
    let definition
    for (const i in oAuthDefinition) {
			definition = oAuthDefinition[i];
			
    }
   const data =  parseUrl(definition.flows)
   const authKey = _.keys(global.definition.security[0])[0]
   return generateDefinition(data,authKey) 
  }

  function generateDefinition(data,auth){
      const postmanCollection = {
        info: {
            _postman_id: "2e397e19-7819-4425-bbb8-e2b7283336a4",
            name: "authorizations",
            schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        item: [
            {
                name: "Get OAuth2 Token",
                event: [
                    {
                        listen: "test",
                        script: {
                            id: "7e78bc50-5882-47e1-9920-754befbbbfc5",
                            exec: [
                                "pm.test(\"Status code is 200\", function () {",
                "    pm.response.to.have.status(200);",
                "});",
                "",
                "var json = pm.response.json();",
                "",
                                `pm.environment.set(\"${auth}\", \"Bearer \"+json.data.access_token);`
                            ],
                            type: "text/javascript"
                        }
                    }
                ],
                request: {
                    method: "POST",
                    header: [
                        {
                            key: "Content-Type",
                            value: "application/x-www-form-urlencoded"
                        }
                    ],
                    body: {
                        mode: "urlencoded",
                        urlencoded: [
                          {
                            "key": "username",
                            "value": "cambiame",
                            "type": "text"
                          },
                          {
                            "key": "password",
                            "value": "cambiame",
                            "type": "text"
                          },
                          {
                            "key": "grant_type",
                            "value": "password",
                            "type": "text"
                          }
                        ]
                    },
                    url: {
                        raw: data.raw,
                        host: [data.host],
                        path: data.path
                    }
                },
                response: []
            }
        ]
    };

    return postmanCollection;
  }

  function parseUrl(flows) {
		let getTokenUrl
		for (const i in flows) {
			getTokenUrl = flows[i];
    }
    const urlObject = new URL(getTokenUrl.tokenUrl);
    const host = `${urlObject.protocol}//${urlObject.host}`;
    const path = urlObject.pathname.split('/').filter(segment => segment);

    return {
        raw: getTokenUrl.tokenUrl,
        host: host,
        path: path
    };
}

}()
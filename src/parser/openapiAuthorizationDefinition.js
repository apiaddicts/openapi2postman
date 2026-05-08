/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

const FLOW_PRIORITY = ['authorizationCode', 'clientCredentials', 'password', 'deviceAuthorization', 'implicit']

module.exports = function() {

  return function get(oAuthDefinition){
    let definition
    for (const i in oAuthDefinition) {
			definition = oAuthDefinition[i];
    }
   const data =  parseUrl(definition.flows)
   if (!data) return null
   const authKey = _.keys(globalThis.definition.security[0])[0]
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
                name: `Get OAuth2 Token - ${auth}`,
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
                              "var token = json.access_token || (json.data && json.data.access_token);",
                              `pm.environment.set("${auth}", "Bearer "+token);`
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
    let targetFlow = null
    for (const flowName of FLOW_PRIORITY) {
      if (flows[flowName]?.tokenUrl) {
        targetFlow = flows[flowName]
        break
      }
    }
    if (!targetFlow) {
      for (const name in flows) {
        if (flows[name]?.tokenUrl) {
          targetFlow = flows[name]
          break
        }
      }
    }
    if (!targetFlow?.tokenUrl) return null

    const urlObject = new URL(targetFlow.tokenUrl);
    const host = `${urlObject.protocol}//${urlObject.host}`;
    const path = urlObject.pathname.split('/').filter(Boolean);

    return {
        raw: targetFlow.tokenUrl,
        host: host,
        path: path
    };
  }

}()
/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');


module.exports = function() {
  
  return function get(oAuthDefinition){
    // console.log('oAuthDefinition');
    // console.log(oAuthDefinition.oAuth2ClientCredentials.flows);

   const data =  parseUrl(oAuthDefinition.oAuth2ClientCredentials.flows.clientCredentials.tokenUrl)
   return generateDefinition(data) 
  }

  function generateDefinition(data){
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
                "var json = JSON.parse(responseBody);",
                "",
                                "pm.environment.set(\"OAuth2\", \"Bearer \"+json.data.access_token);"
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

  function parseUrl(url) {
    const urlObject = new URL(url);
    const host = `${urlObject.protocol}//${urlObject.host}`;
    const path = urlObject.pathname.split('/').filter(segment => segment);

    return {
        raw: url,
        host: host,
        path: path
    };
}

}()
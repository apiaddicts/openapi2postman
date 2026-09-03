/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('node:assert');

describe('parser-body', () => {
  const checkBody = (name, parser, seed, method, path, isResp, expectedFile) => {
    it(name, () => {
      globalThis.definition = require(`../seeds/${seed}`);

      if (isResp) globalThis.circularTail = [];

      const expected = expectedFile ? require(`../seeds/${expectedFile}`) : undefined;
      const body = require(`../src/parser/${parser}/body.js`)(method, path, isResp);

      assert.deepStrictEqual(body, expected);
    });
  };

  checkBody('body void request swagger2','swagger2','parserInitialGood.json','GET','/pets',false,null);

  checkBody('body void request openapi3.0','openapi3','parserInitialGoodOpenApi3.json','GET','/pets',false,null);

  checkBody('body void request openapi3.0 2','openapi3','parserInitialGoodOpenApi3.json','POST','/pets',false,null);

  checkBody('body void request openapi3.1','openapi3','parserInitialGoodOpenApi3.1.json','GET','/pets',false,null);


  checkBody('body fill request swagger2','swagger2','parserInitialGood.json','POST','/pets',false,'parserInitialGoodResultPetRequest.json');

  checkBody('body fill request openapi3.0','openapi3','parserInitialGoodOpenApiExpanded3.json','POST','/pets',false,'parserInitialGoodResultPetRequest.json');

  checkBody('body fill request openapi3.1','openapi3','parserInitialGoodOpenApiExpanded3.1.json','POST','/pets',false,'parserInitialGoodResultPetRequest.json');


  checkBody('body items,ref and allof response swagger2','swagger2','parserInitialGood.json','GET','/pets',true,'parserInitialGoodResultRespArray.json');

  checkBody('body items,ref and allof response openapi3.0','openapi3','parserInitialGoodOpenApiExpanded3.json','GET','/pets',true,'parserInitialGoodResultRespArray.json');

  checkBody('body items,ref and allof response openapi3.1','openapi3','parserInitialGoodOpenApiExpanded3.1.json','GET','/pets',true,'parserInitialGoodResultRespArray.json');


  checkBody('body ref and allof response swagger2','swagger2','parserInitialGood.json','POST','/pets',true,'parserInitialGoodResultRespObject.json');

  checkBody('body ref and allof response openapi3.0','openapi3','parserInitialGoodOpenApiExpanded3.json','POST','/pets',true,'parserInitialGoodResultRespObject.json');

  checkBody('body ref and allof response openapi3.1','openapi3','parserInitialGoodOpenApiExpanded3.1.json','POST','/pets',true,'parserInitialGoodResultRespObject.json');


  checkBody('body allof loop swagger2','swagger2','parserBodyAllofLoopInitial.json','POST','/apple',false,'parserInitialGoodResultAllOfLoop.json');

  checkBody('body allof string swagger2','swagger2','parserBodyAllofString.json','POST','/apple',false,'parserInitialGoodResultAllOfString.json');

  checkBody('body void request openapi3.2','openapi3','parserInitialGoodOpenApi3.2.json','GET','/pets',false,null);

  checkBody('body fill request openapi3.2','openapi3','parserInitialGoodOpenApiExpanded3.2.json','POST','/pets',false,'parserInitialGoodResultPetRequest.json');

  checkBody('body items,ref and allof response openapi3.2','openapi3','parserInitialGoodOpenApiExpanded3.2.json','GET','/pets',true,'parserInitialGoodResultRespArray.json');

  checkBody('body ref and allof response openapi3.2','openapi3','parserInitialGoodOpenApiExpanded3.2.json','POST','/pets',true,'parserInitialGoodResultRespObject.json');

  checkBody('body streaming itemSchema response openapi3.2','openapi3','parserBodyItemSchema3.2.json','GET','/events',true,'parserBodyItemSchemaResult3.2.json');


  checkBody('nullable response properties accept null openapi3.0','openapi3','parserBodyNullableInitial3.json','GET','/professionals',true,'parserBodyNullableResult3.json');

  checkBody('nullable response properties accept null openapi3.1','openapi3','parserBodyNullableInitial3.1.json','GET','/professionals',true,'parserBodyNullableResult3.1.json');

  checkBody('nullable response properties accept null swagger2','swagger2','parserBodyNullableInitialSwagger2.json','GET','/professionals',true,'parserBodyNullableResultSwagger2.json');


  checkBody('response schema keeps every declared type openapi3.1','openapi3','parserBodyTypeListInitial3.1.json','POST','/valores',true,'parserBodyTypeListResult3.1.json');

  checkBody('request schema collapses the type list to a single type openapi3.1','openapi3','parserBodyTypeListInitial3.1.json','POST','/valores',false,'parserBodyTypeListRequestResult3.1.json');
});
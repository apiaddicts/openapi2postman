const assert = require('assert');

describe('generator-body', () => {
  
  it('good', () => {

    const endpoint = require('../seeds/generatorBodyInitial.json');
    const definitionResult = require('../seeds/generatorBodyResult.json');

    const definition = require('../src/generator/body.js')(endpoint);
    assert.deepStrictEqual(definition, definitionResult);
  });

  it('withoutRequiredRed', () => {

	const endpoint = require('../seeds/generatorBodyInitialBadRequest.json');
    const definitionResult = require('../seeds/generatorBodyResultWithoutRequiredRed.json');

	global.requiredParams = ['without.orange','without.water.paramAiden'];
    const definition = require('../src/generator/body.js')(endpoint,true);
    assert.deepStrictEqual(definition, definitionResult);
    assert.equal(global.requiredParams.length, 3);
  });

  it('withoutRequiredOrange', () => {

    const endpoint = require('../seeds/generatorBodyInitialBadRequest.json');
    const definitionResult = require('../seeds/generatorBodyResultWithoutRequiredOrange.json');

    global.requiredParams = ['without.red','without.water.paramAiden'];
    const definition = require('../src/generator/body.js')(endpoint,true);
    assert.deepStrictEqual(definition, definitionResult);
    assert.equal(global.requiredParams.length, 3);
  });

  it('withoutRequiredParamAiden', () => {

    const endpoint = require('../seeds/generatorBodyInitialBadRequest.json');
    const definitionResult = require('../seeds/generatorBodyResultWithoutRequiredParamAiden.json');

    global.requiredParams = ['without.red','without.orange'];
    const definition = require('../src/generator/body.js')(endpoint,true);
    assert.deepStrictEqual(definition, definitionResult);
    assert.equal(global.requiredParams.length, 3);
  });

  it('withOrangeWrong', () => {

	const endpoint = require('../seeds/generatorBodyInitialBadRequest.json');
    const definitionResult = require('../seeds/generatorBodyResultWithOrangeWrong.json');

	global.wrongParams = ['with.red','with.water','with.water.paramAiden','with.water.paramBiden','with.water.paramCiden'];
    const definition = require('../src/generator/body.js')(endpoint,false,true);
    assert.deepStrictEqual(definition, definitionResult);
    assert.equal(global.wrongParams.length, 6);
  });

  it('withWaterWrong', () => {

    const endpoint = require('../seeds/generatorBodyInitialBadRequest.json');
    const definitionResult = require('../seeds/generatorBodyResultWithWaterWrong.json');

	global.wrongParams = ['with.red','with.orange','with.water.paramAiden','with.water.paramBiden','with.water.paramCiden'];
    const definition = require('../src/generator/body.js')(endpoint,false,true);
    assert.deepStrictEqual(definition, definitionResult);
    assert.equal(global.wrongParams.length, 6);
  });

  it('withParamBidenWrong', () => {

    const endpoint = require('../seeds/generatorBodyInitialBadRequest.json');
    const definitionResult = require('../seeds/generatorBodyResultWithParamBidenWrong.json');

	global.wrongParams = ['with.red','with.orange','with.water','with.water.paramAiden','with.water.paramCiden'];
    const definition = require('../src/generator/body.js')(endpoint,false,true);
    assert.deepStrictEqual(definition, definitionResult);
    assert.equal(global.wrongParams.length, 6);
  });

  it('array', () => {

    const endpoint = require('../seeds/generatorBodyInitialArray.json');
    const definitionResult = require('../seeds/generatorBodyResultArray.json');

    const definition = require('../src/generator/body.js')(endpoint);
    assert.deepStrictEqual(definition, definitionResult);
  });

  it('objectWithoutType', () => {

    const endpoint = require('../seeds/generatorBodyInitialObjectWithoutType.json');
    const definitionResult = require('../seeds/generatorBodyResultObjectWithoutType.json');

    const definition = require('../src/generator/body.js')(endpoint);
    assert.deepStrictEqual(definition, definitionResult);
  });

});
const assert = require('assert');
const sinon = require('sinon');

describe('parser-title', () => {
  
  before(() => {
    sinon.stub(process, 'exit');
  });

  after(() => {
    process.exit.restore();
  });

  it('bad', () => {

    const badDefinition = require('../seeds/parserTitleInitialBad.json');

    require('../src/parser/title.js')(badDefinition);

    sinon.assert.called(process.exit);
    sinon.assert.calledWith(process.exit, 1);
  });

  it('good', () => {

    const definition = require('../seeds/parserTitleInitialGood.json');

    const title = require('../src/parser/title.js')(definition);
    assert.equal(title, "Swagger Petstore");
  });
});
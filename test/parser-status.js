const assert = require('assert');

describe('parser-status', () => {
  
  it('good swagger2', () => {

    global.definition = require('../seeds/parserInitialGood.json');

    const status = require('../src/parser/swagger2/status.js')('DELETE','/pets/{id}');
    assert.deepStrictEqual(status, [ '204', '500' ]);
  });

});
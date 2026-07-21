/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

describe('generator-environment', () => {

  let targetDir;

  beforeEach(() => {
    targetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'o2p-env-'));
  });

  afterEach(() => {
    fs.rmSync(targetDir, { recursive: true, force: true });
  });

  function generatePort(port) {
    const title = 'test_env';
    require('../src/generator/environment.js')(targetDir, title, 'example.com', port, { basePath: '/api' }, [], null);
    const output = JSON.parse(fs.readFileSync(path.join(targetDir, title + '.postman_environment.json'), 'utf8'));
    return output.values.find(v => v.key === 'port');
  }

  it('keeps a single leading colon when the config already includes one', () => {
    assert.strictEqual(generatePort(':443').value, ':443');
  });

  it('adds a leading colon when the config has none', () => {
    assert.strictEqual(generatePort('443').value, ':443');
  });

  it('accepts numeric ports', () => {
    assert.strictEqual(generatePort(443).value, ':443');
  });

  it('collapses duplicated leading colons instead of doubling them', () => {
    const portWithExtraColon = ':' + ':443';
    assert.strictEqual(generatePort(portWithExtraColon).value, ':443');
  });

  it('strips accidental whitespace around the port', () => {
    assert.strictEqual(generatePort(' 443 ').value, ':443');
  });

  it('resolves to an empty string (not "null") when port is null', () => {
    const port = generatePort(null);
    assert.ok(port, 'the port variable must still be defined so {{port}} resolves to something, not the literal placeholder');
    assert.strictEqual(port.value, '');
  });

  it('resolves to an empty string (not "undefined") when port is missing', () => {
    const port = generatePort(undefined);
    assert.ok(port);
    assert.strictEqual(port.value, '');
  });

  it('resolves to an empty string when port is an empty string', () => {
    const port = generatePort('');
    assert.ok(port);
    assert.strictEqual(port.value, '');
  });

  it('resolves to an empty string when port is only whitespace or bare colons', () => {
    assert.strictEqual(generatePort('   ').value, '');
    assert.strictEqual(generatePort('::').value, '');
  });

  it('always produces host, port and basePath exactly once, deduplicated', () => {
    const title = 'test_env_dedup';
    require('../src/generator/environment.js')(targetDir, title, 'example.com', '443', { basePath: '/api' }, [], null);
    const output = JSON.parse(fs.readFileSync(path.join(targetDir, title + '.postman_environment.json'), 'utf8'));
    const keys = output.values.map(v => v.key);
    assert.deepStrictEqual(keys.filter(k => ['host', 'port', 'basePath'].includes(k)).sort(), ['basePath', 'host', 'port']);
  });

});

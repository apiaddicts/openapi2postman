/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const path = require('node:path')

module.exports = function resolveSafePath(userPath, baseDir) {
	if (typeof userPath !== 'string' || userPath.trim() === '') {
		throw new Error('a file path is required');
	}

	const base = path.resolve(baseDir || process.env.O2P_ALLOWED_DIR || process.cwd());
	const resolved = path.resolve(base, userPath);

	if (resolved !== base && !resolved.startsWith(base + path.sep)) {
		throw new Error('path "' + userPath + '" escapes the allowed directory "' + base + '"');
	}

	return resolved;
}

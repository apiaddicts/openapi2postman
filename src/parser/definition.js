/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const yaml = require('js-yaml');
const fs   = require('fs');
const argv = require('yargs').argv
const path = require('path')

module.exports = function() {
  
  return function get() {
		
		try {
			const contractFile = fs.existsSync(argv.file, 'utf8')
			if (!contractFile) {
				require('../utils/error.js')('The yaml file not found');
			}
			if (path.extname(argv.file) !== '.yaml' && path.extname(argv.file) !== '.yml'){
				require('../utils/error.js')('The yaml format is not correct: '+argv.file);
			}
			
			const definition = yaml.safeLoad(fs.readFileSync(argv.file, 'utf8'));
			return definition;
		} catch (e) {
				require('../utils/error.js')('The yaml file does not exist or is not correct: ' + argv.file);
		}
  };

}()
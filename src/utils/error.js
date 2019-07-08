'use strict'

module.exports = function() {
  
  return function post(message){
	console.error('\x1b[31m%s\x1b[0m',message);
	process.exit(1);
  };

}()
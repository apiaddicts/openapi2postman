/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'


const _ = require('lodash');

module.exports = function checkCircularReferences(reference, depthLevel, patternNumber) {
  const tail = globalThis.circularTail = globalThis.circularTail || [];

  if (!tail[patternNumber]) {
    tail[patternNumber] = [reference];
    return false;
  }

  const currentPattern = tail[patternNumber];

  if (currentPattern.length < (depthLevel * patternNumber)) {
    currentPattern.push(reference);
    return false;
  }

  currentPattern.shift();
  currentPattern.push(reference);

  const groups = _.chunk(currentPattern, patternNumber);
  const areEquals = groups.length > 1 && groups.every(group => _.isEqual(group, groups[0]));

  if (areEquals) globalThis.circularTail = [];

  return areEquals;
};
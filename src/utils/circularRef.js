/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'


const _ = require('lodash');

module.exports = function checkCircularReferences(reference, depthLevel, patternNumber) {
  if (!globalThis.circularTail) {
    globalThis.circularTail = []
  }
  if (!globalThis.circularTail[patternNumber]) {
    globalThis.circularTail[patternNumber] = [reference]
    return false
  }
  if (globalThis.circularTail[patternNumber].length < (depthLevel * patternNumber)) {
    globalThis.circularTail[patternNumber].push(reference)
    return false
  }

  const groups = _.chunk(globalThis.circularTail[patternNumber], patternNumber)
  globalThis.circularTail[patternNumber].shift()
  globalThis.circularTail[patternNumber].push(reference)

  let areEquals = true

  for (let i = 1; i < groups.length; i++) {
    for (let k in groups[i]) {
      if (groups[i][k] !== groups[i - 1][k]) {
        areEquals = false
        break
      }
    }
    if (!areEquals) break
  }

  if (areEquals) {
    globalThis.circularTail = []
  }

  return areEquals

}
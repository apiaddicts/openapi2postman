/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

"use strict";

const _ = require("lodash");

module.exports = (function () {
  return function get(postmanRequest) {
    
    const example = require("./examples")(postmanRequest?.path , postmanRequest.request.method , postmanRequest.aux.status)

    if (!postmanRequest.microcks || !example) {
      return postmanRequest;
    }

    postmanRequest.request.header.push({
      key: "X-Microcks-Response-Name",
      value: example
    });

    return postmanRequest;
  };
})();

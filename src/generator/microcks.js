/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

"use strict";

const _ = require("lodash");

module.exports = (function () {
  return function get(postmanRequest) {
    const example = require("./examples")(postmanRequest?.path , postmanRequest.request.method , postmanRequest.aux.status)
    // If the global definition object does not have a paths property, return the postmanRequest
    if (!postmanRequest.microcks || !example) {
      return postmanRequest;
    }
    // Add the x-microcks-operations property to the header of the postmanRequest
    postmanRequest.request.header.push({
      key: "X-Microcks-Response-Name",
      value: example
    });
    // Return the postmanRequest with the x-microcks-operations property added to the header
    return postmanRequest;
  };
})();

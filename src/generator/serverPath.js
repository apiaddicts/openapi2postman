/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'


module.exports = function(){
  return function get(servers,pattern){
    if(servers){
      const cleanPattern = pattern.replace(/%/g, ""); 
      const serverFound = servers.find(server => server.url.includes(cleanPattern));
    
      if(serverFound){
        const allArray = serverFound.url.split( '/' )
        const protocol = allArray[0]
        const domain = allArray[2]
        const host = protocol + '//' + domain
        return {
          host: host,
          basePath: serverFound.url.replace(host, '')
        };
      }
  
      return;
    }

  }
}()
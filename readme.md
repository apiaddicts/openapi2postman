<p align="center">
	<a href="https://apiaddicts.org/">
	  <img src="logo.png">
	</a>
</p>

APIAddicts is the world's leading fundation aroung APIs. See the [APIAddicts website](https://www.apiaddicts.org/)  to learn more. 

# contributors
## CloudAPPi
CloudAppi is one leader in APIs in global word. See the [CloudAPPi Services](https://cloudappi.net) 

## Madrid Digital
Madrid Digital is a public administration in Spain. See the [Comunidad de Madrid website](https://www.comunidad.madrid/)

# Swagger2postman

swagger2postman creates automatic tests from swagger 2.0 using postman format. Also, it creates environments files, depending of configuration.
Those collections can be importend in postan application.  The tests includes tests for 2xx, 4xx... and tests to validate output formats.

## Table of content

* [Structure and submodules](#structure-and-submodules)
* [Build and run](#build-and-run)
  * [Prerequisites](#prerequisites)
  * [Get the source code for the first time](#get-the-source-code-for-the-first-time)
  * [Run](#run)
  * [Get the latest changes](#get-the-latest-changes)
* [Contribute](#contribute)
  * [IDE support](#ide-support)
    * [IntelliJ IDEA](#intellij-idea)
    * [Eclipse](#eclipse)
* [Documentation](#documentation)
* [Advanced Functionality](#advanced-functionality)
* [Additional resources](#additional-resources)


## Structure and submodules

* *[docs](docs)* - This module contents the guides to configurate and run the product.
* *[example](example)* - Integration and system tests for SoapUI.
* *[src](src)* – Source code
* *[test](soapui-maven-plugin-tester)* - Testing folder

## Build and run
### Prerequisites
You need node v10 or later.


### run

Please review the s2p_config_file.json before to execute the command
Execute 
node index.js --configuration s2p_config_file.json --file example/swagger_provincias.yml

The output files are the following (in example folder): 
* SWAGGER_API_TestSuite_DEV.postman_collection.json
* SWAGGER_API_TestSuiteEnv_DEV.postman_environment.json
* SWAGGER_API_TestSuite_PROD.postman_collection.json
* SWAGGER_API_TestSuiteEnv_PROD.postman_environment.json


In postman:

* import generated postman collection file in postman 
* import generated postman environment file in postman


* update variables in the envirnoment to test all cases

### Get the source code for the first time

To get the source code, run `git clone https://github.com/apiaddicts/swagger2postman.git` in the folder where you want to clone the root folder of the Swagger2Postman project.


### Configuration file

Collections and environments to generate can be configured using a JSON configuration file. Collection and environment name can be specified, as well as the target folder for resulting files, the authorizations collection to be used and some other characteristics. This configuration file has an specification and examples that can be read on the following document:  
[Configuration file swagger2postman](./docs/swagger2postman-Archivo_de_configuracion.pdf). This document is only available in spanish by now. it will be soon translated to english.

an example configuration file is included in file structure.

### Workspace configuration

Node.js and npm package manager are required to run the tool. Its adviced to use preconfigured installation tools provided by the manufacturer:
[https://nodejs.org/es/download/](https://nodejs.org/es/download/)


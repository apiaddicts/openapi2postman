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

# swagger2postman

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
review the s2p_config_file.json
node index.js --configuration s2p_config_file.json --file example/swagger_provincias.yml


## Configuration file

Collections and environments to generate can be configured using a JSON configuration file. Collection and environment name can be specified, as well as the target folder for resulting files, the authorizations collection to be used and some other characteristics. This configuration file has an specification and examples that can be read on the following document:  
[Configuration file swagger2postman](./docs/MD-swagger2postman-Archivo_de_configuracion.pdf). This document is only available in spanish by now. it will be soon translated to english.

an example configuration file is included in file structure.

## Workspace configuration

Node.js and npm package manager are required to run the tool. Its adviced to use preconfigured installation tools provided by the manufacturer:
[https://nodejs.org/es/download/](https://nodejs.org/es/download/)

## Tool run

to run the tool we should provide two arguments, both are required:

* --file: API definition file. it should be an OpenApi 2.0 specification compliant file on yaml format.
* --configuration: JSON configuration file.

Local path to files must be specified.

Tool can be run using example files provided. Run the following commands from index.js containing folder.:

 `npm install`

 `node index.js --file example/swagger_provincia.yml  --configuration example/s2p_config_file.json`

After execution these will be the resulting files:

* test_results/Provincias_API_TestSuite_DEV.postman_collection.json: Development test suite with no authorization requests.
* test_results/Provincias_API_TestSuite_VAL.postman_collection.json: Validation test suite including all requests.
* test_results/Provincias_API_TestSuite_PROD.postman_collection.json: Production test suite with no data writing or deleting requests.
* test_results/Provincias_API_TestSuite_DEV.postman_environment.json: Development test suite environment.
* test_results/Provincias_API_TestSuite_VAL.postman_environment.json: Validation test suite environment.
* test_results/Provincias_API_TestSuite_PROD.postman_environment.json: Production test suite environment.

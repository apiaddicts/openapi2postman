# 🛠️ Openapi2postman ![Release](https://img.shields.io/badge/release-0.1.0-purple) ![Swagger](https://img.shields.io/badge/-openapi-%23Clojure?style=flat&logo=swagger&logoColor=white) ![Js](https://img.shields.io/badge/javascript-%23ED8B00.svg?style=flat&logo=javascript&logoColor=white) ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat&logo=postman&logoColor=white) [![License: LGPL v3](https://img.shields.io/badge/license-LGPL_v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0) 

**Openapi2postman** creates automatic tests from Openapi 3.0 using postman format. Also, it creates environments files, depending of configuration.
Those collections can be importend in postan application.  The tests includes tests for 2xx, 4xx... and tests to validate output formats.

### This repository is intended for :octocat: **community** use, it can be modified and adapted without commercial use. If you need a version, support or help for your **enterprise** or project, please contact us 📧 devrel@apiaddicts.org

[![Twitter](https://img.shields.io/badge/Twitter-%23000000.svg?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/APIAddicts) 
[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/ZdbGqMBYy8)
[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/apiaddicts/)
[![Facebook](https://img.shields.io/badge/Facebook-%231877F2.svg?style=for-the-badge&logo=Facebook&logoColor=white)](https://www.facebook.com/apiaddicts)
[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://www.youtube.com/@APIAddictslmaoo)

# 🙌 Join the **Openapi2postman** Adopters list 
📢 If Openapi2postman is part of your organization's toolkit, we kindly encourage you to include your company's name in our Adopters list. 🙏 This not only significantly boosts the project's visibility and reputation but also represents a small yet impactful way to give back to the project.

| Organization  | Description of Use / Referenc |
|---|---|
|  [CloudAppi](https://cloudappi.net/)  | Apification and generation of microservices |
| [Madrid Digital](https://www.comunidad.madrid/servicios/sede-electronica/madrid-digital/)  | Generation of microservices  |

# 👩🏽‍💻  Contribute to ApiAddicts 

We're an inclusive and open community, welcoming you to join our effort to enhance ApiAddicts, and we're excited to prioritize tasks based on community input, inviting you to review and collaborate through our GitHub issue tracker.

Feel free to drop by and greet us on our GitHub discussion or Discord chat. You can also show your support by giving us some GitHub stars ⭐️, or by following us on Twitter, LinkedIn, and subscribing to our YouTube channel! 🚀

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/apiaddicts)


# 📑 Getting started 
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

To get the source code, run `git clone https://github.com/apiaddicts/openapi2postman.git` in the folder where you want to clone the root folder of the Openapi2postman project.


### Configuration file

Collections and environments to generate can be configured using a JSON configuration file. Collection and environment name can be specified, as well as the target folder for resulting files, the authorizations collection to be used and some other characteristics. This configuration file has an specification and examples that can be read on the following document:  
[Configuration file openapi2postman](./docs/openapi2postman-Archivo_de_configuracion.pdf). This document is only available in spanish by now. it will be soon translated to english.

an example configuration file is included in file structure.

### Workspace configuration

Node.js and npm package manager are required to run the tool. Its adviced to use preconfigured installation tools provided by the manufacturer:
[https://nodejs.org/es/download/](https://nodejs.org/es/download/)

## 💛 Sponsors
<p align="center">
	<a href="https://apiaddicts.org/">
    	<img src="https://apiaddicts.cloudappi.net/web/image/4248/LOGOCloudappi2020Versiones-01.png" alt="cloudappi" width="150"/>
        <img src="https://apiquality.io/wp-content/uploads/2022/09/cropped-logo-apiquality-principal-1-170x70.png" height = "75">
        <img src="https://apiaddicts-web.s3.eu-west-1.amazonaws.com/wp-content/uploads/2022/03/17155736/cropped-APIAddicts-logotipo_rojo.png" height = "75">
	</a>
</p>


# swagger2postman

swagger2postman converts a yaml (swagger 2.0) to a postman collection. This collection includes tests for the 2xx, 400 and 401. 

![](https://gitlab.com/cloudappi/swagger2postman/blob/master/images/image1.png)

In all cases the status is checked and it is verified that the scheme of the output corresponds to the defined. In the 400 the wrong types and the obligatory fields are tested. To check the 401, the authorization header is not sent.

![](https://gitlab.com/cloudappi/swagger2postman/blob/master/images/image2.png)

swagger2postman also generates a file of type environment with all the variables of both the bodies and the paths. These variables are used by the collection of postman generated to compose their bodies and their paths.

![](https://gitlab.com/cloudappi/swagger2postman/blob/master/images/image3.png)

In the endpoints protected by basic token or by apikey an environment variable will be generated for these tokens.

![](https://gitlab.com/cloudappi/swagger2postman/blob/master/images/image4.png)

![](https://gitlab.com/cloudappi/swagger2postman/blob/master/images/image4-bis.png)

if you use the securityDefinition of type oauth2 you will need to pass as an argument another collection that includes the requests to get the token. The name of each request will be the name of the securityDefinition and the token with the same name will be set in the test part. After that request will be copied to the result collection to get the token.

![](https://gitlab.com/cloudappi/swagger2postman/blob/master/images/image5.png)

![](https://gitlab.com/cloudappi/swagger2postman/blob/master/images/image5-bis.png)

401 will be tested not sending the token.

![](https://gitlab.com/cloudappi/swagger2postman/blob/master/images/image6.png)

![](https://gitlab.com/cloudappi/swagger2postman/blob/master/images/image6-bis.png)

400 will be tested not sending required parameters.

![](https://gitlab.com/cloudappi/swagger2postman/blob/master/images/image7.png)

400 will be tested sending parameters with other types.

![](https://gitlab.com/cloudappi/swagger2postman/blob/master/images/image8.png)

You can check check swagger2postman using our example yaml and example authorization collection:

 `node index.js --file example/example.yaml --target example/result --target-env example/result --authorization example/authorizations.postman_collection.json `

After executing that command, example/result.postman_collection.json file with the collection and example/result.postman_environment.json file with the environment will be generated.
# swagger2postman

swagger2postman converts a yaml (swagger 2.0) to a postman collection. This collection includes tests for the 2xx, 400 and 401. 

![](images/image1.png)

In all cases the status is checked and it is verified that the scheme of the output corresponds to the defined. In the 400 the wrong types and the obligatory fields are tested. To check the 401, the authorization header is not sent.

![](images/image2.png)

swagger2postman also generates a file of type environment with all the variables of both the bodies and the paths. These variables are used by the collection of postman generated to compose their bodies and their paths.

![](images/image3.png)

In the endpoints protected by basic token or by apikey an environment variable will be generated for these tokens.

![](images/image4.png)

![](images/image4-bis.png)

if you use the securityDefinition of type oauth2 you will need to pass as an argument another collection that includes the requests to get the token. The name of each request will be the name of the securityDefinition and the token with the same name will be set in the test part. After that request will be copied to the result collection to get the token.

![](images/image5.png)

![](images/image5-bis.png)

401 will be tested not sending the token.

![](images/image6.png)

![](images/image6-bis.png)

400 will be tested not sending required parameters.

![](images/image7.png)

400 will be tested sending parameters with other types.

![](images/image8.png)

You can check check swagger2postman using our example yaml and example authorization collection:

 `npm install`

 `node index.js --file example/example.yaml --target example/result --target-env example/result --authorization example/authorizations.postman_collection.json `

After executing that command, example/result.postman_collection.json file with the collection and example/result.postman_environment.json file with the environment will be generated.
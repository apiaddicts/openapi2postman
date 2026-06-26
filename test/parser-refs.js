/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('node:assert')
const http = require('node:http')

const FLAT_SCHEMA_YAML = [
	'components:',
	'  schemas:',
	'    Pet:',
	'      type: object',
	'      properties:',
	'        name:',
	'          type: string',
].join('\n')

const NESTED_SCHEMA_YAML = [
	'components:',
	'  schemas:',
	'    Pet:',
	'      type: object',
	'      properties:',
	'        address:',
	"          $ref: '#/components/schemas/Address'",
	'    Address:',
	'      type: object',
	'      properties:',
	'        street:',
	'          type: string',
].join('\n')

const PET_SCHEMA = { type: 'object', properties: { name: { type: 'string' } } }

const PET_WITH_ADDRESS = {
	type: 'object',
	properties: {
		address: { type: 'object', properties: { street: { type: 'string' } } }
	}
}

function startServer(responseBody) {
	return new Promise(resolve => {
		const server = http.createServer((req, res) => {
			res.writeHead(200, { 'Content-Type': 'application/yaml' })
			res.end(responseBody)
		})
		server.listen(0, '127.0.0.1', () => resolve(server))
	})
}

describe('parser-refs', () => {
	beforeEach(() => {
		delete require.cache[require.resolve('../src/parser/openapi3/refs.js')]
		delete require.cache[require.resolve('../src/parser/swagger2/refs.js')]
	})

	it('resolves external http $ref with fragment (openapi3)', async () => {
		const server = await startServer(FLAT_SCHEMA_YAML)
		const { port } = server.address()

		globalThis.definition = {
			paths: {
				'/pets': {
					get: {
						responses: {
							'200': {
								content: {
									'application/json': {
										schema: { '$ref': `http://127.0.0.1:${port}/schema.yaml#/components/schemas/Pet` }
									}
								}
							}
						}
					}
				}
			}
		}

		const refs = require('../src/parser/openapi3/refs.js')
		await refs()
		server.close()

		const schema = globalThis.definition.paths['/pets'].get.responses['200'].content['application/json'].schema
		assert.deepStrictEqual(schema, PET_SCHEMA)
	})

	it('resolves external http $ref with fragment (swagger2)', async () => {
		const server = await startServer(FLAT_SCHEMA_YAML)
		const { port } = server.address()

		globalThis.definition = {
			paths: {
				'/pets': {
					get: {
						responses: {
							'200': {
								schema: { '$ref': `http://127.0.0.1:${port}/schema.yaml#/components/schemas/Pet` }
							}
						}
					}
				}
			}
		}

		const refs = require('../src/parser/swagger2/refs.js')
		await refs()
		server.close()

		const schema = globalThis.definition.paths['/pets'].get.responses['200'].schema
		assert.deepStrictEqual(schema, PET_SCHEMA)
	})

	it('resolves nested internal $refs inside external document (openapi3)', async () => {
		const server = await startServer(NESTED_SCHEMA_YAML)
		const { port } = server.address()

		globalThis.definition = {
			paths: {
				'/pets': {
					get: {
						responses: {
							'200': {
								content: {
									'application/json': {
										schema: { '$ref': `http://127.0.0.1:${port}/schema.yaml#/components/schemas/Pet` }
									}
								}
							}
						}
					}
				}
			}
		}

		const refs = require('../src/parser/openapi3/refs.js')
		await refs()
		server.close()

		const schema = globalThis.definition.paths['/pets'].get.responses['200'].content['application/json'].schema
		assert.deepStrictEqual(schema, PET_WITH_ADDRESS)
	})

	it('resolves transitive external $refs (openapi3)', async () => {
		const addressServer = await startServer([
			'type: object',
			'properties:',
			'  street:',
			'    type: string',
		].join('\n'))
		const { port: addressPort } = addressServer.address()

		const petServer = await startServer([
			'components:',
			'  schemas:',
			'    Pet:',
			'      type: object',
			'      properties:',
			'        address:',
			`          $ref: 'http://127.0.0.1:${addressPort}/address.yaml'`,
		].join('\n'))
		const { port: petPort } = petServer.address()

		globalThis.definition = {
			paths: {
				'/pets': {
					get: {
						responses: {
							'200': {
								content: {
									'application/json': {
										schema: { '$ref': `http://127.0.0.1:${petPort}/pet.yaml#/components/schemas/Pet` }
									}
								}
							}
						}
					}
				}
			}
		}

		const refs = require('../src/parser/openapi3/refs.js')
		await refs()
		petServer.close()
		addressServer.close()

		const schema = globalThis.definition.paths['/pets'].get.responses['200'].content['application/json'].schema
		assert.deepStrictEqual(schema, PET_WITH_ADDRESS)
	})

	it('emits clear error for unreachable external $ref (openapi3)', async () => {
		globalThis.definition = {
			paths: {
				'/pets': {
					get: { responses: { '200': { schema: { '$ref': 'http://127.0.0.1:1/schema.yaml' } } } }
				}
			}
		}

		const originalExit = process.exit
		const originalError = console.error
		let exitCode
		process.exit = (code) => { exitCode = code; throw new Error('process.exit:' + code) }
		console.error = () => {}

		const refs = require('../src/parser/openapi3/refs.js')
		try {
			await refs()
			assert.fail('Expected process.exit to be called')
		} catch (e) {
			assert.strictEqual(exitCode, 1)
		} finally {
			process.exit = originalExit
			console.error = originalError
		}
	})
})

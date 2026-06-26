/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const https = require('node:https')
const http = require('node:http')
const yaml = require('js-yaml')
const error = require('../../utils/error')

const externalDocCache = new Map()

function fetchUrl(url) {
	return new Promise((resolve, reject) => {
		const client = url.startsWith('https://') ? https : http
		client.get(url, (res) => {
			if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
				return fetchUrl(res.headers.location).then(resolve, reject)
			}
			let data = ''
			res.on('data', chunk => data += chunk)
			res.on('end', () => {
				try { resolve(yaml.load(data)) }
				catch (e) { reject(new Error('Failed to parse external ref from ' + url + ': ' + e.message)) }
			})
		}).on('error', e => reject(new Error('Failed to fetch external ref ' + url + ': ' + e.message)))
	})
}

function extractFragment(refValue) {
	const hashIdx = refValue.indexOf('#')
	return {
		baseUrl: hashIdx >= 0 ? refValue.substring(0, hashIdx) : refValue,
		fragment: hashIdx >= 0 ? refValue.substring(hashIdx + 1) : ''
	}
}

async function ensureFetched(baseUrl, seenUrls) {
	if (externalDocCache.has(baseUrl)) return
	if (seenUrls.has(baseUrl)) { error('Circular external $ref detected: ' + baseUrl) }
	const childSeen = new Set(seenUrls)
	childSeen.add(baseUrl)
	let doc
	try { doc = await fetchUrl(baseUrl) }
	catch (e) { error(e.message) }
	await resolveRefs(doc, doc, childSeen)
	externalDocCache.set(baseUrl, doc)
}

async function fetchAndResolveExternal(refValue, seenUrls) {
	const { baseUrl, fragment } = extractFragment(refValue)
	await ensureFetched(baseUrl, seenUrls)
	const doc = externalDocCache.get(baseUrl)
	if (!fragment || fragment === '/') return doc
	const parts = fragment.replace(/^\//, '').split('/')
	const resolved = findObject(doc, parts)
	if (resolved === undefined) { error('External $ref fragment not found: ' + fragment + ' in ' + baseUrl) }
	return resolved
}

function resolveInternalRef(refValue, localDefinition) {
	const fragment = refValue.replace(/^#\/?/, '')
	const parts = fragment ? fragment.split('/') : []
	const refObject = parts.length ? findObject(localDefinition, [...parts]) : localDefinition
	if (refObject === undefined) { error('$ref not found: ' + refValue) }
	return refObject
}

function isExternalRef(refValue) {
	return refValue.startsWith('http://') || refValue.startsWith('https://')
}

async function resolveRefs(obj, localDefinition, seenUrls = new Set()) {
	for (const k in obj) {
		if (typeof obj[k] === 'object' && obj[k] !== null) {
			await resolveRefs(obj[k], localDefinition, seenUrls)
		} else if (k === '$ref') {
			const refObject = isExternalRef(obj[k])
				? await fetchAndResolveExternal(obj[k], seenUrls)
				: resolveInternalRef(obj[k], localDefinition)
			delete obj[k]
			Object.assign(obj, refObject)
		}
	}
}

function findObject(obj, propertiesArray) {
	if (propertiesArray.length < 1) return obj
	if (obj === undefined || obj === null) return undefined
	const property = propertiesArray.shift()
	return findObject(obj[property], propertiesArray)
}

module.exports = function() {
	return async function get() {
		await resolveRefs(globalThis.definition, globalThis.definition)
		return globalThis.definition
	}
}()

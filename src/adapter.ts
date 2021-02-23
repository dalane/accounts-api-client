import { readFile } from 'fs';
import OpenAPIClient from 'openapi-client-axios';
import { join } from 'path';
import { promisify } from 'util';
import { Client, Components } from '../schema/openapi';
export { Components };

export type AccountsApiClient = Client;

const readFilePromise = promisify(readFile);

const packageJsonPath = join(__dirname, '../package.json');
const openapiJsonPath = join(__dirname, '../schema/openapi.json');

export interface ApiClientSettings {
	/**
	 * OPTIONAL URL to the API base including the version, default to
	 * "https://projects.api.dalane.cloud/v1"
	 */
	server?: { url: string; description?: string };
	/**
	 * OPTIONAL An identifier of the service using the client. It is added to the
	 * user-agent header.
	 */
	identifier?: string;
}

export async function createClient(options?: ApiClientSettings): Promise<AccountsApiClient> {
	const { server, identifier } = options ?? {};
	// load package.json file and get library version
	const packageJsonContent = await readFilePromise(packageJsonPath);
	const { name, version } = JSON.parse(packageJsonContent.toString('utf8'));
	// load openapi.json and get contents
	const openapiJsonContent = await readFilePromise(openapiJsonPath);
	const schema = JSON.parse(openapiJsonContent.toString('utf8'));
	// create api
	const api = new OpenAPIClient({ definition: schema, withServer: server ?? 'live' });
	// initialise and get client
	const client = await api.getClient<AccountsApiClient>();
	// set a nice user-agent header for our library
	client.defaults.headers = {
		'user-agent': `${name}:${version}${identifier !== undefined ? `;${identifier}` : ''}`
	};
	return client;
}

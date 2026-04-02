import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class FlareNetworkApi implements ICredentialType {
	name = 'flareNetworkApi';
	displayName = 'Flare Network API';
	documentationUrl = 'https://docs.flare.network/apis/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API key from the Flare Network developer portal',
			required: false,
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://flare-api.flare.network',
			description: 'Base URL for the Flare Network API',
			required: true,
		},
	];
}
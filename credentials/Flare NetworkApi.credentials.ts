import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class FlareNetworkApi implements ICredentialType {
	name = 'flareNetworkApi';
	displayName = 'Flare Network API';
	documentationUrl = 'https://docs.flare.network/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'API key for Flare Network API access',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'options',
			options: [
				{
					name: 'Flare Mainnet',
					value: 'https://flare-api.flare.network/v1',
				},
				{
					name: 'Songbird Testnet',
					value: 'https://songbird-api.flare.network/v1',
				},
			],
			required: true,
			default: 'https://flare-api.flare.network/v1',
			description: 'Base URL for the Flare Network API',
		},
	];
}
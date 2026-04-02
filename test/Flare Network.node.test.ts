/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { FlareNetwork } from '../nodes/Flare Network/Flare Network.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('FlareNetwork Node', () => {
  let node: FlareNetwork;

  beforeAll(() => {
    node = new FlareNetwork();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Flare Network');
      expect(node.description.name).toBe('flarenetwork');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('FtsoDataFeed Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://flare-api.flare.network',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getCurrentPrices', () => {
		it('should get current prices successfully', async () => {
			const mockResponse = { data: [{ symbol: 'FLR', price: '0.05' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCurrentPrices')
				.mockReturnValueOnce('FLR,SGB')
				.mockReturnValueOnce(0);

			const result = await executeFtsoDataFeedOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://flare-api.flare.network/ftso/prices/current?symbols=FLR%2CSGB',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle getCurrentPrices error', async () => {
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCurrentPrices')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(0);

			const result = await executeFtsoDataFeedOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getHistoricalPrices', () => {
		it('should get historical prices successfully', async () => {
			const mockResponse = { data: [{ symbol: 'FLR', price: '0.05', epoch: 100 }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getHistoricalPrices')
				.mockReturnValueOnce('FLR')
				.mockReturnValueOnce(100)
				.mockReturnValueOnce(200)
				.mockReturnValueOnce(50);

			const result = await executeFtsoDataFeedOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getPriceBySymbol', () => {
		it('should get price by symbol successfully', async () => {
			const mockResponse = { symbol: 'FLR', price: '0.05' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getPriceBySymbol')
				.mockReturnValueOnce('FLR');

			const result = await executeFtsoDataFeedOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getDataProviders', () => {
		it('should get data providers successfully', async () => {
			const mockResponse = { data: [{ address: '0x123', name: 'Provider1' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getDataProviders')
				.mockReturnValueOnce(true)
				.mockReturnValueOnce('votePower');

			const result = await executeFtsoDataFeedOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getDataProvider', () => {
		it('should get specific data provider successfully', async () => {
			const mockResponse = { address: '0x123', name: 'Provider1', votePower: '1000' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getDataProvider')
				.mockReturnValueOnce('0x123');

			const result = await executeFtsoDataFeedOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getCurrentEpoch', () => {
		it('should get current epoch successfully', async () => {
			const mockResponse = { epochId: 1000, startTime: 1234567890 };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCurrentEpoch');

			const result = await executeFtsoDataFeedOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getEpochData', () => {
		it('should get epoch data successfully', async () => {
			const mockResponse = { epochId: 100, prices: [{ symbol: 'FLR', price: '0.05' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEpochData')
				.mockReturnValueOnce(100);

			const result = await executeFtsoDataFeedOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Delegation Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://flare-api.flare.network',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	test('should create delegation successfully', async () => {
		const mockResponse = { success: true, transactionHash: '0x123' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createDelegation')
			.mockReturnValueOnce('0x456,0x789')
			.mockReturnValueOnce('50,50')
			.mockReturnValueOnce('0xabc');

		const result = await executeDelegationOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([
			{
				json: mockResponse,
				pairedItem: { item: 0 },
			},
		]);
	});

	test('should get delegations successfully', async () => {
		const mockResponse = { delegations: [{ provider: '0x456', percentage: 50 }] };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getDelegations')
			.mockReturnValueOnce('0xabc')
			.mockReturnValueOnce(123);

		const result = await executeDelegationOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([
			{
				json: mockResponse,
				pairedItem: { item: 0 },
			},
		]);
	});

	test('should update delegation successfully', async () => {
		const mockResponse = { success: true, transactionHash: '0x456' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('updateDelegation')
			.mockReturnValueOnce('0x456')
			.mockReturnValueOnce('100')
			.mockReturnValueOnce('0xabc');

		const result = await executeDelegationOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([
			{
				json: mockResponse,
				pairedItem: { item: 0 },
			},
		]);
	});

	test('should remove delegation successfully', async () => {
		const mockResponse = { success: true, transactionHash: '0x789' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('removeDelegation')
			.mockReturnValueOnce('0x456')
			.mockReturnValueOnce('0xabc');

		const result = await executeDelegationOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([
			{
				json: mockResponse,
				pairedItem: { item: 0 },
			},
		]);
	});

	test('should get delegation rewards successfully', async () => {
		const mockResponse = { rewards: [{ epoch: 123, amount: '1000' }] };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getDelegationRewards')
			.mockReturnValueOnce('0xabc')
			.mockReturnValueOnce(120)
			.mockReturnValueOnce(125);

		const result = await executeDelegationOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([
			{
				json: mockResponse,
				pairedItem: { item: 0 },
			},
		]);
	});

	test('should get vote power successfully', async () => {
		const mockResponse = { votePower: '5000', epoch: 123 };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getVotePower')
			.mockReturnValueOnce('0xabc')
			.mockReturnValueOnce(123);

		const result = await executeDelegationOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([
			{
				json: mockResponse,
				pairedItem: { item: 0 },
			},
		]);
	});

	test('should claim rewards successfully', async () => {
		const mockResponse = { success: true, transactionHash: '0xdef', amount: '2500' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('claimRewards')
			.mockReturnValueOnce('0xabc')
			.mockReturnValueOnce('120,121,122');

		const result = await executeDelegationOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([
			{
				json: mockResponse,
				pairedItem: { item: 0 },
			},
		]);
	});

	test('should handle API errors gracefully', async () => {
		const error = new Error('API Error');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createDelegation');

		const result = await executeDelegationOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([
			{
				json: { error: 'API Error' },
				pairedItem: { item: 0 },
			},
		]);
	});

	test('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		await expect(
			executeDelegationOperations.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('Unknown operation: unknownOperation');
	});
});

describe('FAssets Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://flare-api.flare.network',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('mintFAsset operation', () => {
		it('should mint FAsset successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('mintFAsset')
				.mockReturnValueOnce('FBTC')
				.mockReturnValueOnce('1000000')
				.mockReturnValueOnce('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				transactionHash: '0x123',
				status: 'pending',
			});

			const result = await executeFAssetsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.transactionHash).toBe('0x123');
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://flare-api.flare.network/fassets/mint',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					assetType: 'FBTC',
					amount: '1000000',
					underlyingAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
				},
				json: true,
			});
		});

		it('should handle mint FAsset error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('mintFAsset')
				.mockReturnValueOnce('FBTC')
				.mockReturnValueOnce('1000000')
				.mockReturnValueOnce('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				new Error('Insufficient collateral'),
			);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeFAssetsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Insufficient collateral');
		});
	});

	describe('redeemFAsset operation', () => {
		it('should redeem FAsset successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('redeemFAsset')
				.mockReturnValueOnce('FBTC')
				.mockReturnValueOnce('500000')
				.mockReturnValueOnce('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				transactionHash: '0x456',
				status: 'confirmed',
			});

			const result = await executeFAssetsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.transactionHash).toBe('0x456');
		});
	});

	describe('getFAssetPositions operation', () => {
		it('should get FAsset positions successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getFAssetPositions')
				.mockReturnValueOnce('0x1234567890123456789012345678901234567890')
				.mockReturnValueOnce('FBTC');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				positions: [
					{
						assetType: 'FBTC',
						balance: '1000000',
						collateralRatio: '150%',
					},
				],
			});

			const result = await executeFAssetsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.positions).toHaveLength(1);
		});
	});

	describe('getFAssetAgents operation', () => {
		it('should get FAsset agents successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getFAssetAgents')
				.mockReturnValueOnce('FBTC')
				.mockReturnValueOnce(true);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				agents: [
					{
						address: '0xagent1',
						collateralRatio: '200%',
						status: 'active',
					},
				],
			});

			const result = await executeFAssetsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.agents).toHaveLength(1);
		});
	});

	describe('getFAssetAgent operation', () => {
		it('should get specific FAsset agent successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getFAssetAgent')
				.mockReturnValueOnce('0xagent123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				address: '0xagent123',
				collateralRatio: '180%',
				status: 'active',
				totalCollateral: '5000000',
			});

			const result = await executeFAssetsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.address).toBe('0xagent123');
		});
	});

	describe('liquidateFAsset operation', () => {
		it('should liquidate FAsset successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('liquidateFAsset')
				.mockReturnValueOnce('0xagent123')
				.mockReturnValueOnce('100000');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				transactionHash: '0x789',
				liquidatedAmount: '100000',
			});

			const result = await executeFAssetsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.liquidatedAmount).toBe('100000');
		});
	});

	describe('getCollateralRatio operation', () => {
		it('should get collateral ratio successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCollateralRatio')
				.mockReturnValueOnce('0xagent123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				agentAddress: '0xagent123',
				collateralRatio: '165%',
				minRatio: '150%',
			});

			const result = await executeFAssetsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.collateralRatio).toBe('165%');
		});
	});

	describe('getUnderlyingBalance operation', () => {
		it('should get underlying balance successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getUnderlyingBalance')
				.mockReturnValueOnce('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')
				.mockReturnValueOnce('FBTC');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
				balance: '2500000',
				assetType: 'FBTC',
			});

			const result = await executeFAssetsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.balance).toBe('2500000');
		});
	});
});

describe('StateConnector Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://flare-api.flare.network',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	it('should create attestation successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createAttestation')
			.mockReturnValueOnce('PaymentVerification')
			.mockReturnValueOnce('ethereum')
			.mockReturnValueOnce({ transactionHash: '0x123' });
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			attestationId: 'att123',
			status: 'pending',
		});

		const result = await executeStateConnectorOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.attestationId).toBe('att123');
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: 'https://flare-api.flare.network/state-connector/attestations',
			})
		);
	});

	it('should get attestation successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAttestation')
			.mockReturnValueOnce('att123');
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			attestationId: 'att123',
			status: 'confirmed',
			data: {},
		});

		const result = await executeStateConnectorOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.attestationId).toBe('att123');
	});

	it('should get attestations list successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAttestations')
			.mockReturnValueOnce('ethereum')
			.mockReturnValueOnce('PaymentVerification')
			.mockReturnValueOnce('confirmed')
			.mockReturnValueOnce(10);
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			attestations: [{ attestationId: 'att123' }],
			total: 1,
		});

		const result = await executeStateConnectorOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.attestations).toHaveLength(1);
	});

	it('should get attestation proof successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAttestationProof')
			.mockReturnValueOnce('att123');
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			proof: ['0x123', '0x456'],
			merkleRoot: '0xabc',
		});

		const result = await executeStateConnectorOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.proof).toBeDefined();
		expect(result[0].json.merkleRoot).toBe('0xabc');
	});

	it('should verify proof successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('verifyProof')
			.mockReturnValueOnce(['0x123', '0x456'])
			.mockReturnValueOnce('0xabc')
			.mockReturnValueOnce({ transactionHash: '0x789' });
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			valid: true,
			verified: true,
		});

		const result = await executeStateConnectorOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.valid).toBe(true);
	});

	it('should get current round successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCurrentRound');
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			roundId: 12345,
			startTime: 1640995200,
			endTime: 1640995260,
		});

		const result = await executeStateConnectorOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.roundId).toBe(12345);
	});

	it('should get round data successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getRoundData')
			.mockReturnValueOnce(12345);
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			roundId: 12345,
			attestations: [],
			merkleRoot: '0xdef',
		});

		const result = await executeStateConnectorOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.roundId).toBe(12345);
	});

	it('should get attestation sources successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAttestationSources')
			.mockReturnValueOnce(true);
		
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			sources: [
				{ id: 'ethereum', name: 'Ethereum', active: true },
				{ id: 'bitcoin', name: 'Bitcoin', active: true },
			],
		});

		const result = await executeStateConnectorOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.sources).toHaveLength(2);
	});

	it('should handle API errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCurrentRound');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeStateConnectorOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	it('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		await expect(
			executeStateConnectorOperations.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('Unknown operation: unknownOperation');
	});
});

describe('NetworkInfo Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://flare-api.flare.network'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should get network status successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getNetworkStatus');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      status: 'healthy',
      blockHeight: 12345,
      peers: 50
    });

    const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      status: 'healthy',
      blockHeight: 12345,
      peers: 50
    });
  });

  it('should get latest block successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getLatestBlock');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      number: 12345,
      hash: '0xabc123',
      timestamp: 1640995200
    });

    const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.number).toBe(12345);
  });

  it('should get specific block successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBlock')
      .mockReturnValueOnce(12000);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      number: 12000,
      hash: '0xdef456',
      transactions: []
    });

    const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.number).toBe(12000);
  });

  it('should get transaction successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTransaction')
      .mockReturnValueOnce('0xabc123def456');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      hash: '0xabc123def456',
      status: 'confirmed',
      value: '1000000000000000000'
    });

    const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.hash).toBe('0xabc123def456');
  });

  it('should get account successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccount')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      address: '0x1234567890123456789012345678901234567890',
      balance: '5000000000000000000',
      nonce: 42
    });

    const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.address).toBe('0x1234567890123456789012345678901234567890');
  });

  it('should get validators successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getValidators')
      .mockReturnValueOnce(true)
      .mockReturnValueOnce('stake');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      validators: [
        { address: '0xvalidator1', stake: '1000000', active: true },
        { address: '0xvalidator2', stake: '2000000', active: true }
      ]
    });

    const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.validators).toHaveLength(2);
  });

  it('should get specific validator successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getValidator')
      .mockReturnValueOnce('0xvalidator123');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      address: '0xvalidator123',
      stake: '1500000',
      performance: 0.98,
      active: true
    });

    const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.address).toBe('0xvalidator123');
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getNetworkStatus');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getNetworkStatus');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);

    await expect(executeNetworkInfoOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('API Error');
  });
});
});

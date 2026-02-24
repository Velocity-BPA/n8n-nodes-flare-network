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
describe('FtsoPriceFeeds Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://flare-api.flare.network/v1',
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
      const mockResponse = {
        success: true,
        data: [
          { symbol: 'FLR', price: 0.025, timestamp: 1640995200 },
          { symbol: 'SGB', price: 0.012, timestamp: 1640995200 },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getCurrentPrices';
          case 'symbols': return 'FLR,SGB';
          case 'timestamp': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFtsoPriceFeedsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://flare-api.flare.network/v1/ftso/prices/current?symbols=FLR%2CSGB',
        headers: {
          'X-API-Key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle error in getCurrentPrices', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getCurrentPrices';
          case 'symbols': return '';
          case 'timestamp': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeFtsoPriceFeedsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('getPriceBySymbol', () => {
    it('should get price by symbol successfully', async () => {
      const mockResponse = {
        success: true,
        data: { symbol: 'FLR', price: 0.025, timestamp: 1640995200 },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getPriceBySymbol';
          case 'symbol': return 'FLR';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFtsoPriceFeedsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getPriceHistory', () => {
    it('should get price history successfully', async () => {
      const mockResponse = {
        success: true,
        data: [
          { timestamp: 1640995200, price: 0.025 },
          { timestamp: 1640998800, price: 0.026 },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getPriceHistory';
          case 'symbol': return 'FLR';
          case 'startTime': return 1640995200;
          case 'endTime': return 1641081600;
          case 'interval': return '1h';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFtsoPriceFeedsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getFtsoProviders', () => {
    it('should get FTSO providers successfully', async () => {
      const mockResponse = {
        success: true,
        data: [
          { address: '0x123...', name: 'Provider 1', active: true },
          { address: '0x456...', name: 'Provider 2', active: true },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getFtsoProviders';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFtsoPriceFeedsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getProviderPrices', () => {
    it('should get provider prices successfully', async () => {
      const mockResponse = {
        success: true,
        data: [
          { symbol: 'FLR', price: 0.025, timestamp: 1640995200 },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getProviderPrices';
          case 'address': return '0x123456789...';
          case 'symbol': return 'FLR';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFtsoPriceFeedsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getFtsoRewards', () => {
    it('should get FTSO rewards successfully', async () => {
      const mockResponse = {
        success: true,
        data: [
          { epoch: 100, provider: '0x123...', reward: '1000000000000000000' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getFtsoRewards';
          case 'rewardEpoch': return 100;
          case 'provider': return '';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFtsoPriceFeedsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('Delegation Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://flare-api.flare.network/v1',
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

  test('getDelegatorInfo should return delegation info', async () => {
    const mockResponse = {
      address: '0x123...',
      totalDelegated: '1000000',
      providers: ['0xabc...', '0xdef...'],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getDelegatorInfo';
      if (param === 'address') return '0x123...';
      return '';
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDelegationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://flare-api.flare.network/v1/delegation/delegators/0x123...',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('getDelegationProviders should return providers list', async () => {
    const mockResponse = {
      providers: [
        { address: '0xabc...', name: 'Provider 1', votePower: '5000000' },
        { address: '0xdef...', name: 'Provider 2', votePower: '3000000' },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getDelegationProviders';
      return '';
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDelegationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('estimateRewards should calculate potential rewards', async () => {
    const mockResponse = {
      estimatedRewards: '150.5',
      duration: 30,
      providers: ['0xabc...', '0xdef...'],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'estimateRewards';
      if (param === 'amount') return '10000';
      if (param === 'providers') return '0xabc..., 0xdef...';
      if (param === 'duration') return 30;
      return '';
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDelegationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://flare-api.flare.network/v1/delegation/estimate-rewards',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        amount: '10000',
        providers: ['0xabc...', '0xdef...'],
        duration: 30,
      },
      json: true,
    });
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getDelegatorInfo';
      if (param === 'address') return 'invalid-address';
      return '';
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('Invalid address format')
    );

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeDelegationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Invalid address format');
  });

  test('getDelegationHistory should include query parameters', async () => {
    const mockResponse = {
      history: [
        { epoch: 100, provider: '0xabc...', amount: '1000' },
        { epoch: 101, provider: '0xdef...', amount: '2000' },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getDelegationHistory';
      if (param === 'address') return '0x123...';
      if (param === 'startEpoch') return 100;
      if (param === 'endEpoch') return 110;
      return '';
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDelegationOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://flare-api.flare.network/v1/delegation/history/0x123...?startEpoch=100&endEpoch=110',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });
});

describe('StateConnector Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://flare-api.flare.network/v1',
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

  test('should get attestations successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAttestations';
        case 'roundId': return '12345';
        case 'status': return 'confirmed';
        default: return '';
      }
    });

    const mockResponse = {
      attestations: [
        { id: '1', roundId: '12345', status: 'confirmed' },
        { id: '2', roundId: '12345', status: 'confirmed' }
      ]
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeStateConnectorOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://flare-api.flare.network/v1/state-connector/attestations?roundId=12345&status=confirmed',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get attestation by ID successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAttestationById';
        case 'attestationId': return 'att_12345';
        default: return '';
      }
    });

    const mockResponse = {
      id: 'att_12345',
      roundId: '12345',
      status: 'confirmed',
      details: { sourceId: 'source_1' }
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeStateConnectorOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should submit attestation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'submitAttestation';
        case 'attestationType': return 'payment';
        case 'sourceId': return 'source_123';
        case 'attestationData': return { amount: '1000', recipient: '0x123' };
        default: return '';
      }
    });

    const mockResponse = {
      id: 'att_new_123',
      status: 'pending',
      submittedAt: '2024-01-01T00:00:00Z'
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeStateConnectorOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://flare-api.flare.network/v1/state-connector/attestations',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        attestationType: 'payment',
        sourceId: 'source_123',
        data: { amount: '1000', recipient: '0x123' }
      },
      json: true,
    });
  });

  test('should get attestation rounds successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAttestationRounds';
        case 'roundId': return '12345';
        default: return '';
      }
    });

    const mockResponse = {
      rounds: [
        { id: '12345', startTime: '2024-01-01T00:00:00Z', endTime: '2024-01-01T01:00:00Z' }
      ]
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeStateConnectorOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should get attestation providers successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAttestationProviders';
        default: return '';
      }
    });

    const mockResponse = {
      providers: [
        { id: 'provider_1', name: 'Provider 1', status: 'active' },
        { id: 'provider_2', name: 'Provider 2', status: 'active' }
      ]
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeStateConnectorOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should get supported types successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getSupportedTypes';
        default: return '';
      }
    });

    const mockResponse = {
      types: ['payment', 'balance', 'transaction_confirmation']
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeStateConnectorOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should handle API errors properly', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAttestations';
        default: return '';
      }
    });

    const mockError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    await expect(
      executeStateConnectorOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });

  test('should continue on fail when configured', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAttestations';
        default: return '';
      }
    });

    const mockError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    const result = await executeStateConnectorOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });
});

describe('FAssets Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://flare-api.flare.network/v1',
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

  describe('getFAssetAgents', () => {
    it('should get F-Asset agents successfully', async () => {
      const mockResponse = {
        agents: [
          { address: '0x123', status: 'active', fAssetType: 'FBTC' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getFAssetAgents';
          case 'fAssetType': return 'FBTC';
          case 'status': return 'active';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFAssetsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://flare-api.flare.network/v1/fassets/agents',
        qs: { fAssetType: 'FBTC', status: 'active' },
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getFAssetAgents');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeFAssetsOperations.call(mockExecuteFunctions, [{ json: {} }]),
      ).rejects.toThrow();
    });
  });

  describe('createMintingRequest', () => {
    it('should create minting request successfully', async () => {
      const mockResponse = {
        requestId: 'mint-123',
        status: 'pending',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createMintingRequest';
          case 'amount': return '1000';
          case 'fAssetType': return 'FBTC';
          case 'agent': return '0x456';
          case 'underlyingAddress': return '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFAssetsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://flare-api.flare.network/v1/fassets/minting',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          amount: '1000',
          fAssetType: 'FBTC',
          agent: '0x456',
          underlyingAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        },
        json: true,
      });
    });
  });

  describe('getCollateralInfo', () => {
    it('should get collateral info successfully', async () => {
      const mockResponse = {
        agent: '0x789',
        collateralRatio: '150%',
        totalCollateral: '5000',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getCollateralInfo';
          case 'agent': return '0x789';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeFAssetsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://flare-api.flare.network/v1/fassets/collateral/0x789',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });
});

describe('NetworkInfo Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://flare-api.flare.network/v1',
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

  it('should get network info successfully', async () => {
    const mockResponse = { 
      chainId: 14, 
      blockHeight: 1000000, 
      networkName: 'Flare' 
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
      if (paramName === 'operation') return 'getNetworkInfo';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://flare-api.flare.network/v1/network/info',
      headers: {
        'X-API-Key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get blocks with parameters', async () => {
    const mockResponse = { 
      blocks: [{ number: 100, hash: '0xabc123' }] 
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
      if (paramName === 'operation') return 'getBlocks';
      if (paramName === 'blockNumber') return '100';
      if (paramName === 'limit') return 5;
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://flare-api.flare.network/v1/network/blocks?blockNumber=100&limit=5',
      headers: {
        'X-API-Key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get block by hash', async () => {
    const mockResponse = { 
      number: 100, 
      hash: '0xabc123', 
      transactions: [] 
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
      if (paramName === 'operation') return 'getBlockByHash';
      if (paramName === 'blockHash') return '0xabc123';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://flare-api.flare.network/v1/network/blocks/0xabc123',
      headers: {
        'X-API-Key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get address balance', async () => {
    const mockResponse = { 
      address: '0x123456789',
      balance: '1000000000000000000' 
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
      if (paramName === 'operation') return 'getAddressBalance';
      if (paramName === 'address') return '0x123456789';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 },
    }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://flare-api.flare.network/v1/network/addresses/0x123456789/balance',
      headers: {
        'X-API-Key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should handle API errors correctly', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
      if (paramName === 'operation') return 'getNetworkInfo';
      return null;
    });

    const apiError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const items = [{ json: {} }];
    const result = await executeNetworkInfoOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{
      json: { error: 'API Error' },
      pairedItem: { item: 0 },
    }]);
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
      if (paramName === 'operation') return 'unknownOperation';
      return null;
    });

    const items = [{ json: {} }];

    await expect(executeNetworkInfoOperations.call(mockExecuteFunctions, items))
      .rejects
      .toThrow('Unknown operation: unknownOperation');
  });
});
});

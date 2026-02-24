/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-flarenetwork/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class FlareNetwork implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Flare Network',
    name: 'flarenetwork',
    icon: 'file:flarenetwork.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Flare Network API',
    defaults: {
      name: 'Flare Network',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'flarenetworkApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'FtsoPriceFeeds',
            value: 'ftsoPriceFeeds',
          },
          {
            name: 'Delegation',
            value: 'delegation',
          },
          {
            name: 'StateConnector',
            value: 'stateConnector',
          },
          {
            name: 'FAssets',
            value: 'fAssets',
          },
          {
            name: 'NetworkInfo',
            value: 'networkInfo',
          }
        ],
        default: 'ftsoPriceFeeds',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['ftsoPriceFeeds'],
    },
  },
  options: [
    {
      name: 'Get Current Prices',
      value: 'getCurrentPrices',
      description: 'Get current price data for all supported assets',
      action: 'Get current prices',
    },
    {
      name: 'Get Price By Symbol',
      value: 'getPriceBySymbol',
      description: 'Get current price for specific symbol',
      action: 'Get price by symbol',
    },
    {
      name: 'Get Price History',
      value: 'getPriceHistory',
      description: 'Get historical price data',
      action: 'Get price history',
    },
    {
      name: 'Get FTSO Providers',
      value: 'getFtsoProviders',
      description: 'Get list of FTSO data providers',
      action: 'Get FTSO providers',
    },
    {
      name: 'Get Provider Prices',
      value: 'getProviderPrices',
      description: 'Get prices from specific provider',
      action: 'Get provider prices',
    },
    {
      name: 'Get FTSO Rewards',
      value: 'getFtsoRewards',
      description: 'Get FTSO reward information',
      action: 'Get FTSO rewards',
    },
  ],
  default: 'getCurrentPrices',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['delegation'],
    },
  },
  options: [
    {
      name: 'Get Delegator Info',
      value: 'getDelegatorInfo',
      description: 'Get delegation info for address',
      action: 'Get delegator info',
    },
    {
      name: 'Get Delegation Providers',
      value: 'getDelegationProviders',
      description: 'Get available delegation providers',
      action: 'Get delegation providers',
    },
    {
      name: 'Get Provider Details',
      value: 'getProviderDetails',
      description: 'Get detailed provider information',
      action: 'Get provider details',
    },
    {
      name: 'Get Delegation Rewards',
      value: 'getDelegationRewards',
      description: 'Get claimable rewards for delegator',
      action: 'Get delegation rewards',
    },
    {
      name: 'Get Delegation History',
      value: 'getDelegationHistory',
      description: 'Get delegation history',
      action: 'Get delegation history',
    },
    {
      name: 'Estimate Rewards',
      value: 'estimateRewards',
      description: 'Estimate potential rewards',
      action: 'Estimate rewards',
    },
  ],
  default: 'getDelegatorInfo',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['stateConnector'],
    },
  },
  options: [
    {
      name: 'Get Attestations',
      value: 'getAttestations',
      description: 'Get attestation requests',
      action: 'Get attestations',
    },
    {
      name: 'Get Attestation by ID',
      value: 'getAttestationById',
      description: 'Get specific attestation details',
      action: 'Get attestation by ID',
    },
    {
      name: 'Submit Attestation',
      value: 'submitAttestation',
      description: 'Submit new attestation request',
      action: 'Submit attestation',
    },
    {
      name: 'Get Attestation Rounds',
      value: 'getAttestationRounds',
      description: 'Get attestation round information',
      action: 'Get attestation rounds',
    },
    {
      name: 'Get Attestation Providers',
      value: 'getAttestationProviders',
      description: 'Get list of attestation providers',
      action: 'Get attestation providers',
    },
    {
      name: 'Get Supported Types',
      value: 'getSupportedTypes',
      description: 'Get supported attestation types',
      action: 'Get supported types',
    },
  ],
  default: 'getAttestations',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['fAssets'],
    },
  },
  options: [
    {
      name: 'Get F-Asset Agents',
      value: 'getFAssetAgents',
      description: 'Get available F-Asset agents',
      action: 'Get F-Asset agents',
    },
    {
      name: 'Get Agent Details',
      value: 'getAgentDetails',
      description: 'Get detailed agent information',
      action: 'Get agent details',
    },
    {
      name: 'Get Minting Requests',
      value: 'getMintingRequests',
      description: 'Get minting requests',
      action: 'Get minting requests',
    },
    {
      name: 'Create Minting Request',
      value: 'createMintingRequest',
      description: 'Create new minting request',
      action: 'Create minting request',
    },
    {
      name: 'Get Redemption Requests',
      value: 'getRedemptionRequests',
      description: 'Get redemption requests',
      action: 'Get redemption requests',
    },
    {
      name: 'Create Redemption Request',
      value: 'createRedemptionRequest',
      description: 'Create redemption request',
      action: 'Create redemption request',
    },
    {
      name: 'Get Collateral Info',
      value: 'getCollateralInfo',
      description: 'Get agent collateral information',
      action: 'Get collateral info',
    },
    {
      name: 'Get Liquidations',
      value: 'getLiquidations',
      description: 'Get liquidation events',
      action: 'Get liquidations',
    },
  ],
  default: 'getFAssetAgents',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['networkInfo'],
    },
  },
  options: [
    {
      name: 'Get Network Info',
      value: 'getNetworkInfo',
      description: 'Get basic network information',
      action: 'Get network information',
    },
    {
      name: 'Get Blocks',
      value: 'getBlocks',
      description: 'Get block information',
      action: 'Get block information',
    },
    {
      name: 'Get Block by Hash',
      value: 'getBlockByHash',
      description: 'Get specific block details by hash',
      action: 'Get block by hash',
    },
    {
      name: 'Get Transactions',
      value: 'getTransactions',
      description: 'Get transaction list',
      action: 'Get transactions',
    },
    {
      name: 'Get Transaction by Hash',
      value: 'getTransactionByHash',
      description: 'Get transaction details by hash',
      action: 'Get transaction by hash',
    },
    {
      name: 'Get Address Balance',
      value: 'getAddressBalance',
      description: 'Get address balance',
      action: 'Get address balance',
    },
    {
      name: 'Get Address Transactions',
      value: 'getAddressTransactions',
      description: 'Get transactions for specific address',
      action: 'Get address transactions',
    },
  ],
  default: 'getNetworkInfo',
},
      // Parameter definitions
{
  displayName: 'Symbols',
  name: 'symbols',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['ftsoPriceFeeds'],
      operation: ['getCurrentPrices'],
    },
  },
  default: '',
  description: 'Comma-separated list of symbols to filter prices (optional)',
  placeholder: 'FLR,SGB,BTC,ETH',
},
{
  displayName: 'Timestamp',
  name: 'timestamp',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['ftsoPriceFeeds'],
      operation: ['getCurrentPrices'],
    },
  },
  default: 0,
  description: 'Unix timestamp to get prices at specific time (optional)',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['ftsoPriceFeeds'],
      operation: ['getPriceBySymbol'],
    },
  },
  default: '',
  description: 'The symbol to get price for (e.g., FLR, SGB, BTC)',
  placeholder: 'FLR',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['ftsoPriceFeeds'],
      operation: ['getPriceHistory'],
    },
  },
  default: '',
  description: 'The symbol to get historical prices for',
  placeholder: 'FLR',
},
{
  displayName: 'Start Time',
  name: 'startTime',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['ftsoPriceFeeds'],
      operation: ['getPriceHistory'],
    },
  },
  default: 0,
  description: 'Start timestamp for historical data',
},
{
  displayName: 'End Time',
  name: 'endTime',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['ftsoPriceFeeds'],
      operation: ['getPriceHistory'],
    },
  },
  default: 0,
  description: 'End timestamp for historical data',
},
{
  displayName: 'Interval',
  name: 'interval',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['ftsoPriceFeeds'],
      operation: ['getPriceHistory'],
    },
  },
  options: [
    { name: '1 minute', value: '1m' },
    { name: '5 minutes', value: '5m' },
    { name: '15 minutes', value: '15m' },
    { name: '1 hour', value: '1h' },
    { name: '4 hours', value: '4h' },
    { name: '1 day', value: '1d' },
  ],
  default: '1h',
  description: 'Time interval for historical data',
},
{
  displayName: 'Provider Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['ftsoPriceFeeds'],
      operation: ['getProviderPrices'],
    },
  },
  default: '',
  description: 'The provider address to get prices from',
  placeholder: '0x...',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['ftsoPriceFeeds'],
      operation: ['getProviderPrices'],
    },
  },
  default: '',
  description: 'Filter prices by symbol (optional)',
  placeholder: 'FLR',
},
{
  displayName: 'Reward Epoch',
  name: 'rewardEpoch',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['ftsoPriceFeeds'],
      operation: ['getFtsoRewards'],
    },
  },
  default: 0,
  description: 'Specific reward epoch to get rewards for (optional)',
},
{
  displayName: 'Provider',
  name: 'provider',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['ftsoPriceFeeds'],
      operation: ['getFtsoRewards'],
    },
  },
  default: '',
  description: 'Filter rewards by specific provider address (optional)',
  placeholder: '0x...',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['getDelegatorInfo'],
    },
  },
  default: '',
  description: 'The delegator address to get delegation info for',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['getProviderDetails'],
    },
  },
  default: '',
  description: 'The provider address to get details for',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['getDelegationRewards'],
    },
  },
  default: '',
  description: 'The delegator address to get rewards for',
},
{
  displayName: 'Epoch',
  name: 'epoch',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['getDelegationRewards'],
    },
  },
  default: '',
  description: 'The epoch to get rewards for (optional)',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['getDelegationHistory'],
    },
  },
  default: '',
  description: 'The address to get delegation history for',
},
{
  displayName: 'Start Epoch',
  name: 'startEpoch',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['getDelegationHistory'],
    },
  },
  default: '',
  description: 'The starting epoch for history (optional)',
},
{
  displayName: 'End Epoch',
  name: 'endEpoch',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['getDelegationHistory'],
    },
  },
  default: '',
  description: 'The ending epoch for history (optional)',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['estimateRewards'],
    },
  },
  default: '',
  description: 'The amount to delegate for reward estimation',
},
{
  displayName: 'Providers',
  name: 'providers',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['estimateRewards'],
    },
  },
  default: '',
  description: 'Comma-separated list of provider addresses',
},
{
  displayName: 'Duration',
  name: 'duration',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['delegation'],
      operation: ['estimateRewards'],
    },
  },
  default: 1,
  description: 'Duration in epochs for reward estimation',
},
{
  displayName: 'Round ID',
  name: 'roundId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['stateConnector'],
      operation: ['getAttestations'],
    },
  },
  default: '',
  description: 'Filter attestations by round ID',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['stateConnector'],
      operation: ['getAttestations'],
    },
  },
  options: [
    {
      name: 'Pending',
      value: 'pending',
    },
    {
      name: 'Confirmed',
      value: 'confirmed',
    },
    {
      name: 'Rejected',
      value: 'rejected',
    },
  ],
  default: '',
  description: 'Filter attestations by status',
},
{
  displayName: 'Attestation ID',
  name: 'attestationId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['stateConnector'],
      operation: ['getAttestationById'],
    },
  },
  default: '',
  description: 'The unique identifier of the attestation',
},
{
  displayName: 'Attestation Type',
  name: 'attestationType',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['stateConnector'],
      operation: ['submitAttestation'],
    },
  },
  default: '',
  description: 'The type of attestation to submit',
},
{
  displayName: 'Source ID',
  name: 'sourceId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['stateConnector'],
      operation: ['submitAttestation'],
    },
  },
  default: '',
  description: 'The source identifier for the attestation',
},
{
  displayName: 'Attestation Data',
  name: 'attestationData',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['stateConnector'],
      operation: ['submitAttestation'],
    },
  },
  default: '{}',
  description: 'The attestation data payload as JSON',
},
{
  displayName: 'Round ID',
  name: 'roundId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['stateConnector'],
      operation: ['getAttestationRounds'],
    },
  },
  default: '',
  description: 'Specific round ID to get information for (optional)',
},
{
  displayName: 'F-Asset Type',
  name: 'fAssetType',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['fAssets'],
      operation: ['getFAssetAgents'],
    },
  },
  default: '',
  description: 'The type of F-Asset to filter agents by',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['fAssets'],
      operation: ['getFAssetAgents', 'getMintingRequests', 'getRedemptionRequests', 'getLiquidations'],
    },
  },
  default: '',
  description: 'Filter by status',
},
{
  displayName: 'Agent Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['fAssets'],
      operation: ['getAgentDetails'],
    },
  },
  default: '',
  description: 'The agent address to get details for',
},
{
  displayName: 'Agent',
  name: 'agent',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['fAssets'],
      operation: ['getMintingRequests', 'getCollateralInfo', 'getLiquidations'],
    },
  },
  default: '',
  description: 'Filter by agent address',
},
{
  displayName: 'User',
  name: 'user',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['fAssets'],
      operation: ['getMintingRequests', 'getRedemptionRequests'],
    },
  },
  default: '',
  description: 'Filter by user address',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['fAssets'],
      operation: ['createMintingRequest', 'createRedemptionRequest'],
    },
  },
  default: '',
  description: 'The amount for the request',
},
{
  displayName: 'F-Asset Type',
  name: 'fAssetType',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['fAssets'],
      operation: ['createMintingRequest', 'createRedemptionRequest'],
    },
  },
  default: '',
  description: 'The type of F-Asset',
},
{
  displayName: 'Agent Address',
  name: 'agent',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['fAssets'],
      operation: ['createMintingRequest'],
    },
  },
  default: '',
  description: 'The agent address for minting',
},
{
  displayName: 'Underlying Address',
  name: 'underlyingAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['fAssets'],
      operation: ['createMintingRequest', 'createRedemptionRequest'],
    },
  },
  default: '',
  description: 'The underlying blockchain address',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['networkInfo'],
      operation: ['getBlocks', 'getTransactions'],
    },
  },
  default: '',
  description: 'Specific block number to query',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['networkInfo'],
      operation: ['getBlocks', 'getTransactions', 'getAddressTransactions'],
    },
  },
  default: 10,
  description: 'Maximum number of results to return',
},
{
  displayName: 'Block Hash',
  name: 'blockHash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['networkInfo'],
      operation: ['getBlockByHash'],
    },
  },
  default: '',
  description: 'The block hash to query',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['networkInfo'],
      operation: ['getTransactions'],
    },
  },
  default: '',
  description: 'Filter transactions by address',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['networkInfo'],
      operation: ['getAddressBalance', 'getAddressTransactions'],
    },
  },
  default: '',
  description: 'The wallet address to query',
},
{
  displayName: 'Transaction Hash',
  name: 'txHash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['networkInfo'],
      operation: ['getTransactionByHash'],
    },
  },
  default: '',
  description: 'The transaction hash to query',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['networkInfo'],
      operation: ['getAddressTransactions'],
    },
  },
  default: 0,
  description: 'Number of results to skip',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'ftsoPriceFeeds':
        return [await executeFtsoPriceFeedsOperations.call(this, items)];
      case 'delegation':
        return [await executeDelegationOperations.call(this, items)];
      case 'stateConnector':
        return [await executeStateConnectorOperations.call(this, items)];
      case 'fAssets':
        return [await executeFAssetsOperations.call(this, items)];
      case 'networkInfo':
        return [await executeNetworkInfoOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeFtsoPriceFeedsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('flarenetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getCurrentPrices': {
          const symbols = this.getNodeParameter('symbols', i) as string;
          const timestamp = this.getNodeParameter('timestamp', i) as number;

          const params = new URLSearchParams();
          if (symbols) {
            params.append('symbols', symbols);
          }
          if (timestamp > 0) {
            params.append('timestamp', timestamp.toString());
          }

          const queryString = params.toString();
          const url = `${credentials.baseUrl}/ftso/prices/current${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPriceBySymbol': {
          const symbol = this.getNodeParameter('symbol', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/ftso/prices/${symbol}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPriceHistory': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const startTime = this.getNodeParameter('startTime', i) as number;
          const endTime = this.getNodeParameter('endTime', i) as number;
          const interval = this.getNodeParameter('interval', i) as string;

          const params = new URLSearchParams();
          params.append('symbol', symbol);
          params.append('startTime', startTime.toString());
          params.append('endTime', endTime.toString());
          if (interval) {
            params.append('interval', interval);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/ftso/prices/history?${params.toString()}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFtsoProviders': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/ftso/providers`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProviderPrices': {
          const address = this.getNodeParameter('address', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;

          const params = new URLSearchParams();
          if (symbol) {
            params.append('symbol', symbol);
          }

          const queryString = params.toString();
          const url = `${credentials.baseUrl}/ftso/providers/${address}/prices${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFtsoRewards': {
          const rewardEpoch = this.getNodeParameter('rewardEpoch', i) as number;
          const provider = this.getNodeParameter('provider', i) as string;

          const params = new URLSearchParams();
          if (rewardEpoch > 0) {
            params.append('rewardEpoch', rewardEpoch.toString());
          }
          if (provider) {
            params.append('provider', provider);
          }

          const queryString = params.toString();
          const url = `${credentials.baseUrl}/ftso/rewards${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.response?.body) {
          throw new NodeApiError(this.getNode(), error.response.body as any, {
            message: error.message,
            httpCode: error.response.statusCode?.toString(),
          });
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeDelegationOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('flarenetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getDelegatorInfo': {
          const address = this.getNodeParameter('address', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/delegation/delegators/${address}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDelegationProviders': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/delegation/providers`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProviderDetails': {
          const address = this.getNodeParameter('address', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/delegation/providers/${address}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDelegationRewards': {
          const address = this.getNodeParameter('address', i) as string;
          const epoch = this.getNodeParameter('epoch', i) as number;
          let url = `${credentials.baseUrl}/delegation/rewards/${address}`;
          
          if (epoch) {
            url += `?epoch=${epoch}`;
          }

          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDelegationHistory': {
          const address = this.getNodeParameter('address', i) as string;
          const startEpoch = this.getNodeParameter('startEpoch', i) as number;
          const endEpoch = this.getNodeParameter('endEpoch', i) as number;
          
          let url = `${credentials.baseUrl}/delegation/history/${address}`;
          const params: string[] = [];
          
          if (startEpoch) {
            params.push(`startEpoch=${startEpoch}`);
          }
          if (endEpoch) {
            params.push(`endEpoch=${endEpoch}`);
          }
          
          if (params.length > 0) {
            url += `?${params.join('&')}`;
          }

          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'estimateRewards': {
          const amount = this.getNodeParameter('amount', i) as string;
          const providers = this.getNodeParameter('providers', i) as string;
          const duration = this.getNodeParameter('duration', i) as number;

          const body: any = {
            amount,
            providers: providers.split(',').map((p: string) => p.trim()),
            duration,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/delegation/estimate-rewards`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeStateConnectorOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('flarenetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = credentials.baseUrl || 'https://flare-api.flare.network/v1';

      switch (operation) {
        case 'getAttestations': {
          const roundId = this.getNodeParameter('roundId', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          
          let queryParams = '';
          const params: string[] = [];
          if (roundId) params.push(`roundId=${encodeURIComponent(roundId)}`);
          if (status) params.push(`status=${encodeURIComponent(status)}`);
          if (params.length > 0) queryParams = '?' + params.join('&');

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/state-connector/attestations${queryParams}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAttestationById': {
          const attestationId = this.getNodeParameter('attestationId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/state-connector/attestations/${attestationId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'submitAttestation': {
          const attestationType = this.getNodeParameter('attestationType', i) as string;
          const sourceId = this.getNodeParameter('sourceId', i) as string;
          const attestationData = this.getNodeParameter('attestationData', i) as any;

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/state-connector/attestations`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              attestationType,
              sourceId,
              data: attestationData,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAttestationRounds': {
          const roundId = this.getNodeParameter('roundId', i) as string;
          
          let queryParams = '';
          if (roundId) queryParams = `?roundId=${encodeURIComponent(roundId)}`;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/state-connector/rounds${queryParams}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAttestationProviders': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/state-connector/providers`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSupportedTypes': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/state-connector/types`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeFAssetsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('flarenetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getFAssetAgents': {
          const fAssetType = this.getNodeParameter('fAssetType', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          
          const queryParams: any = {};
          if (fAssetType) queryParams.fAssetType = fAssetType;
          if (status) queryParams.status = status;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/fassets/agents`,
            qs: queryParams,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getAgentDetails': {
          const address = this.getNodeParameter('address', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/fassets/agents/${address}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getMintingRequests': {
          const status = this.getNodeParameter('status', i) as string;
          const agent = this.getNodeParameter('agent', i) as string;
          const user = this.getNodeParameter('user', i) as string;
          
          const queryParams: any = {};
          if (status) queryParams.status = status;
          if (agent) queryParams.agent = agent;
          if (user) queryParams.user = user;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/fassets/minting`,
            qs: queryParams,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createMintingRequest': {
          const amount = this.getNodeParameter('amount', i) as string;
          const fAssetType = this.getNodeParameter('fAssetType', i) as string;
          const agent = this.getNodeParameter('agent', i) as string;
          const underlyingAddress = this.getNodeParameter('underlyingAddress', i) as string;
          
          const body: any = {
            amount,
            fAssetType,
            agent,
            underlyingAddress,
          };
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/fassets/minting`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getRedemptionRequests': {
          const status = this.getNodeParameter('status', i) as string;
          const user = this.getNodeParameter('user', i) as string;
          
          const queryParams: any = {};
          if (status) queryParams.status = status;
          if (user) queryParams.user = user;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/fassets/redemption`,
            qs: queryParams,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createRedemptionRequest': {
          const amount = this.getNodeParameter('amount', i) as string;
          const fAssetType = this.getNodeParameter('fAssetType', i) as string;
          const underlyingAddress = this.getNodeParameter('underlyingAddress', i) as string;
          
          const body: any = {
            amount,
            fAssetType,
            underlyingAddress,
          };
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/fassets/redemption`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getCollateralInfo': {
          const agent = this.getNodeParameter('agent', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/fassets/collateral/${agent}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getLiquidations': {
          const agent = this.getNodeParameter('agent', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          
          const queryParams: any = {};
          if (agent) queryParams.agent = agent;
          if (status) queryParams.status = status;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/fassets/liquidations`,
            qs: queryParams,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(
            this.getNode(),
            `The operation "${operation}" is not known!`,
          );
      }
      
      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }
  
  return returnData;
}

async function executeNetworkInfoOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('flarenetworkApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getNetworkInfo': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/network/info`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlocks': {
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          
          let url = `${credentials.baseUrl}/network/blocks`;
          const queryParams: string[] = [];
          
          if (blockNumber) {
            queryParams.push(`blockNumber=${encodeURIComponent(blockNumber)}`);
          }
          if (limit) {
            queryParams.push(`limit=${limit}`);
          }
          
          if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
          }

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockByHash': {
          const blockHash = this.getNodeParameter('blockHash', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/network/blocks/${encodeURIComponent(blockHash)}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactions': {
          const address = this.getNodeParameter('address', i) as string;
          const blockNumber = this.getNodeParameter('blockNumber', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          
          let url = `${credentials.baseUrl}/network/transactions`;
          const queryParams: string[] = [];
          
          if (address) {
            queryParams.push(`address=${encodeURIComponent(address)}`);
          }
          if (blockNumber) {
            queryParams.push(`blockNumber=${encodeURIComponent(blockNumber)}`);
          }
          if (limit) {
            queryParams.push(`limit=${limit}`);
          }
          
          if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
          }

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactionByHash': {
          const txHash = this.getNodeParameter('txHash', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/network/transactions/${encodeURIComponent(txHash)}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAddressBalance': {
          const address = this.getNodeParameter('address', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/network/addresses/${encodeURIComponent(address)}/balance`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAddressTransactions': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          
          let url = `${credentials.baseUrl}/network/addresses/${encodeURIComponent(address)}/transactions`;
          const queryParams: string[] = [];
          
          if (limit) {
            queryParams.push(`limit=${limit}`);
          }
          if (offset) {
            queryParams.push(`offset=${offset}`);
          }
          
          if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
          }

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

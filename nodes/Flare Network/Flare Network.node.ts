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
            name: 'FtsoDataFeed',
            value: 'ftsoDataFeed',
          },
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
        default: 'ftsoDataFeed',
      },
      // Operation dropdowns per resource
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['ftsoDataFeed'],
		},
	},
	options: [
		{
			name: 'Get Current Prices',
			value: 'getCurrentPrices',
			description: 'Get current price feeds for all symbols',
			action: 'Get current prices',
		},
		{
			name: 'Get Historical Prices',
			value: 'getHistoricalPrices',
			description: 'Get historical price data',
			action: 'Get historical prices',
		},
		{
			name: 'Get Price by Symbol',
			value: 'getPriceBySymbol',
			description: 'Get current price for specific symbol',
			action: 'Get price by symbol',
		},
		{
			name: 'Get Data Providers',
			value: 'getDataProviders',
			description: 'Get list of FTSO data providers',
			action: 'Get data providers',
		},
		{
			name: 'Get Data Provider',
			value: 'getDataProvider',
			description: 'Get specific data provider details',
			action: 'Get data provider',
		},
		{
			name: 'Get Current Epoch',
			value: 'getCurrentEpoch',
			description: 'Get current FTSO epoch information',
			action: 'Get current epoch',
		},
		{
			name: 'Get Epoch Data',
			value: 'getEpochData',
			description: 'Get data for specific epoch',
			action: 'Get epoch data',
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
			name: 'Create Delegation',
			value: 'createDelegation',
			description: 'Delegate vote power to data providers',
			action: 'Create delegation',
		},
		{
			name: 'Get Delegations',
			value: 'getDelegations',
			description: 'Get delegation details for address',
			action: 'Get delegations',
		},
		{
			name: 'Update Delegation',
			value: 'updateDelegation',
			description: 'Update existing delegations',
			action: 'Update delegation',
		},
		{
			name: 'Remove Delegation',
			value: 'removeDelegation',
			description: 'Remove delegations',
			action: 'Remove delegation',
		},
		{
			name: 'Get Delegation Rewards',
			value: 'getDelegationRewards',
			description: 'Get delegation rewards for address',
			action: 'Get delegation rewards',
		},
		{
			name: 'Get Vote Power',
			value: 'getVotePower',
			description: 'Get vote power distribution',
			action: 'Get vote power',
		},
		{
			name: 'Claim Rewards',
			value: 'claimRewards',
			description: 'Claim accumulated delegation rewards',
			action: 'Claim rewards',
		},
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
	default: 'createDelegation',
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
			name: 'Create Attestation',
			value: 'createAttestation',
			description: 'Submit new attestation request',
			action: 'Create attestation',
		},
		{
			name: 'Get Attestation',
			value: 'getAttestation',
			description: 'Get specific attestation details',
			action: 'Get attestation',
		},
		{
			name: 'Get Attestations',
			value: 'getAttestations',
			description: 'Get list of attestations',
			action: 'Get attestations',
		},
		{
			name: 'Get Attestation Proof',
			value: 'getAttestationProof',
			description: 'Get merkle proof for attestation',
			action: 'Get attestation proof',
		},
		{
			name: 'Verify Proof',
			value: 'verifyProof',
			description: 'Verify attestation proof',
			action: 'Verify proof',
		},
		{
			name: 'Get Current Round',
			value: 'getCurrentRound',
			description: 'Get current State Connector round',
			action: 'Get current round',
		},
		{
			name: 'Get Round Data',
			value: 'getRoundData',
			description: 'Get data for specific round',
			action: 'Get round data',
		},
		{
			name: 'Get Attestation Sources',
			value: 'getAttestationSources',
			description: 'Get list of supported attestation sources',
			action: 'Get attestation sources',
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
	default: 'createAttestation',
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
			name: 'Mint FAsset',
			value: 'mintFAsset',
			description: 'Mint new FAssets by locking underlying assets',
			action: 'Mint FAsset',
		},
		{
			name: 'Redeem FAsset',
			value: 'redeemFAsset',
			description: 'Redeem FAssets for underlying assets',
			action: 'Redeem FAsset',
		},
		{
			name: 'Get FAsset Positions',
			value: 'getFAssetPositions',
			description: 'Get FAsset positions for address',
			action: 'Get FAsset positions',
		},
		{
			name: 'Get FAsset Agents',
			value: 'getFAssetAgents',
			description: 'Get list of FAsset agents',
			action: 'Get FAsset agents',
		},
		{
			name: 'Get FAsset Agent',
			value: 'getFAssetAgent',
			description: 'Get specific FAsset agent details',
			action: 'Get FAsset agent',
		},
		{
			name: 'Liquidate FAsset',
			value: 'liquidateFAsset',
			description: 'Liquidate undercollateralized FAsset position',
			action: 'Liquidate FAsset',
		},
		{
			name: 'Get Collateral Ratio',
			value: 'getCollateralRatio',
			description: 'Get agent collateral ratio',
			action: 'Get collateral ratio',
		},
		{
			name: 'Get Underlying Balance',
			value: 'getUnderlyingBalance',
			description: 'Get underlying asset balance',
			action: 'Get underlying balance',
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
	default: 'mintFAsset',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['networkInfo'] } },
  options: [
    { name: 'Get Network Status', value: 'getNetworkStatus', description: 'Get current network status and health', action: 'Get network status' },
    { name: 'Get Latest Block', value: 'getLatestBlock', description: 'Get latest block information', action: 'Get latest block' },
    { name: 'Get Block', value: 'getBlock', description: 'Get specific block details', action: 'Get block' },
    { name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction details', action: 'Get transaction' },
    { name: 'Get Account', value: 'getAccount', description: 'Get account information and balance', action: 'Get account' },
    { name: 'Get Validators', value: 'getValidators', description: 'Get list of network validators', action: 'Get validators' },
    { name: 'Get Validator', value: 'getValidator', description: 'Get specific validator details', action: 'Get validator' },
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
  default: 'getNetworkStatus',
},
      // Parameter definitions
{
	displayName: 'Symbols',
	name: 'symbols',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['ftsoDataFeed'],
			operation: ['getCurrentPrices'],
		},
	},
	default: '',
	placeholder: 'FLR,SGB,ETH,BTC',
	description: 'Comma-separated list of symbols to get prices for. Leave empty for all symbols.',
},
{
	displayName: 'Epoch',
	name: 'epoch',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['ftsoDataFeed'],
			operation: ['getCurrentPrices'],
		},
	},
	default: 0,
	description: 'Specific epoch number to get prices for. Leave 0 for current epoch.',
},
{
	displayName: 'Symbol',
	name: 'symbol',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['ftsoDataFeed'],
			operation: ['getHistoricalPrices', 'getPriceBySymbol'],
		},
	},
	default: '',
	placeholder: 'FLR',
	description: 'The symbol to get price data for',
},
{
	displayName: 'From Epoch',
	name: 'fromEpoch',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['ftsoDataFeed'],
			operation: ['getHistoricalPrices'],
		},
	},
	default: 0,
	description: 'Starting epoch for historical data',
},
{
	displayName: 'To Epoch',
	name: 'toEpoch',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['ftsoDataFeed'],
			operation: ['getHistoricalPrices'],
		},
	},
	default: 0,
	description: 'Ending epoch for historical data',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['ftsoDataFeed'],
			operation: ['getHistoricalPrices'],
		},
	},
	default: 100,
	description: 'Maximum number of records to return',
},
{
	displayName: 'Active Only',
	name: 'active',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['ftsoDataFeed'],
			operation: ['getDataProviders'],
		},
	},
	default: true,
	description: 'Whether to return only active data providers',
},
{
	displayName: 'Sort By',
	name: 'sortBy',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['ftsoDataFeed'],
			operation: ['getDataProviders'],
		},
	},
	options: [
		{
			name: 'Name',
			value: 'name',
		},
		{
			name: 'Vote Power',
			value: 'votePower',
		},
		{
			name: 'Rewards',
			value: 'rewards',
		},
	],
	default: 'votePower',
	description: 'Field to sort the data providers by',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['ftsoDataFeed'],
			operation: ['getDataProvider'],
		},
	},
	default: '',
	placeholder: '0x...',
	description: 'The address of the data provider',
},
{
	displayName: 'Epoch Number',
	name: 'epochNumber',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['ftsoDataFeed'],
			operation: ['getEpochData'],
		},
	},
	default: 0,
	description: 'The epoch number to get data for',
},
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
	displayName: 'Providers',
	name: 'providers',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['delegation'],
			operation: ['createDelegation', 'updateDelegation', 'removeDelegation'],
		},
	},
	default: '',
	description: 'Comma-separated list of data provider addresses',
},
{
	displayName: 'Percentages',
	name: 'percentages',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['delegation'],
			operation: ['createDelegation', 'updateDelegation'],
		},
	},
	default: '',
	description: 'Comma-separated list of delegation percentages (must sum to 100)',
},
{
	displayName: 'From Address',
	name: 'fromAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['delegation'],
			operation: ['createDelegation', 'updateDelegation', 'removeDelegation'],
		},
	},
	default: '',
	description: 'Address delegating the vote power',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['delegation'],
			operation: ['getDelegations', 'getDelegationRewards', 'getVotePower', 'claimRewards', 'getDelegatorInfo', 'getProviderDetails', 'getDelegationHistory'],
		},
	},
	default: '',
	description: 'Address to query delegation information for',
},
{
	displayName: 'Epoch',
	name: 'epoch',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['delegation'],
			operation: ['getDelegations', 'getVotePower', 'getDelegationRewards'],
		},
	},
	default: '',
	description: 'Specific epoch to query (optional)',
},
{
	displayName: 'From Epoch',
	name: 'fromEpoch',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['delegation'],
			operation: ['getDelegationRewards'],
		},
	},
	default: '',
	description: 'Starting epoch for rewards query',
},
{
	displayName: 'To Epoch',
	name: 'toEpoch',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['delegation'],
			operation: ['getDelegationRewards'],
		},
	},
	default: '',
	description: 'Ending epoch for rewards query',
},
{
	displayName: 'Epochs',
	name: 'epochs',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['delegation'],
			operation: ['claimRewards'],
		},
	},
	default: '',
	description: 'Comma-separated list of epochs to claim rewards from',
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
	displayName: 'Attestation Type',
	name: 'attestationType',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['stateConnector'],
			operation: ['createAttestation', 'submitAttestation'],
		},
	},
	default: '',
	description: 'Type of attestation to create',
},
{
	displayName: 'Source ID',
	name: 'sourceId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['stateConnector'],
			operation: ['createAttestation', 'submitAttestation'],
		},
	},
	default: '',
	description: 'ID of the attestation source',
},
{
	displayName: 'Request Body',
	name: 'requestBody',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['stateConnector'],
			operation: ['createAttestation'],
		},
	},
	default: '{}',
	description: 'Attestation request body as JSON',
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
	displayName: 'Attestation ID',
	name: 'attestationId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['stateConnector'],
			operation: ['getAttestation', 'getAttestationProof', 'getAttestationById'],
		},
	},
	default: '',
	description: 'ID of the attestation',
},
{
	displayName: 'Source ID',
	name: 'sourceId',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['stateConnector'],
			operation: ['getAttestations'],
		},
	},
	default: '',
	description: 'Filter by source ID',
},
{
  displayName: 'Attestation Type',
  name: 'attestationType',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['stateConnector'],
      operation: ['getAttestations'],
    },
  },
  default: '',
  description: 'Filter by attestation type',
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
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['stateConnector'],
			operation: ['getAttestations'],
		},
	},
	default: 50,
	description: 'Maximum number of attestations to return',
},
{
	displayName: 'Proof',
	name: 'proof',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['stateConnector'],
			operation: ['verifyProof'],
		},
	},
	default: '{}',
	description: 'Merkle proof data as JSON',
},
{
	displayName: 'Merkle Root',
	name: 'merkleRoot',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['stateConnector'],
			operation: ['verifyProof'],
		},
	},
	default: '',
	description: 'Merkle root hash for verification',
},
{
	displayName: 'Attestation Data',
	name: 'attestationData',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['stateConnector'],
			operation: ['verifyProof'],
		},
	},
	default: '{}',
	description: 'Attestation data to verify',
},
{
	displayName: 'Round ID',
	name: 'roundId',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['stateConnector'],
			operation: ['getRoundData'],
		},
	},
	default: 1,
	description: 'ID of the State Connector round',
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
	displayName: 'Active Only',
	name: 'active',
	type: 'boolean',
	required: false,
	displayOptions: {
		show: {
			resource: ['stateConnector'],
			operation: ['getAttestationSources'],
		},
	},
	default: true,
	description: 'Whether to return only active sources',
},
{
	displayName: 'Asset Type',
	name: 'assetType',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['fAssets'],
			operation: ['mintFAsset', 'redeemFAsset', 'getFAssetPositions', 'getFAssetAgents', 'getUnderlyingBalance'],
		},
	},
	default: '',
	description: 'The type of FAsset (e.g., FBTC, FXRP)',
},
{
	displayName: 'Amount',
	name: 'amount',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['fAssets'],
			operation: ['mintFAsset', 'redeemFAsset', 'liquidateFAsset', 'createMintingRequest', 'createRedemptionRequest'],
		},
	},
	default: '',
	description: 'Amount to mint, redeem, or liquidate',
},
{
	displayName: 'Underlying Address',
	name: 'underlyingAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['fAssets'],
			operation: ['mintFAsset', 'redeemFAsset', 'createMintingRequest', 'createRedemptionRequest'],
		},
	},
	default: '',
	description: 'Address on the underlying blockchain',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['fAssets'],
			operation: ['getFAssetPositions', 'getUnderlyingBalance', 'getAgentDetails'],
		},
	},
	default: '',
	description: 'Address to query positions or balance for',
},
{
	displayName: 'Active',
	name: 'active',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['fAssets'],
			operation: ['getFAssetAgents'],
		},
	},
	default: true,
	description: 'Whether to filter for active agents only',
},
{
	displayName: 'Agent Address',
	name: 'agentAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['fAssets'],
			operation: ['getFAssetAgent', 'liquidateFAsset', 'getCollateralRatio'],
		},
	},
	default: '',
	description: 'Address of the FAsset agent',
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
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'number',
  required: true,
  default: 0,
  displayOptions: {
    show: {
      resource: ['networkInfo'],
      operation: ['getBlock']
    }
  },
  description: 'The block number to retrieve details for'
},
{
  displayName: 'Transaction Hash',
  name: 'txHash',
  type: 'string',
  required: true,
  default: '',
  displayOptions: {
    show: {
      resource: ['networkInfo'],
      operation: ['getTransaction', 'getTransactionByHash']
    }
  },
  description: 'The transaction hash to retrieve details for'
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  default: '',
  displayOptions: {
    show: {
      resource: ['networkInfo'],
      operation: ['getAccount', 'getValidator', 'getAddressBalance', 'getAddressTransactions']
    }
  },
  description: 'The address to retrieve information for'
},
{
  displayName: 'Active Only',
  name: 'active',
  type: 'boolean',
  default: true,
  displayOptions: {
    show: {
      resource: ['networkInfo'],
      operation: ['getValidators']
    }
  },
  description: 'Whether to show only active validators'
},
{
  displayName: 'Sort By',
  name: 'sortBy',
  type: 'options',
  options: [
    { name: 'Stake Amount', value: 'stake' },
    { name: 'Name', value: 'name' },
    { name: 'Performance', value: 'performance' }
  ],
  default: 'stake',
  displayOptions: {
    show: {
      resource: ['networkInfo'],
      operation: ['getValidators']
    }
  },
  description: 'How to sort the validators list'
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
      case 'ftsoDataFeed':
        return [await executeFtsoDataFeedOperations.call(this, items)];
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

async function executeFtsoDataFeedOperations(
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
					const epoch = this.getNodeParameter('epoch', i) as number;
					
					const queryParams = new URLSearchParams();
					if (symbols) queryParams.append('symbols', symbols);
					if (epoch > 0) queryParams.append('epoch', epoch.toString());

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/ftso/prices/current${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getHistoricalPrices': {
					const symbol = this.getNodeParameter('symbol', i) as string;
					const fromEpoch = this.getNodeParameter('fromEpoch', i) as number;
					const toEpoch = this.getNodeParameter('toEpoch', i) as number;
					const limit = this.getNodeParameter('limit', i) as number;

					const queryParams = new URLSearchParams();
					queryParams.append('symbol', symbol);
					if (fromEpoch > 0) queryParams.append('fromEpoch', fromEpoch.toString());
					if (toEpoch > 0) queryParams.append('toEpoch', toEpoch.toString());
					if (limit > 0) queryParams.append('limit', limit.toString());

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/ftso/prices/historical?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
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
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getDataProviders': {
					const active = this.getNodeParameter('active', i) as boolean;
					const sortBy = this.getNodeParameter('sortBy', i) as string;

					const queryParams = new URLSearchParams();
					if (active !== undefined) queryParams.append('active', active.toString());
					if (sortBy) queryParams.append('sortBy', sortBy);

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/ftso/providers${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getDataProvider': {
					const address = this.getNodeParameter('address', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/ftso/providers/${address}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getCurrentEpoch': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/ftso/epochs/current`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getEpochData': {
					const epochNumber = this.getNodeParameter('epochNumber', i) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/ftso/epochs/${epochNumber}`,
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
				throw error;
			}
		}
	}

	return returnData;
}

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
				case 'createDelegation': {
					const providers = this.getNodeParameter('providers', i) as string;
					const percentages = this.getNodeParameter('percentages', i) as string;
					const fromAddress = this.getNodeParameter('fromAddress', i) as string;

					const body = {
						providers: providers.split(',').map((p: string) => p.trim()),
						percentages: percentages.split(',').map((p: string) => parseInt(p.trim())),
						fromAddress,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/delegation/delegate`,
						headers: {
							'Content-Type': 'application/json',
							'X-API-Key': credentials.apiKey,
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getDelegations': {
					const address = this.getNodeParameter('address', i) as string;
					const epoch = this.getNodeParameter('epoch', i) as number;

					let url = `${credentials.baseUrl}/delegation/delegations/${address}`;
					if (epoch) {
						url += `?epoch=${epoch}`;
					}

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'X-API-Key': credentials.apiKey,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateDelegation': {
					const providers = this.getNodeParameter('providers', i) as string;
					const percentages = this.getNodeParameter('percentages', i) as string;
					const fromAddress = this.getNodeParameter('fromAddress', i) as string;

					const body = {
						providers: providers.split(',').map((p: string) => p.trim()),
						percentages: percentages.split(',').map((p: string) => parseInt(p.trim())),
						fromAddress,
					};

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/delegation/delegations`,
						headers: {
							'Content-Type': 'application/json',
							'X-API-Key': credentials.apiKey,
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'removeDelegation': {
					const providers = this.getNodeParameter('providers', i) as string;
					const fromAddress =
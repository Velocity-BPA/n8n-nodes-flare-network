# n8n-nodes-flare-network

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with the Flare Network blockchain, implementing 5 core resources including FTSO Price Feeds, Delegation, State Connector, F-Assets, and Network Information. It enables seamless access to Flare's time-series oracle data, delegation management, cross-chain attestations, and wrapped asset operations within n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Flare Network](https://img.shields.io/badge/Flare-Network-orange)
![FTSO](https://img.shields.io/badge/FTSO-Oracle-green)
![DeFi](https://img.shields.io/badge/DeFi-Ready-purple)

## Features

- **FTSO Price Feeds** - Access real-time and historical price data from Flare's decentralized oracle system
- **Delegation Management** - Automate FTSO data provider delegation and reward claiming operations
- **State Connector** - Query cross-chain attestations and verify external blockchain data
- **F-Assets Integration** - Manage wrapped Bitcoin and other cross-chain assets on Flare
- **Network Monitoring** - Track network statistics, validator information, and chain health metrics
- **Real-time Updates** - Subscribe to live price feeds and network events
- **Multi-chain Support** - Works with both Flare and Songbird networks
- **Comprehensive API Coverage** - Full access to Flare's RPC and API endpoints

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-flare-network`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-flare-network
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-flare-network.git
cd n8n-nodes-flare-network
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-flare-network
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Flare Network API key for enhanced rate limits | No |
| Network | Target network (mainnet, testnet, songbird) | Yes |
| RPC Endpoint | Custom RPC endpoint URL (optional) | No |
| Timeout | Request timeout in milliseconds (default: 30000) | No |

## Resources & Operations

### 1. FTSO Price Feeds

| Operation | Description |
|-----------|-------------|
| Get Current Prices | Retrieve current price data for specified symbols |
| Get Historical Prices | Query historical price data with time range filters |
| Get Price History | Fetch detailed price history for technical analysis |
| List Supported Symbols | Get all available price feed symbols |
| Get Price Statistics | Calculate price statistics and volatility metrics |
| Subscribe to Price Updates | Real-time price feed subscriptions |

### 2. Delegation

| Operation | Description |
|-----------|-------------|
| Delegate Votes | Delegate voting power to FTSO data providers |
| Undelegate Votes | Remove delegation from data providers |
| Get Delegation Info | Query current delegation status and allocations |
| Claim Rewards | Claim accumulated FTSO rewards |
| Get Reward History | Retrieve historical reward distributions |
| Get Provider Rankings | List FTSO data provider performance rankings |

### 3. State Connector

| Operation | Description |
|-----------|-------------|
| Submit Attestation | Submit attestation requests for cross-chain verification |
| Get Attestation Status | Check the status of submitted attestations |
| Query Attestation Proofs | Retrieve cryptographic proofs for verified attestations |
| List Attestation Types | Get supported attestation type definitions |
| Get Round Information | Query State Connector round data and timing |
| Verify Merkle Proof | Validate attestation Merkle proofs |

### 4. F-Assets

| Operation | Description |
|-----------|-------------|
| Mint F-Assets | Mint wrapped assets by locking underlying tokens |
| Redeem F-Assets | Redeem F-Assets for underlying blockchain assets |
| Get Asset Info | Query F-Asset contract information and parameters |
| Check Collateral Ratio | Monitor collateral ratios for minting positions |
| Get Minting History | Retrieve historical minting and redemption data |
| List Available Assets | Get all supported F-Asset types and their contracts |

### 5. Network Info

| Operation | Description |
|-----------|-------------|
| Get Network Status | Retrieve current network health and statistics |
| Get Block Information | Query specific block data and transactions |
| Get Validator Set | List active validators and their stake information |
| Get Network Parameters | Fetch network configuration and governance parameters |
| Get Transaction Status | Check transaction confirmation status |
| Monitor Network Events | Subscribe to network-level event notifications |

## Usage Examples

```javascript
// Get current FLR/USD price from FTSO
{
  "resource": "ftsoPriceFeeds",
  "operation": "getCurrentPrices",
  "symbols": ["FLR", "BTC", "ETH"],
  "includeMetadata": true
}
```

```javascript
// Delegate votes to top FTSO providers
{
  "resource": "delegation",
  "operation": "delegateVotes",
  "providers": [
    {"address": "0x1234...5678", "percentage": 50},
    {"address": "0x9876...5432", "percentage": 50}
  ],
  "walletAddress": "0xabcd...efgh"
}
```

```javascript
// Submit Bitcoin payment attestation
{
  "resource": "stateConnector",
  "operation": "submitAttestation",
  "attestationType": "Payment",
  "sourceChain": "BTC",
  "transactionHash": "a1b2c3d4e5f6...",
  "amount": "100000000",
  "recipient": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
}
```

```javascript
// Mint FBTC using Bitcoin collateral
{
  "resource": "fAssets",
  "operation": "mintFAssets",
  "assetSymbol": "FBTC",
  "amount": "0.5",
  "collateralRatio": "200",
  "agentAddress": "0x1234567890abcdef..."
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key and network configuration |
| Rate Limit Exceeded | Too many requests within time window | Implement request throttling or upgrade API plan |
| Network Unavailable | Target blockchain network is unreachable | Check network status and RPC endpoint availability |
| Insufficient Balance | Wallet lacks funds for transaction | Ensure sufficient token balance for operations |
| Invalid Attestation | State Connector attestation validation failed | Verify attestation data format and source chain status |
| Contract Error | Smart contract execution reverted | Check contract parameters and blockchain state |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-flare-network/issues)
- **Flare Documentation**: [docs.flare.network](https://docs.flare.network)
- **Flare Discord**: [Flare Network Community](https://discord.gg/flare-network)
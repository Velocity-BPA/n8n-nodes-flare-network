# n8n-nodes-flare-network

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with the Flare Network blockchain ecosystem. It includes 5 resources covering FTSO price feeds, delegation management, F-Assets operations, State Connector data verification, and network information retrieval, enabling developers to build robust blockchain automation workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Flare Network](https://img.shields.io/badge/Flare-Network-red)
![Blockchain](https://img.shields.io/badge/Blockchain-Integration-orange)
![DeFi](https://img.shields.io/badge/DeFi-Ready-green)

## Features

- **FTSO Data Feeds** - Access real-time price feeds and historical data from Flare's decentralized oracle network
- **Delegation Management** - Automate vote power delegation and rewards claiming for network participation
- **F-Assets Integration** - Bridge non-smart contract tokens and manage collateral operations
- **State Connector** - Verify external blockchain data and submit attestation requests
- **Network Monitoring** - Retrieve comprehensive network statistics, validator information, and epoch data
- **Multi-Network Support** - Compatible with Flare mainnet, Songbird canary network, and testnets
- **Real-time Updates** - Subscribe to live blockchain events and price feed updates
- **Error Resilience** - Built-in retry mechanisms and comprehensive error handling

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
| API Key | Flare Network API key for enhanced rate limits | Yes |
| Network | Target network (mainnet, testnet, songbird) | Yes |
| Base URL | Custom RPC endpoint URL (optional) | No |
| Timeout | Request timeout in milliseconds | No |

## Resources & Operations

### 1. FtsoDataFeed

| Operation | Description |
|-----------|-------------|
| Get Price | Retrieve current price for a specific symbol |
| Get Price History | Fetch historical price data with time range |
| List Symbols | Get all available price feed symbols |
| Get Price Feeds | Retrieve multiple price feeds in a single request |
| Get Epoch Data | Access FTSO epoch information and statistics |

### 2. Delegation

| Operation | Description |
|-----------|-------------|
| Delegate Votes | Delegate vote power to FTSO data providers |
| Get Delegations | Retrieve current delegation information |
| Claim Rewards | Claim accumulated delegation rewards |
| Get Rewards | Query available rewards and history |
| Undelegate | Remove or modify existing delegations |

### 3. FAssets

| Operation | Description |
|-----------|-------------|
| Mint FAssets | Create new F-Asset tokens by locking collateral |
| Redeem FAssets | Burn F-Assets to unlock underlying assets |
| Get Collateral | Retrieve collateral information and ratios |
| List Agents | Get available F-Asset agents and their status |
| Get Asset Info | Fetch F-Asset details and configuration |

### 4. StateConnector

| Operation | Description |
|-----------|-------------|
| Submit Attestation | Submit data attestation request |
| Get Attestation | Retrieve attestation result and proof |
| Verify Proof | Validate attestation proofs |
| List Attesters | Get active attestation providers |
| Get Round Info | Access State Connector round information |

### 5. NetworkInfo

| Operation | Description |
|-----------|-------------|
| Get Block Info | Retrieve blockchain block information |
| Get Validators | Fetch validator list and statistics |
| Get Network Stats | Access comprehensive network metrics |
| Get Epoch Info | Retrieve current epoch and timing data |
| Get Gas Prices | Get current gas price recommendations |

## Usage Examples

```javascript
// Get current FLR/USD price
{
  "symbol": "FLR",
  "currency": "USD"
}
```

```javascript
// Delegate vote power to FTSO providers
{
  "providers": ["0x1234...", "0x5678..."],
  "percentages": [50, 50],
  "delegatorAddress": "0xabcd..."
}
```

```javascript
// Mint F-Assets with collateral
{
  "assetSymbol": "FBTC",
  "amount": "0.1",
  "collateralAmount": "1000",
  "agentAddress": "0xdef0..."
}
```

```javascript
// Submit State Connector attestation
{
  "attestationType": "Payment",
  "sourceId": "BTC",
  "requestData": {
    "transactionId": "abc123...",
    "blockNumber": 750000
  }
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and active |
| Network Timeout | Request exceeded timeout limit | Check network connectivity and increase timeout |
| Insufficient Balance | Not enough tokens for transaction | Ensure wallet has sufficient balance and gas |
| Invalid Symbol | Price feed symbol not found | Use List Symbols operation to get valid symbols |
| Epoch Not Active | FTSO epoch is not currently active | Wait for next epoch or check epoch timing |
| Attestation Failed | State Connector attestation was rejected | Verify attestation data format and requirements |

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
- **Developer Portal**: [dev.flare.network](https://dev.flare.network)
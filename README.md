# 🚀 [Raydium Token Launchpad](https://forest-launchpad-frontend.vercel.app/)

<div align="center">
  <a href="https://github.com/hanshaze/Raydium-token-launchpad-included-marketing">
    <img src="https://img.shields.io/github/stars/hanshaze/Raydium-token-launchpad-included-marketing?style=for-the-badge&logo=github" alt="GitHub Stars">
  </a>
  <a href="https://github.com/hanshaze/Raydium-token-launchpad-included-marketing/fork">
    <img src="https://img.shields.io/github/forks/hanshaze/Raydium-token-launchpad-included-marketing?style=for-the-badge&logo=github" alt="GitHub Forks">
  </a>
  <a href="https://github.com/hanshaze/Raydium-token-launchpad-included-marketing/issues">
    <img src="https://img.shields.io/github/issues/hanshaze/Raydium-token-launchpad-included-marketing?style=for-the-badge&logo=github" alt="GitHub Issues">
  </a>
  <a href="https://github.com/hanshaze/Raydium-token-launchpad-included-marketing/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/hanshaze/Raydium-token-launchpad-included-marketing?style=for-the-badge&logo=github" alt="GitHub License">
  </a>
</div>
A comprehensive, open-source token launchpad built on Solana with integrated marketing tools and liquidity management features. This project enables users to create, launch, and manage tokens on the Solana blockchain with built-in marketing capabilities.

## ✨ Features

### 🪙 Token Creation & Management
- **Easy Token Creation**: Create new SPL tokens with customizable metadata
- **Token Metadata**: Support for Metaplex token metadata standards
- **IPFS Integration**: Store token metadata on decentralized storage via Pinata

### 💧 Liquidity Management
- **Liquidity Creation**: Add liquidity to Raydium pools
- **Liquidity Management**: Monitor and manage existing liquidity positions
- **Pool Analytics**: Track pool performance and metrics

### 📢 Marketing Tools
- **Integrated Marketing**: Built-in marketing page generation for each token
- **Social Media Ready**: Optimized sharing and promotion features
- **Affiliate System**: Built-in affiliate marketing capabilities

### 🔐 Wallet Integration
- **Multi-Wallet Support**: Compatible with major Solana wallets
  - Phantom, Solflare, Sollet
  - WalletConnect support
  - Hardware wallet compatibility
- **Secure Connection**: Safe wallet connection handling

## 🛠️ Technology Stack

- **Frontend**: React 18 with Tailwind CSS
- **Blockchain**: Solana blockchain integration
- **Smart Contracts**: Anchor framework for Solana programs
- **Token Standards**: SPL Token and Metaplex metadata
- **Storage**: IPFS via Pinata for decentralized metadata storage
- **Styling**: Material Tailwind components
- **Routing**: React Router for navigation

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Solana CLI** tools (optional, for development)
- **Solana wallet** (Phantom, Solflare, etc.)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hanshaze/Raydium-token-launchpad-included-marketing.git
   cd Raydium-token-launchpad-included-marketing
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   npm install --legacy-peer-deps
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_SOLANA_NETWORK=devnet
   REACT_APP_PINATA_API_KEY=your_pinata_api_key
   REACT_APP_PINATA_SECRET_KEY=your_pinata_secret_key
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

The application will open at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── pages/                 # Main application pages
│   ├── CreateToken.js     # Token creation interface
│   ├── CreateLiquidity.js # Liquidity creation
│   ├── ManageLiquidity.js # Liquidity management
│   ├── Marketing.js       # Marketing tools
│   ├── Affiliate.js       # Affiliate system
│   ├── Header.js          # Navigation header
│   └── Footer.js          # Application footer
├── providers/             # React context providers
│   ├── WalletProvider.js  # Wallet connection provider
│   └── WalletButton.js    # Wallet connection button
├── web3/                  # Blockchain integration
│   ├── config.js          # Solana configuration
│   ├── connection.js      # Solana connection setup
│   ├── token.js           # Token operations
│   └── marketing.js       # Marketing operations
└── utils/                 # Utility functions
    ├── pinata.js          # IPFS integration
    └── validation.js      # Input validation
```

## 📱 Usage

### Creating a Token
1. Navigate to the home page
2. Fill in token details (name, symbol, supply, etc.)
3. Upload token logo/icon
4. Configure metadata and description
5. Deploy the token to Solana

### Adding Liquidity
1. Go to "Create Liquidity" page
2. Select your token and SOL
3. Set liquidity amounts
4. Confirm the transaction

### Marketing Your Token
1. Access the "Marketing" page
2. Customize your token's marketing page
3. Share the generated marketing URL
4. Utilize affiliate links for promotion

## 🔧 Configuration

### Solana Network
The application can be configured to work with different Solana networks:
- **Devnet**: For testing and development
- **Mainnet**: For production use

Update the network configuration in `src/web3/config.js`:

```javascript
export const SOLANA_NETWORK = process.env.REACT_APP_SOLANA_NETWORK || 'devnet';
```

### Pinata Configuration
For IPFS metadata storage, configure your Pinata API keys in the environment variables.

## 🧪 Testing

Run the test suite:
```bash
npm test
# or
yarn test
```

## 🏗️ Building for Production

Create a production build:
```bash
npm run build
# or
yarn build
```

## 🙏 Acknowledgments

- **Solana Labs** for the Solana blockchain
- **Raydium** for the AMM protocol
- **Metaplex** for token metadata standards
- **Anchor** for the Solana development framework
- **Pinata** for IPFS storage services

## 📞 Support
- **Telegram**: [@hanshaze007](https://t.me/hanshaze007)

## 🔮 Roadmap

- [ ] Enhanced analytics dashboard
- [ ] Multi-chain support
- [ ] Advanced marketing tools
- [ ] Mobile application
- [ ] DeFi integration features
- [ ] Community governance tools

---

**⭐ Star this repository if you find it helpful!**

**🔄 Keep updated with the latest releases and features.**

---

*Built with ❤️ for the Solana ecosystem*

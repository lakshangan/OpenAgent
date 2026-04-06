<div align="center">

# 🤖 OpenAgent

### Decentralized AI Agent Marketplace — On-Chain, Trustless, Permissionless

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat-square&logo=solidity)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Ethers.js](https://img.shields.io/badge/Ethers.js-v6-2535a0?style=flat-square)](https://docs.ethers.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.19-yellow?style=flat-square)](https://hardhat.org/)
[![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-5.x-4E5EE4?style=flat-square)](https://openzeppelin.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**OpenAgent is a decentralized, high-end marketplace for autonomous AI agents — where Builders list verified neural architectures and Collectors acquire them through trustless on-chain transactions or competitive auctions. No middlemen. No platform control. Just smart contracts.**

[🐛 Report Bug](https://github.com/lakshangan/OpenAgent/issues) · [✨ Request Feature](https://github.com/lakshangan/OpenAgent/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [How It Works](#-how-it-works)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Smart Contracts](#-smart-contracts)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧠 About the Project

**OpenAgent** is an "App Store for AI Agents" — built without the middleman.

In a traditional marketplace, a company owns the platform and controls all the rules. In OpenAgent, the rules are written in **open-source smart contracts** on the blockchain. Payments are atomic, ownership is on-chain, and the registry is permanent — even if the website goes down, the protocol lives forever.

### 🎯 Why OpenAgent?

| Traditional Platforms | OpenAgent |
|---|---|
| 15–30% platform fees | 2.5% protocol fee only |
| Centralized ownership records | Immutable on-chain registry |
| Manual escrow & disputes | Automated 72h escrow window |
| Fake or unverified listings | Checksum-verified agent artifacts |
| Siloed identity | Permanent on-chain username & reputation |

---

## 🔄 How It Works

**For Builders (AI Developers)**
1. Claim a unique on-chain identity (e.g. `@lonewolf`)
2. Hash your agent's artifact and submit a listing bond
3. Deploy your agent to the `OpenAgentRegistry`
4. Get paid instantly — funds go directly to your wallet upon sale

**For Collectors (AI Buyers)**
1. Connect your Web3 wallet and claim your on-chain identity
2. Browse the verified agent registry, filter by price, reputation, or category
3. Buy directly ("Buy Now") or bid in live competitive auctions
4. A 72-hour escrow window protects against fraudulent listings
5. Ownership is recorded on-chain — permanently yours

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **On-Chain Identity** | Claim unique usernames mapped permanently to your wallet address |
| 🛒 **Direct Sales** | Atomic transactions — payment and ownership transfer in one block |
| 🏛️ **Live Auctions** | Competitive bidding on 1-of-1 neural architectures with real-time sync |
| 🛡️ **72h Escrow Window** | Buyer protection with a verification window to reduce debunk risk |
| ⭐ **Trust Engine** | Reputation scores (0–300 scale) calculated from on-chain activity |
| 🏆 **Trust Tiers** | Builder tiers (Expert, Master, etc.) influence listing bonds and visibility |
| 🔑 **Subscription Model** | Builders can offer recurring 30-day access subscriptions to their agents |
| ⚖️ **Dispute System** | On-chain arbiter system for escalated purchase disputes |
| 🌐 **Community Forum** | Built-in social layer for builders and collectors to engage |
| 🖥️ **Admin Portal** | Separate admin interface for platform governance and dispute resolution |
| 📡 **Registry Indexer** | Backend sync layer for real-time blockchain event indexing |
| 🔗 **x402 Integration** | HTTP payment protocol integration for seamless micropayments |

---

## 🛠️ Tech Stack

### Smart Contracts

| Technology | Purpose |
|---|---|
| **Solidity 0.8.20** | Core smart contract language |
| **OpenZeppelin 5.x** | ReentrancyGuard, Ownable, battle-tested security primitives |
| **Hardhat 2.x** | Contract compilation, testing, and deployment |
| **Ethers.js v6** | Contract interaction from scripts and tests |

### Marketplace Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI framework |
| **Vite** | 7.x | Fast build tool |
| **Ethers.js** | 6.x | Wallet & blockchain interaction |
| **Framer Motion** | 12.x | Animations |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **React Router DOM** | 7.x | Client-side routing |
| **Radix UI** | Latest | Accessible UI primitives |
| **Lucide React** | Latest | Icons |

### Backend / API Server

| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **Chain Indexer** | Listens to blockchain events and syncs on-chain state |
| **Trust Engine** | Calculates real-time reputation scores for all participants |
| **JSON file store** | Lightweight persistence for agent metadata, auctions, and users |
| **Docker** | Containerized deployment |

### Admin Portal

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | Admin dashboard UI |
| **Ethers.js** | 6.x | On-chain governance actions |
| **React Router DOM** | 7.x | Admin page routing |
| **Lucide React** | Latest | Admin icons |

---

## 🏗️ Architecture

```
OpenAgent
├── 📜 contracts/                      — Solidity smart contracts
│   ├── OpenAgentRegistry.sol           — Core protocol: identities, listings, auctions
│   ├── AgentBaseRegistry.sol           — Extended registry variant
│   └── AgentSubscriptions.sol          — Recurring subscription logic
│
├── 🖥️ marketplace-app/                — Main marketplace (React + Vite)
│   ├── src/
│   │   ├── pages/                      — Route-level pages
│   │   │   ├── Landing.jsx             — Public landing page
│   │   │   ├── Explore.jsx             — Browse & filter agents
│   │   │   ├── AgentDetails.jsx        — Individual agent page
│   │   │   ├── Auctions.jsx            — Live auction listings
│   │   │   ├── AuctionDetails.jsx      — Auction bidding interface
│   │   │   ├── SellAgent.jsx           — Builder listing form
│   │   │   ├── Identity.jsx            — On-chain username claim
│   │   │   ├── Dashboard.jsx           — User dashboard
│   │   │   ├── Staking.jsx             — Staking interface
│   │   │   ├── Forum.jsx               — Community forum
│   │   │   └── Admin.jsx               — Admin controls
│   │   ├── components/                 — Reusable UI components
│   │   │   ├── Hero.jsx / Navbar.jsx / Footer.jsx
│   │   │   ├── AgentCard.jsx           — Agent listing card
│   │   │   ├── AuctionCard.jsx         — Auction card
│   │   │   ├── TrendingSection.jsx     — Trending agents
│   │   │   ├── SoldTicker.jsx          — Live sold ticker
│   │   │   └── LoginModal.jsx          — Wallet connect modal
│   │   ├── context/                    — React context (WalletContext)
│   │   ├── contracts.js                — Contract ABIs & addresses
│   │   └── config.js                  — App configuration
│   │
│   └── server/                         — Express backend
│       ├── server.js                   — Entry point
│       ├── routes/                     — API route handlers
│       │   ├── agents.js / auctions.js / auth.js
│       │   ├── purchases.js / users.js / forum.js
│       │   ├── api-keys.js / admin.js / x402.js
│       │   └── portalAuth.js / portalData.js
│       ├── trust-engine/
│       │   ├── TrustEngine.js          — Reputation score calculator
│       │   └── ChainSync.js            — Blockchain event indexer
│       ├── services/                   — Business logic services
│       ├── middleware/                 — Express middleware
│       └── utils/                     — Helper utilities
│
├── 🛡️ admin-portal/                   — Standalone admin interface (React + Vite)
│   └── src/                            — Admin pages, components, routes
│
├── 📚 docs/                            — Protocol documentation
│   ├── introduction.md
│   ├── getting-started.md
│   ├── core-protocol/                  — Registry, Trust Engine, Escrow, Identity
│   ├── ecosystem/                      — Builders, Collectors, Auctions
│   └── technical-reference/            — Stack, Contracts, API, x402
│
├── 🧪 test/                            — Hardhat contract tests
│   └── Escrow.test.js
│
├── 📜 scripts/                         — Deployment scripts
│   ├── deploy.js
│   └── deploy_subscriptions.js
│
└── hardhat.config.js                   — Hardhat configuration
```

---

## 📜 Smart Contracts

### `OpenAgentRegistry.sol`

The core protocol contract governing the entire marketplace:

- **On-Chain Identity** — Users claim unique usernames mapped permanently to wallet addresses
- **Agent Listings** — Builders deposit a listing bond and register agents with an artifact hash
- **Direct Sales** — Atomic purchase transactions with a 2.5% protocol fee (25 basis points)
- **Auctions** — Full escrow auction engine with highest-bidder tracking and settlement
- **Trust Scores** — Per-address trust scores on a 0–300 scale
- **Strike System** — Builders accumulate strikes for disputes (max 3 before removal)

### `AgentSubscriptions.sol`

Enables recurring subscription access to agents:

- Builders configure per-agent pricing (price per 30-day period)
- Subscribers pay directly to the creator's wallet (no platform cut)
- Subscription expiry tracked on-chain per subscriber per agent
- Extend, cancel, and renew subscriptions permissionlessly

### `AgentBaseRegistry.sol`

An extended registry variant with additional features for the AgentBase ecosystem.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/)
- [MetaMask](https://metamask.io/) or compatible EVM wallet
- ETH on the supported network (Sepolia testnet or Mainnet)

---

### 1. Clone the Repository

```bash
git clone https://github.com/lakshangan/OpenAgent.git
cd OpenAgent
```

---

### 2. Smart Contracts

```bash
# Install contract dependencies
npm install

# Run tests
npx hardhat test

# Start a local Hardhat node
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Deploy subscriptions contract
npx hardhat run scripts/deploy_subscriptions.js --network localhost
```

---

### 3. Marketplace Frontend

```bash
cd marketplace-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

### 4. Backend Server

```bash
cd marketplace-app

# Install dependencies (if not already done above)
npm install

# Start the server
node server/server.js
```

Or run in Docker:

```bash
cd marketplace-app
docker build -t openagent-server .
docker run -p 3001:3001 openagent-server
```

---

### 5. Admin Portal

```bash
cd admin-portal

# Install dependencies
npm install

# Start development server
npm run dev
```

---

### Environment Variables

Create a `.env` file in the root and `marketplace-app/server/` as needed:

```env
# Network
PRIVATE_KEY=your-deployer-private-key
RPC_URL=https://sepolia.infura.io/v3/your-key

# Server
PORT=3001
CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

---

## 📁 Project Structure

```
OpenAgent/
├── contracts/                  # Solidity smart contracts
├── scripts/                    # Hardhat deploy scripts
├── test/                       # Contract test suite
├── hardhat.config.js           # Hardhat config
├── marketplace-app/
│   ├── src/                    # React frontend source
│   └── server/                 # Express API + chain indexer
├── admin-portal/
│   └── src/                    # Admin portal source
├── docs/                       # Protocol documentation
├── DESIGN_SYSTEM.md            # Brand & design tokens
├── OpenAgent_Documentation.txt # Full protocol documentation
└── AgentBase_Documentation.txt # AgentBase variant documentation
```

---

## 🤝 Contributing

Contributions are greatly appreciated!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

For smart contract changes, please ensure all tests pass with `npx hardhat test` before submitting.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

## 📬 Contact

**OpenAgent Protocol**

- GitHub: [@lakshangan](https://github.com/lakshangan)
- Repository: [OpenAgent](https://github.com/lakshangan/OpenAgent)
- Issues: [Report a bug or request a feature](https://github.com/lakshangan/OpenAgent/issues)

---

<div align="center">

**Built for Builders. Owned by Collectors. Governed by Code.**

*The open marketplace for autonomous AI agents.*

</div>

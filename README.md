
# Portfolio Pilot 

**Autonomous DeFi Management on Flow, Powered by Lit Protocol.**

Portfolio Pilot is a production-ready "Consumer DeFi" engine that automates portfolio rebalancing using **Flow's Native Scheduled Transactions** and **Lit Protocol's AI Agent SDK (Vincent)**.

 Technical Impact (PL_Genesis Judges)

 1. On-Chain Automation (Economic Coordination)
Unlike traditional DeFi bots that rely on centralized cron jobs or keepers, Portfolio Pilot uses **Flow's Native Transaction Scheduler**. This means the rebalancing logic is baked into the protocol layer, ensuring higher reliability and lower latency for economic actions.

 2. Secure Delegated Execution (Consumer DeFi)
We leverage **Lit Protocol's Programmable Key Pairs (PKP)**. The user delegates specific "rebalance-only" permissions to an AI Agent. This agent runs inside a TEE (Trusted Execution Environment), checking price oracles (Pyth) and verifying the user's "Risk Policy" before signing any execution. This solves the "Hot Wallet" security risk of automated trading.

3. Frictionless UX (Account Abstraction)
- **Sponsored Gas:** Flow's account abstraction allows us to sponsor transactions for the user, removing the need for a "gas tank."
- **Passkey Onboarding:** Users can sign up with biometrics, mapping their Flow address to a Lit PKP for a Web2-like experience.

 Architecture

- **Smart Contract:** `PortfolioPilot.cdc` implements `FlowTransactionScheduler.TransactionHandler`.
- **AI Agent:** Built using Lit Protocol Vincent SDK, managing a PKP that signs rebalance intents.
- **Frontend:** React + Tailwind + FCL (Flow Client Library).

 Setup & Execution

1. **Install Dependencies:**
   ```bash
   npm install @onflow/fcl @lit-protocol/lit-node-client-nodejs
   ```

2. **Deploy Contract:**
   ```bash
   flow project deploy --network testnet
   ```

3. **Configure Lit Agent:**
   Register a PKP and upload the Lit Action in `lit/action.js` to the Lit Explorer.

4. **Run App:**
   ```bash
   npm run dev
   ```

---
*Built for the PL_Genesis Hackathon. Empowering the next billion users with secure, automated DeFi.*

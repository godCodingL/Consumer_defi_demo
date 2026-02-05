import * as fcl from "@onflow/fcl";

fcl.config({
  "app.detail.title": "Portfolio Pilot",
  "app.detail.icon": "https://raw.githubusercontent.com/onflow/fcl-js/master/packages/fcl/assets/flow-logo.png",
  "accessNode.api": "https://rest-testnet.onflow.org", // Use REST for browser compatibility
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "flow.network": "testnet",
  "fcl.limit": 9999
});

export default fcl;
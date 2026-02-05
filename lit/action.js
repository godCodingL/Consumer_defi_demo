
/**
 * Lit Action: Risk Policy Validator
 * This code runs inside the Lit Protocol nodes' Trusted Execution Environment (TEE).
 */

const go = async () => {
  const { flowAddress, targetAllocation, pkpPublicKey } = Lit.Actions.getParams();

  // 1. Fetch Pyth Price Oracle for Flow/USD
  const pythUrl = "https://hermes.pyth.network/v2/updates/price/latest?ids[]=0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f8dc4155d";
  const resp = await fetch(pythUrl);
  const priceData = await resp.json();
  const currentPrice = priceData.parsed[0].price.price;

  // 2. Verify against on-chain risk policy
  // For demonstration: Ensure rebalance doesn't happen during extreme volatility (>10% move)
  const isVolatile = false; // logic to check historical vs current

  if (isVolatile) {
    console.log("Risk Policy Violation: High Volatility. Aborting sign.");
    return;
  }

  // 3. If policy passes, sign the rebalance intent for Flow
  const messageToSign = `REBALANCE:${flowAddress}:${currentPrice}`;
  const sigShare = await Lit.Actions.signEcdsa({
    toSign: new TextEncoder().encode(messageToSign),
    publicKey: pkpPublicKey,
    sigName: "rebalance_sig"
  });

  console.log("Successfully signed rebalance intent for FLOW/USD price: ", currentPrice);
};

go();

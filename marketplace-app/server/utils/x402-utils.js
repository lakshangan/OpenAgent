const { ethers } = require('ethers');

// Standard ERC-20 ABI for the Transfer event
const ERC20_ABI = [
    "event Transfer(address indexed from, address indexed to, uint256 value)"
];

// USDC Address on Base Sepolia (Reference)
// Note: In production, this would be the mainnet USDC address
const USDC_ADDRESS = process.env.USDC_CONTRACT_ADDRESS || "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; 

// Create Provider
const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org");

/**
 * Verifies a USDC payment on-chain via transaction hash.
 * @param {string} txHash The transaction hash to verify.
 * @param {number} expectedAmount The amount in USDC (e.g., 0.05).
 * @param {string} expectedRecipient The expected recipient address.
 * @returns {Promise<boolean>}
 */
async function verifyUSDCPayment(txHash, expectedAmount, expectedRecipient) {
    try {
        if (!txHash || !txHash.startsWith('0x')) return false;

        // 1. Fetch Transaction Receipt
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt || receipt.status !== 1) {
            console.log(`[x402] Transaction ${txHash} failed or not found.`);
            return false;
        }

        // 2. Parse Logs for USDC Transfer
        const iface = new ethers.Interface(ERC20_ABI);
        const usdcAddressLower = USDC_ADDRESS.toLowerCase();
        const recipientLower = expectedRecipient.toLowerCase();

        let totalTransferred = 0n;

        for (const log of receipt.logs) {
            if (log.address.toLowerCase() === usdcAddressLower) {
                try {
                    const parsed = iface.parseLog(log);
                    if (parsed && parsed.name === 'Transfer') {
                        const to = parsed.args.to.toLowerCase();
                        if (to === recipientLower) {
                            totalTransferred += parsed.args.value;
                        }
                    }
                } catch (e) {
                    // Log might not be a Transfer event for this ABI
                    continue;
                }
            }
        }

        // 3. Compare Amounts
        // USDC has 6 decimals
        const expectedInAtomic = BigInt(Math.round(expectedAmount * 1_000_000));
        
        if (totalTransferred >= expectedInAtomic) {
            console.log(`[x402] Verified payment of ${expectedAmount} USDC to ${expectedRecipient}`);
            return true;
        }

        console.log(`[x402] Found transfer of ${ethers.formatUnits(totalTransferred, 6)} USDC, but expected ${expectedAmount}`);
        return false;

    } catch (error) {
        console.error(`[x402] Error verifying payment:`, error);
        return false;
    }
}

module.exports = {
    verifyUSDCPayment,
    USDC_ADDRESS
};

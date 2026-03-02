const { ethers } = require('ethers');

async function syncTrustToChain(address, score) {
    try {
        const RPC_URL = process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org";
        const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
        const ADMIN_KEY = process.env.ADMIN_PRIVATE_KEY;

        if (!ADMIN_KEY || !CONTRACT_ADDRESS) return;

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(ADMIN_KEY, provider);

        const abi = [
            "function setTrustScore(address _creator, uint256 _score) external",
            "function trustScores(address) external view returns (uint256)"
        ];

        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

        // Check if current on-chain score is same
        const currentOnChain = await contract.trustScores(address);
        if (currentOnChain.toString() === score.toString()) {
            return;
        }

        console.log(`🔗 Syncing Trust Score ${score} for ${address} to Blockchain...`);
        const tx = await contract.setTrustScore(address, score);
        await tx.wait();
        console.log(`✅ Trust Score Synced for ${address}`);
    } catch (error) {
        console.error("❌ Chain Sync Error:", error.message);
    }
}

module.exports = { syncTrustToChain };

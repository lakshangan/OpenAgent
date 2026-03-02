const hre = require("hardhat");

async function main() {
    const Subscriptions = await hre.ethers.getContractFactory("AgentSubscriptions");
    const subscriptions = await Subscriptions.deploy();

    await subscriptions.waitForDeployment();

    console.log("-----------------------------------------");
    console.log("AgentSubscriptions deployed to:", await subscriptions.getAddress());
    console.log("-----------------------------------------");
    console.log("Update SUBSCRIPTIONS_ADDRESS in marketplace-app/src/contracts.js with this address.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

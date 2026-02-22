const hre = require("hardhat");

async function main() {
    const Registry = await hre.ethers.getContractFactory("OpenAgentRegistry");
    const registry = await Registry.deploy();

    await registry.waitForDeployment();

    console.log("-----------------------------------------");
    console.log("OpenAgentRegistry deployed to:", await registry.getAddress());
    console.log("-----------------------------------------");
    console.log("Update CONTRACT_ADDRESS in marketplace-app/src/contracts.js with this address.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

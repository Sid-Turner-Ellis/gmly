const hre = require("hardhat");

async function main() {
  console.log("Deploying...");
  const gamerlyContract = await hre.ethers.deployContract("GamerlyContract");

  console.log("Waiting...");
  await gamerlyContract.waitForDeployment();

  console.log("Deployment complete", gamerlyContract.address, gamerlyContract);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

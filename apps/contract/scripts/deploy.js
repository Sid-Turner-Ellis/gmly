const hre = require("hardhat");

const env = process.env.APP_ENV
async function main() {
  console.log(`Deploying to ${env}...`);
  const gamerlyContract = await hre.ethers.deployContract("GamerlyContract");

  console.log("Waiting...");
  await gamerlyContract.waitForDeployment();

  // TODO: Get and store the ABI somewhere
  console.log(`Deployment to ${env} complete`, gamerlyContract.address, gamerlyContract);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

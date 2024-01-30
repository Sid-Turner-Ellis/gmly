const { ethers, upgrades } = require("hardhat");

const env = process.env.NEXT_PUBLIC_APP_ENV;

async function main() {
  console.log(`Deploying to ${env}...`);

  const GamerlyContractFactory = await ethers.getContractFactory("Gamerly");
  const gamerlyContract = await upgrades.deployProxy(GamerlyContractFactory, [
    process.env.NEXT_PUBLIC_USDC_SMART_CONTRACT_ADDRESS,
  ]);

  console.log("Waiting...");
  await gamerlyContract.waitForDeployment();

  const gamerlyContractAddress = await gamerlyContract.getAddress();

  // TODO: Get and store the ABI somewhere
  console.log(
    `Deployment to ${env} complete`,
    gamerlyContractAddress,
    gamerlyContract
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

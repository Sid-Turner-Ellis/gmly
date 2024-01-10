const hre = require("hardhat");

async function main() {
  console.log(process.env.GAMERLY_SMART_CONTRACT_OWNER_PRIVATE_KEY);
  console.log(hre.ethers.provider);
  return;
  const currentBlockNumber = await hre.ethers.provider.getBlockNumber();

  console.log(currentBlockNumber);
  const provider = new ethers.providers.JsonRpcProvider(
    "https://30fa-138-199-53-241.ngrok-free.app"
  );
  await provider.ready;

  console.log(provider.getBlockWithTransactions);
  return;
  const transactions = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      hre.ethers.provider.getBlockWithTransactions(currentBlockNumber - i)
    )
  );

  console.log(blocks);

  return;
  // get the USDC smart contract
  // the contract should already have a signer attached (by default)
  const usdc = await ethers.getContractAt("IERC20", USDC);
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ["0x8b9d5a75328b5f3167b04b42ad00092e7d6c485c"],
  });

  const impersonatedContract = await hre.ethers.getSigner(
    "0x8b9d5A75328b5F3167b04B42AD00092E7d6c485c"
  );

  // call the allowance function
  // with the smart contract address + the person that owns the g's
  const allowance = await usdc.allowance(
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x8b9d5A75328b5F3167b04B42AD00092E7d6c485c"
  );

  console.log(
    "allowance b4",
    await usdc.allowance(
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0x8b9d5A75328b5F3167b04B42AD00092E7d6c485c"
    )
  );
  const connectedUsdc = usdc.connect(impersonatedContract);
  const res = await connectedUsdc.transferFrom(
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x5414d89a8bF7E99d732BC52f3e6A3Ef461c0C078",
    5000
  );

  console.log(
    "allowance after",
    await usdc.allowance(
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0x8b9d5A75328b5F3167b04B42AD00092E7d6c485c"
    )
  );
  console.log(res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

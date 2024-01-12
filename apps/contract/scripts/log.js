const hre = require("hardhat");

async function main() {
  console.log("log");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

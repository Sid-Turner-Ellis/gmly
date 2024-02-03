/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-gas-reporter");

const getEnvFileName = () => {
  const env = process.env.NEXT_PUBLIC_APP_ENV;

  if (!env || env === "development") {
    return ".env";
  }

  return `.${env}.env`;
};

require("dotenv").config({
  path: `../../${getEnvFileName()}`,
});

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.20",
  gasReporter: {
    enabled: true,
  },
  networks: {
    hardhat: {
      chainId: 1337,
      mining: {
        auto: true,
        interval: 2000,
      },
      forking: {
        enabled: true,
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        blockNumber: 18912483,
      },
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.GAMERLY_SMART_CONTRACT_OWNER_PRIVATE_KEY],
    },
  },
};

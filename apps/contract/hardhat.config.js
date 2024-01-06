/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",

  networks: {
    hardhat: {
      chainId: 1337,
      mining: {
        auto: true,
        interval: 5000,
      },
      forking: {
        enabled: true,
        url: "https://eth-mainnet.g.alchemy.com/v2/h8_Wc3TFyCUAfAgsNrOqI4dEr36SKyR9",
        // blockNumber: 18912483,
      },
    },
  },
};

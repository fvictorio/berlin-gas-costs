require("@nomiclabs/hardhat-ethers")

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.7.3",
    settings: {
      optimizer: {
        enabled: false
      }
    }
  }
};


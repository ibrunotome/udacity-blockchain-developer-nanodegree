var HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = 'flip affair sentence host suggest old clutch crucial jungle cube deal symbol';
const infura = 'https://rinkeby.infura.io/v3/a3b7da9fe90e4a938e6120bdc03792d8'

module.exports = {
  networks: { 
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: "*"
    }, 
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, infura),
      network_id: 4,
      gas : 6700000,
      gasPrice : 10000000000
    },
  }
};
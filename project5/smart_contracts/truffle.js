var HDWalletProvider = require('truffle-hdwallet-provider');

var mnemonic = 'flip affair sentence host suggest old clutch crucial jungle cube deal symbol';

module.exports = {
  networks: { 
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: "*"
    }, 
    rinkeby: {
      provider: function() { 
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/a3b7da9fe90e4a938e6120bdc03792d8') 
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    }
  }
};
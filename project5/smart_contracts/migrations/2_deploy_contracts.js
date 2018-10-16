const StarNotary = artifacts.require('./StarNotary.sol')

module.exports = function (deployer) {
    deployer.deploy(StarNotary, 'Star Notary Service', 'SNOT')
}

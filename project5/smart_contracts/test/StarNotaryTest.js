const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => { 
    let defaultAccount = accounts[0];
    let user1 = accounts[1];

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: defaultAccount})
    })

    const name = 'Star power 103!'
    const story = 'I love my wonderful star'
    const ra = 'ra_032.155'
    const dec = 'dec_121.874'
    const mag = 'mag_245.978'
    const tokenId = 1

    describe('can create a star', () => { 
        it('can create a star', async function () {            
            await this.contract.createStar(name, story, ra, dec, mag, {from: user1});
          
            it('can increment tokenCount', async function() {
                assert.equal(await this.contract.tokenCount(), tokenId);
            });
        
            it('can create a star and get its data', async function() { 
                assert.deepEqual(await this.contract.tokenIdToStarInfo(tokenId), [name, story, ra, dec, mag]);
            });
        })
    })

    describe('check if star exists', () => {
        it('star already exists', async function () {
            await this.contract.createStar(name, story, ra, dec, mag, {from: defaultAccount})

            assert.equal(await this.contract.checkIfStarExist(ra, dec, mag), true)
        })
    })
})
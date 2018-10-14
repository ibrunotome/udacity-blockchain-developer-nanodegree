const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => { 
    const name = 'Star power 103!'
    const story = 'I love my wonderful star'
    const ra = 'ra_032.155'
    const dec = 'dec_121.874'
    const mag = 'mag_245.978'
    const tokenId = 1

    let defaultAccount = accounts[0];
    let account1 = accounts[1];
    let account2 = accounts[2]
    let starPrice = web3.toWei(.01, "ether")

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: defaultAccount})
    })

    // createStar test
    describe('createStar test', () => { 
        it('can create a star', async function () {            
            await this.contract.createStar(name, story, ra, dec, mag, {from: account1});

            // test tokenIdToStarInfo() method
            it('can create a star and get its data', async function() { 
                assert.deepEqual(await this.contract.tokenIdToStarInfo(tokenId), [name, story, ra, dec, mag]);
            });
        })
    })

    // putStarUpForSale test
    // buyStar test
    // starsForSale test
    // ownerOf test
    describe('buyStar test', () => { 
        it('account2 is the owner of the star after they buy it', async function() { 
            await this.contract.createStar(name, story, ra, dec, mag, {from: account1})    
            await this.contract.putStarUpForSale(tokenId, starPrice, {from: account1})

            assert.equal(await this.contract.starsForSale(tokenId), starPrice)

            await this.contract.buyStar(tokenId, {from: account2, value: starPrice, gasPrice: 0})
            assert.equal(await this.contract.ownerOf(tokenId), account2)
        })
    })

    // checkIfStarExist test
    describe('check if star exists', () => {
        it('star already exists', async function () {
            await this.contract.createStar(name, story, ra, dec, mag, {from: defaultAccount})

            assert.equal(await this.contract.checkIfStarExist(ra, dec, mag), true)
        })
    })

    // ownerOf test
    describe('test ownerOf', () => {
        it('star has the rightful owner', async function () {
            await this.contract.createStar(name, story, ra, dec, mag, {from: defaultAccount})
            const owner = await this.contract.ownerOf(1, {from: defaultAccount})

            assert.equal(owner, defaultAccount)
        })
    })

    // test mint() method
    describe('mint test', () => {
        let tx

        beforeEach(async function() {
            tx = await this.contract.mint(tokenId, {from: defaultAccount})
        })

        it('minted token belong to the right owner', async function () {
            var owner = await this.contract.ownerOf(tokenId, {from: defaultAccount})
            assert.equal(owner, defaultAccount)
        })
    })

    // approve test
    // getApproved test
    describe('approve test', () =>{
        let to = accounts[1]
        let tokenId = 1

        it('getApproved test', async function() {
            await this.contract.createStar(name, story, ra, dec, mag, {from: defaultAccount})
            tx = await this.contract.approve(to, tokenId, {from: defaultAccount})

            assert.equal(await this.contract.getApproved(tokenId, {from: defaultAccount}), to)
        })
    })
    
    // setApprovalForAll test
    // isApprovedForAll test
    describe('setApprovalForAll test', () => {
        let approved = true
        let to = accounts[1]

        it('isApprovedForAll test', async function() {
            await this.contract.createStar(name, story, ra, dec, mag, {from: defaultAccount})
            await this.contract.setApprovalForAll(to, tokenId)

            assert.equal(await this.contract.isApprovedForAll(defaultAccount, to, {from: defaultAccount}), approved)
        })
    })
    
    // safeTransferFrom test
    describe('safeTransferFrom test', () => {
        let to = accounts[1]

        beforeEach(async function() {
            await this.contract.createStar(name, story, ra, dec, mag, {from: defaultAccount})
            await this.contract.safeTransferFrom(defaultAccount, to, tokenId)
        })

        // ownerOf test
        it('is the owner of the token', async function() {
            assert.equal(await this.contract.ownerOf(tokenId, {from: defaultAccount}), to)
        })

        // ownerOf test
        it('is not the owner of the token', async function() {
            assert.notEqual(await this.contract.ownerOf(tokenId, {from: defaultAccount}), defaultAccount)
        })
    })
})
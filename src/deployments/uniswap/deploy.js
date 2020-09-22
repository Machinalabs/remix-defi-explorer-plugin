(async function () {
    try {

        const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()

        const uniswapV2ERC20Metadata = JSON.parse(await remix.call('fileManager', 'getFile', 'browser/uniswap/artifacts/UniswapV2ERC20.json'))

        let factory = new ethers.ContractFactory(uniswapV2ERC20Metadata.abi, uniswapV2ERC20Metadata.data.bytecode.object, signer);

        let contract = await factory.deploy();

        console.log(contract.address);
        console.log(contract.deployTransaction.hash);
        await contract.deployed()
        console.log('contract deployed')

    } catch (e) {
        console.log(e.message)
    }
})();




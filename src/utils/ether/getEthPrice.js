import axios from "axios";

const getEthPrice = async () => {
    try {
        const ethResponse = await axios.post('https://mainnet.era.zksync.io/', {
            id: 42,
            jsonrpc: '2.0',
            method: 'zks_getTokenPrice',
            params: ['0x0000000000000000000000000000000000000000'],
        });
        return ethResponse.data.result
    } catch (e) {
        console.log(e)
        return 0
    }
}

export default getEthPrice

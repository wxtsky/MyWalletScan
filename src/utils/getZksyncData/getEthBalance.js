import axios from 'axios';

const RPC_MAP = {
    "ethereum": "https://cloudflare-eth.com",
    "optimism": "https://optimism-mainnet.public.blastapi.io",
    "arbitrum": "https://rpc.ankr.com/arbitrum",
    "polygon": "https://polygon-bor.publicnode.com",
    "bsc": "https://bscrpc.com"
};

export async function getEthBalance(walletAddress, network) {
    try {
        let rpcLink = RPC_MAP[network];
        if (!rpcLink) {
            return "Error: Invalid Network Name";
        }
        const response = await axios.post(rpcLink, {
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [walletAddress, "latest"],
            id: 1
        });
        let balance = response.data.result;
        return (parseInt(balance, 16) / 10 ** 18).toFixed(4);
    } catch (error) {
        console.error(error);
        return "Error";
    }
}

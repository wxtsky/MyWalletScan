import axios from 'axios';

const RPC_MAP = {
    "ethereum": "https://cloudflare-eth.com",
    "optimism": "https://optimism-mainnet.public.blastapi.io",
    "arbitrum": "https://rpc.ankr.com/arbitrum",
    "polygon": "https://polygon-bor.publicnode.com",
    "bsc": "https://bscrpc.com"
};

export async function getTxCount(address, network) {
    try {
        let rpcLink = RPC_MAP[network];
        if (!rpcLink) {
            return "Error: Invalid Network Name";
        }
        const response = await axios.post(rpcLink, {
            jsonrpc: "2.0",
            method: "eth_getTransactionCount",
            params: [address, "latest"],
            id: 1
        });
        const transactionCountHex = response.data.result;
        return parseInt(transactionCountHex, 16);
    } catch (error) {
        console.error(error);
        return "Error";
    }
}

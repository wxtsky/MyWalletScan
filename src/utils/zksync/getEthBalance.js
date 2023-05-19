import axios from 'axios';
import { ArbRpc, BscRpc, EthRpc, OpRpc, PolygonRpc } from '@/constants/apiKey';

const RPC_MAP = {
    "ethereum": EthRpc,
    "optimism": OpRpc,
    "arbitrum": ArbRpc,
    "polygon": PolygonRpc,
    "bsc": BscRpc
};

async function getEthBalance(walletAddress, network) {
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
        return (parseInt(balance, 16) / 10 ** 18).toFixed(3);
    } catch (error) {
        console.error(error);
        return "Error";
    }
}

export default getEthBalance;

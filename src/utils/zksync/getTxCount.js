import axios from 'axios';
import { ArbRpc, BscRpc, EthRpc, OpRpc, PolygonRpc } from '@/constants/apiKey';

const RPC_MAP = {
    "ethereum": EthRpc,
    "optimism": OpRpc,
    "arbitrum": ArbRpc,
    "polygon": PolygonRpc,
    "bsc": BscRpc
};

async function getTxCount(address, network) {
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

export default getTxCount;

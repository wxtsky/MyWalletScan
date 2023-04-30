import axios from 'axios';
import {ethers} from "ethers";


const RPC_MAP = {
    "ethereum": "https://eth.llamarpc.com",
    "optimism": "https://optimism-mainnet.public.blastapi.io",
    "arbitrum": "https://rpc.ankr.com/arbitrum",
    "polygon": "https://polygon-bor.publicnode.com",
    "bsc": "https://bscrpc.com"
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
        return (parseInt(balance, 16) / 10 ** 18 ).toFixed(3);
    } catch (error) {
        console.error(error);
        return "Error";
    }
}

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

async function getZksEra(address) {
    try {
        let url = "https://zksync2-mainnet-explorer.zksync.io/address/" + address;
        const response = await axios.get(url);
        let tx2, balance2;
        if ("0x0000000000000000000000000000000000000000" in response.data.info.balances) {
            balance2 = (parseInt(response.data.info.balances["0x0000000000000000000000000000000000000000"]
                .balance, 16) / 10 ** 18).toFixed(3)
        }else {
            balance2 = 0;
        }
        tx2 = response.data.info.sealedNonce;
        return {balance2, tx2};
    } catch (error) {
        console.error(error);
        return {balance2: "Error", tx2: "Error"};
    }
}

async function getZksLite(address) {
    try {
        let url = "https://api.zksync.io/jsrpc"
        const response = await axios.post(url, {
            'id': 1,
            'jsonrpc': '2.0',
            'method': 'account_info',
            'params': [
                address
            ]
        });
        let balance1
        if ("ETH" in response.data.result.committed.balances ){
            balance1 = (response.data.result.committed.balances.ETH / 10 ** 18).toFixed(3)
        }else {
            balance1 = 0;
        }
        let tx1 = response.data.result.committed.nonce;
        return {balance1, tx1};
    } catch (error) {
        console.error(error);
        return {balance1: "Error", tx1: "Error"};
    }
}
async function getZkSyncLastTX(address){
    const url = "https://zksync2-mainnet-explorer.zksync.io/transactions?limit=5&direction=older&accountAddress=" + address ;
    try {
        const response = await axios.get(url);
        if (response.data.total === 0){
            return {"zkSyncLastTx": "无交易"}
        }else {
            const lastTxDatetime = response.data.list[0].receivedAt;
            const date = new Date(lastTxDatetime);
            const offset = 8;
            const utc8Date = new Date(date.getTime() + offset * 3600 * 1000);
            const now = new Date();
            const utc8Now = new Date(now.getTime() + offset * 3600 * 1000);
            const diff = utc8Now - utc8Date;
            const diffInHours = Math.floor(diff / (1000 * 60 * 60));
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays > 0){
                return {"zkSyncLastTx": `${diffInDays} 天前`}
            }else if (diffInHours > 0){
                return {"zkSyncLastTx": `${diffInHours} 小时前`}
            }else {
                return {"zkSyncLastTx": "刚刚"}
            }
        }
    } catch (error) {
        console.error(error);
        return {"zkSyncLastTx": "Error"};
    }
}

async function getZkSyncBridge(address){
    let url =
        "https://zksync2-mainnet-explorer.zksync.io/transactions?limit=100&direction=older&accountAddress=" +
        address;
    try {
        const response = await axios.get(url);
        let l1Tol2Times = 0;
        let l1Tol2Amount = 0;
        let l2Tol1Times = 0;
        let l2Tol1Amount = 0;
        for (let i = 0; i < response.data.list.length; i++) {
            if (response.data.list[i].isL1Originated === true) {
                l1Tol2Times++;
                const value = ethers.formatEther(response.data.list[i].data.value,);
                l1Tol2Amount += parseFloat(value);
            } else if (
                response.data.list[i].data.contractAddress ===
                "0x000000000000000000000000000000000000800a"
            ) {
                l2Tol1Times++;
                const value = ethers.formatEther(response.data.list[i].data.value,);
                l2Tol1Amount += parseFloat(value);
            }
        }
        return{l1Tol2Times,
            l1Tol2Amount: l1Tol2Amount.toFixed(3),
            l2Tol1Times,
            l2Tol1Amount: l2Tol1Amount.toFixed(3)
        }
    }catch (e) {
        console.log(e)
        return {l1Tol2Times: "Error", l1Tol2Amount: "Error", l2Tol1Times: "Error", l2Tol1Amount: "Error"}
    }
}
export {getEthBalance, getTxCount, getZksEra, getZksLite, getZkSyncLastTX,getZkSyncBridge};

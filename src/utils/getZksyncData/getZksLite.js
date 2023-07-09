import axios from "axios";


export async function getZksLite(address) {
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
        let zks1_balance
        if ("ETH" in response.data.result.committed.balances) {
            zks1_balance = (response.data.result.committed.balances.ETH / 10 ** 18).toFixed(4)
        } else {
            zks1_balance = 0;
        }
        let zks1_tx_amount = response.data.result.committed.nonce;
        return {zks1_balance, zks1_tx_amount};
    } catch (error) {
        console.error(error);
        return {zks1_balance: "Error", zks1_tx_amount: "Error"};
    }
}

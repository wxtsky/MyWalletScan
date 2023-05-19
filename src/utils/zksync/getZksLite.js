import axios from "axios";
import { ZksLiteApi } from '@constants/apiKey'

async function getZksLite(address) {
    try {
        const response = await axios.post(ZksLiteApi, {
            'id': 1,
            'jsonrpc': '2.0',
            'method': 'account_info',
            'params': [
                address
            ]
        });
        let balance1
        if ("ETH" in response.data.result.committed.balances) {
            balance1 = (response.data.result.committed.balances.ETH / 10 ** 18).toFixed(3)
        } else {
            balance1 = 0;
        }
        let tx1 = response.data.result.committed.nonce;
        return {balance1, tx1};
    } catch (error) {
        console.error(error);
        return {balance1: "Error", tx1: "Error"};
    }
}

export default getZksLite;

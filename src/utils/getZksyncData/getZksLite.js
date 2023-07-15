import axios from "axios";

const getTimeAgo = (date) => {
    const seconds = (new Date().getTime() - new Date(date).getTime()) / 1000;

    if (seconds < 60) {
        return Math.round(seconds) + ' 秒前';
    }

    const minutes = seconds / 60;
    if (minutes < 60) {
        return Math.round(minutes) + ' 分前';
    }

    const hours = minutes / 60;
    if (hours < 24) {
        return Math.round(hours) + ' 时前';
    }

    const days = hours / 24;
    return Math.round(days) + ' 天前';
};

async function getLatestTx(address) {
    try {
        const response = await axios.get(`https://api.zksync.io/api/v0.2/accounts/${address}/transactions`, {
            params: {
                'from': 'latest',
                'limit': '25',
                'direction': 'older'
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://portal.zksync.io/',
                'Origin': 'https://portal.zksync.io',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'Connection': 'keep-alive',
                'TE': 'trailers'
            }
        });
        const txs = response.data;
        if (txs.result.list.length === 0) {
            return '无交易'
        } else {
            return getTimeAgo(txs.result.list[0]['createdAt'])
        }
    } catch (error) {
        console.log(error)
        return '-';
    }
}

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
        let zks1_latest_tx = await getLatestTx(address);
        return {zks1_balance, zks1_tx_amount, zks1_latest_tx};
    } catch (error) {
        console.error(error);
        return {zks1_balance: "-", zks1_tx_amount: "-", zks1_latest_tx: "-"};
    }
}

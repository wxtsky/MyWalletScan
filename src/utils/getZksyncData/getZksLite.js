import axios from "axios";
import i18n from "i18next";

const getTimeAgo = (date) => {
    const seconds = (new Date().getTime() - new Date(date).getTime()) / 1000;

    if (seconds < 60) {
        return i18n.t('secondsAgo', {count: Math.round(seconds)});
    }

    const minutes = seconds / 60;
    if (minutes < 60) {
        return i18n.t('minutesAgo', {count: Math.round(minutes)});
    }

    const hours = minutes / 60;
    if (hours < 24) {
        return i18n.t('hoursAgo', {count: Math.round(hours)});
    }

    const days = hours / 24;
    return i18n.t('daysAgo', {count: Math.round(days)});
};

async function getLatestTx(address) {
    try {
        const response = await axios.get(`https://api.zksync.io/api/v0.2/accounts/${address}/transactions`, {
            params: {
                'from': 'latest',
                'limit': '25',
                'direction': 'older'
            },
        });
        const txs = response.data;
        if (txs.result.list.length === 0) {
            return i18n.t('noTransaction');
        } else {
            return getTimeAgo(txs.result.list[0]['createdAt']);
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
            zks1_balance = (response.data.result.committed.balances.ETH / 10 ** 18).toFixed(3)
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

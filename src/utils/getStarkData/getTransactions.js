import axios from 'axios';
import {getEthPrice} from "@utils";

// const tokenMapping = {
//     ethereum: 'ETH',
//     dai: 'DAI',
//     'usd-coin': 'USDC',
//     tether: 'USDT',
//     'wrapped-bitcoin': 'WBTC',
// };

async function fetchTokenPrices() {
    const ethPrice = await getEthPrice()
    try {
        // const response = await axios.get(url);
        return {
            "DAI": 1,
            "USDC": 1,
            "USDT": 1,
            "WBTC": 30000,
            "ETH": ethPrice,
        };
    } catch (error) {
        console.log(error);
    }
}

async function getTokenTransfer(address) {
    let page = 1;
    let tokenTransfer = [];
    const price = await fetchTokenPrices();
    while (true) {
        const url = `https://voyager.online/api/contract/${address}/transfers?ps=50&p=${page}`
        const response = await axios.get(url);
        const {items, lastPage} = response.data;
        items.forEach(item => {
            const {
                tx_hash,
                transfer_from,
                transfer_to,
                transfer_value,
                token_symbol,
                token_type,
                token_decimals
            } = item;
            const data = {
                tx_hash,
                transfer_from,
                transfer_to,
                transfer_value,
                token_symbol,
                token_type,
                token_decimals,
                total_value: price.hasOwnProperty(token_symbol) ? transfer_value * price[token_symbol] : 0,
            }
            tokenTransfer.push(data);
        })
        if (lastPage === page) {
            break;
        }
        page++;
    }
    return tokenTransfer;
}

export async function getTransactionsList(address) {
    try {
        let transactionsList = [];
        let page = 1;
        while (true) {
            const url = `https://voyager.online/api/txns?to=${address}&ps=50&p=${page}&type=null`
            const response = await axios.get(url);
            const {items, lastPage} = response.data;
            items.forEach(item => {
                const {actual_fee, hash, timestamp} = item;
                const data = {
                    actual_fee: Number(actual_fee) / 10 ** 18,
                    hash,
                    timestamp,
                    transfer: [],
                }
                transactionsList.push(data);
            })
            if (lastPage === page || lastPage === 0) {
                break;
            }
            page++;
        }
        const tokenTransfer = await getTokenTransfer(address);
        tokenTransfer.forEach(transfer => {
            transactionsList.forEach(tx => {
                if (tx.hash === transfer.tx_hash) {
                    tx.transfer.push(transfer);
                }
            })
        })
        return transactionsList;
    } catch (e) {
        return [];
    }
}

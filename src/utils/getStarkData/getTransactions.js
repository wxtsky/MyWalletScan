import axios from 'axios';

const tokenMapping = {
    ethereum: 'ETH',
    dai: 'DAI',
    'usd-coin': 'USDC',
    tether: 'USDT',
    'wrapped-bitcoin': 'WBTC',
};

async function fetchTokenPrices() {
    const tokens = Object.keys(tokenMapping);
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokens.join(',')}&vs_currencies=usd`;
    try {
        const response = await axios.get(url);
        const price = {};
        for (const token in response.data) {
            const symbol = tokenMapping[token];
            if (symbol) {
                price[symbol] = response.data[token].usd;
            }
        }
        return price;
    } catch (error) {
        throw new Error('Error fetching token prices:', error.message);
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
        if (lastPage === page) {
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
}

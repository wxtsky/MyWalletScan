import axios from 'axios';

async function getTokenPrices() {
    const tokens = ['ethereum', 'dai', 'tether', 'usd-coin', 'wrapped-bitcoin'];
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokens.join(',')}&vs_currencies=usd`;
    let price = {}
    let tokenList = {
        'ethereum': {sym: 0, dec: 18},
        'dai': {sym: 1, dec: 18},
        'usd-coin': {sym: 2, dec: 6},
        'tether': {sym: 3, dec: 6},
        'wrapped-bitcoin': {sym: 4, dec: 8}
    }
    try {
        const response = await axios.get(url);
        for (const token in response.data) {
            price[tokenList[token].sym] = response.data[token].usd / 10 ** tokenList[token].dec;
        }
        return price;
    } catch (error) {
        console.error('Error fetching token prices:', error.message);
        return null;
    }
}

export async function getBridge(address) {
    try {
        let l1_l2 = 0;
        let l2_l1 = 0;
        let l1_l2_amount = 0;
        let l2_l1_amount = 0;
        let page = 1;
        let price = await getTokenPrices()
        let bridgeList = []
        while (true) {
            const response = await axios.get(`https://voyager.online/api/contract/${address}/bridgeTransactions?ps=50&p=${page}`)
            bridgeList = [...bridgeList, ...response.data['items']]
            if (response.data['lastPage'] === page || response.data['lastPage'] === 0 || response.data['items'].length === 0) {
                break;
            }
            page++;
        }

        bridgeList.forEach(bridge => {
            const {token_id, amount, type} = bridge
            if (type === 0) {
                l1_l2++;
                l1_l2_amount += amount * price[token_id];
            }
            if (type === 2) {
                l2_l1++;
                l2_l1_amount += amount * price[token_id];
            }

        })
        return {
            l1_l2,
            l2_l1,
            l1_l2_amount: Number(l1_l2_amount.toFixed(2)),
            l2_l1_amount: Number(l2_l1_amount.toFixed(2))
        }
    } catch (e) {
        return {
            l1_l2: '-',
            l2_l1: '-',
            l1_l2_amount: '-',
            l2_l1_amount: '-'
        }
    }

}

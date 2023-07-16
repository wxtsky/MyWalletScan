import axios from 'axios';

export async function getTokenBalance(address) {
    try {
        const response = await axios.get(`https://voyager.online/api/contract/${address}/balances`);
        let tokenBalance = {};
        let totalValue = 0;
        for (const token in response.data) {
            const usdValue = response.data[token].usd.replace('$', ''); // 去掉美元符号
            tokenBalance[response.data[token].symbol] = parseFloat(response.data[token].amount).toFixed(3)
            totalValue += Number(usdValue).toFixed(3)
        }
        return {...tokenBalance};
    } catch (e) {
        return {
            ETH: '-',
            DAI: '-',
            USDC: '-',
            USDT: '-',
            WBTC: '-'
        }
    }

}

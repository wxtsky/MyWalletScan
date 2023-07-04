import axios from 'axios';

async function getZksEra(address) {
    try {
        let url = "https://block-explorer-api.mainnet.zksync.io/address/" + address;
        const response = await axios.get(url);
        let tx2, balance2, usdcBalance;
        if ("0x0000000000000000000000000000000000000000" in response.data.balances) {
            balance2 = (parseInt(response.data.balances["0x0000000000000000000000000000000000000000"]
                .balance, 16) / 10 ** 18).toFixed(4)
        } else {
            balance2 = 0;
        }
        if ("0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4" in response.data.balances) {
            usdcBalance = (parseInt(response.data.balances["0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4"]
                .balance, 16) / 10 ** 6).toFixed(2)
        } else {
            usdcBalance = 0;
        }
        tx2 = response.data.sealedNonce;
        return {balance2, tx2, usdcBalance};
    } catch (error) {
        console.error(error);
        return {balance2: "-", tx2: "-", usdcBalance: "-"};
    }
}

export default getZksEra;

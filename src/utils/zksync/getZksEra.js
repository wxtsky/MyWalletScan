import axios from 'axios';

async function getZksEra(address) {
    try {
        let url = "https://zksync2-mainnet-explorer.zksync.io/address/" + address;
        const response = await axios.get(url);
        let tx2, balance2;
        if ("0x0000000000000000000000000000000000000000" in response.data.info.balances) {
            balance2 = (parseInt(response.data.info.balances["0x0000000000000000000000000000000000000000"]
                .balance, 16) / 10 ** 18).toFixed(3)
        } else {
            balance2 = 0;
        }
        tx2 = response.data.info.sealedNonce;
        return {balance2, tx2};
    } catch (error) {
        console.error(error);
        return {balance2: "Error", tx2: "Error"};
    }
}

export default getZksEra;

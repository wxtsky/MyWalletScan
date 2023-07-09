import axios from "axios";

const getEthPrice = async () => {
    try {
        const options = {
            method: 'GET',
            url: 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
        }
        let response = await axios.request(options)
        return response.data['USD']
    } catch (e) {
        console.log(e)
        return 0
    }

}


export default getEthPrice

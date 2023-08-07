import axios from "axios";

const getTokenTx = async (address) => {
    const url = "https://api.lineascan.build/api?module=account&action=tokentx&sort=asc&address=" + address + "&startblock=0"
    const response = await axios.get(url);
    return response.data.result;
}

export default getTokenTx;

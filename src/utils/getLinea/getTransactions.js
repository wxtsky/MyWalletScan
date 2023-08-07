import axios from "axios";

const getTransactions = async (address) => {
    const url = "https://api.lineascan.build/api?module=account&action=txlist&sort=asc&address=" + address + "&startblock=0"
    const response = await axios.get(url);
    return response.data.result;
}
export default getTransactions;

import axios from 'axios';

const getBalance = async (address) => {
    const url = "https://api.lineascan.build/api?module=account&action=balance&address=" + address;
    const response = await axios.get(url);
    return (Number(response.data.result) / 10 ** 18).toFixed(4);
}
export default getBalance;

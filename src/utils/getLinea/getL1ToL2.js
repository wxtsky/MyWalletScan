import axios from "axios";

const getEthTx = async (address) => {
    const url = "https://eth.blockscout.com/api?module=account&action=txlist&sort=asc&address=" + address + "&start_block=0"
    const response = await axios.get(url);
    return response.data.result;
}


const getL1ToL2 = async (address) => {
    const response = await getEthTx(address);
    let L1ToL2Tx = 0, L1ToL2Amount = 0;
    response.forEach((tx) => {
        if (tx.to.toLowerCase() === "0xd19d4b5d358258f05d7b411e21a1460d11b0876f".toLowerCase() && tx.from.toLowerCase() === address.toLowerCase() && tx.txreceipt_status === "1") {
            L1ToL2Tx++;
            L1ToL2Amount += Number(tx.value) / 10 ** 18;
        }
    })
    return {L1ToL2Tx, L1ToL2Amount: L1ToL2Amount.toFixed(4)};
}


export default getL1ToL2;

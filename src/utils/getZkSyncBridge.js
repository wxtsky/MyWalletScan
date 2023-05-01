import axios from "axios";
import {ethers} from "ethers";

async function getZkSyncBridge(address) {
    let url =
        "https://zksync2-mainnet-explorer.zksync.io/transactions?limit=100&direction=older&accountAddress=" +
        address;
    try {
        const response = await axios.get(url);
        let l1Tol2Times = 0;
        let l1Tol2Amount = 0;
        let l2Tol1Times = 0;
        let l2Tol1Amount = 0;
        for (let i = 0; i < response.data.list.length; i++) {
            if (response.data.list[i].isL1Originated === true) {
                l1Tol2Times++;
                const value = ethers.formatEther(response.data.list[i].data.value,);
                l1Tol2Amount += parseFloat(value);
            } else if (
                response.data.list[i].data.contractAddress ===
                "0x000000000000000000000000000000000000800a"
            ) {
                l2Tol1Times++;
                const value = ethers.formatEther(response.data.list[i].data.value,);
                l2Tol1Amount += parseFloat(value);
            }
        }
        return {
            l1Tol2Times,
            l1Tol2Amount: l1Tol2Amount.toFixed(3),
            l2Tol1Times,
            l2Tol1Amount: l2Tol1Amount.toFixed(3)
        }
    } catch (e) {
        console.log(e)
        return {l1Tol2Times: "Error", l1Tol2Amount: "Error", l2Tol1Times: "Error", l2Tol1Amount: "Error"}
    }
}

export default getZkSyncBridge;

import axios from "axios";
import {ethers} from "ethers";

async function processTransactions(
    list,
    l1Tol2Times,
    l1Tol2Amount,
    l2Tol1Times,
    l2Tol1Amount
) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].isL1Originated === true) {
            l1Tol2Times++;
            const value = ethers.formatEther(list[i].data.value, "ether");
            l1Tol2Amount += parseFloat(value);
        } else if (
            list[i].data.contractAddress ===
            "0x000000000000000000000000000000000000800a"
        ) {
            l2Tol1Times++;
            const value = ethers.formatEther(list[i].data.value, "ether");
            l2Tol1Amount += parseFloat(value);
        }
    }
    return [l1Tol2Times, l1Tol2Amount, l2Tol1Times, l2Tol1Amount];
}

async function getZkSyncBridge(address) {
    try {
        let l1Tol2Times = 0;
        let l1Tol2Amount = 0;
        let l2Tol1Times = 0;
        let l2Tol1Amount = 0;
        let offset = 0;
        let fromBlockNumber = null;
        let fromTxIndex = null;
        const initUrl = "https://zksync2-mainnet-explorer.zksync.io/transactions?limit=100&direction=older&accountAddress=" + address;
        const initResponse = await axios.get(initUrl)
        const initDataLength = initResponse.data.total;
        [l1Tol2Times, l1Tol2Amount, l2Tol1Times, l2Tol1Amount] =
            await processTransactions(
                initResponse.data.list,
                l1Tol2Times,
                l1Tol2Amount,
                l2Tol1Times,
                l2Tol1Amount
            );
        if (initDataLength > 100) {
            fromBlockNumber = initResponse.data.list[0].blockNumber;
            fromTxIndex = initResponse.data.list[0].indexInBlock;
            while (true) {
                let url = `https://zksync2-mainnet-explorer.zksync.io/transactions?limit=100&direction=older&accountAddress=${address}`;
                if (fromBlockNumber !== undefined && fromTxIndex !== undefined && offset !== 0) {
                    url += `&fromBlockNumber=${fromBlockNumber}&fromTxIndex=${fromTxIndex}&offset=${offset}`;
                }
                const response = await axios.get(url);
                const ListLength = response.data.list.length;
                [l1Tol2Times, l1Tol2Amount, l2Tol1Times, l2Tol1Amount] =
                    await processTransactions(
                        response.data.list,
                        l1Tol2Times,
                        l1Tol2Amount,
                        l2Tol1Times,
                        l2Tol1Amount
                    );
                if (ListLength === 100) {
                    // fromBlockNumber = response.data.list[0].blockNumber;
                    // fromTxIndex = response.data.list[0].indexInBlock;
                    offset += ListLength;
                } else {
                    break;
                }
            }
        }
        return {
            l1Tol2Times,
            l1Tol2Amount: l1Tol2Amount.toFixed(3),
            l2Tol1Times,
            l2Tol1Amount: l2Tol1Amount.toFixed(3)
        }
    } catch (e) {
        console.log(e);
        return {l1Tol2Times: "Error", l1Tol2Amount: "Error", l2Tol1Times: "Error", l2Tol1Amount: "Error"}
    }
}

export default getZkSyncBridge;

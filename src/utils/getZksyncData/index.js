import {getTransactionsList} from "@utils/getZksyncData/getTransactionList.js";
import {getFee} from "@utils/getZksyncData/getFee.js";
import {getVolume} from "@utils/getZksyncData/getVolume.js";
import {getActivities} from "@utils/getZksyncData/getActivity.js";
import {getZksEra} from "@utils/getZksyncData/getZksEra.js";
import {getZksLite} from "@utils/getZksyncData/getZksLite.js";
import {getEthBalance} from "@utils/getZksyncData/getEthBalance.js";
import {getTxCount} from "@utils/getZksyncData/getTxCount.js";
import {getBridge} from "@utils/getZksyncData/getBridge.js";
import getTrustalabsData from "@utils/getZksyncData/getTrustalabsData.js";
import {getPrtocol} from "@utils/getZksyncData/getProtocol.js";

export const getAllZksSyncData = async (address, isGetTrustalabsData) => {
    try {
        const transactions = await getTransactionsList(address);
        const fee = await getFee(transactions);
        const volume = getVolume(transactions);
        const activity = await getActivities(address, transactions);
        const zksEraBalance = await getZksEra(address);
        const zksLiteBalance = await getZksLite(address);
        const ethBalance = await getEthBalance(address, "ethereum");
        const tx = await getTxCount(address, "ethereum");
        const bridge = getBridge(transactions, address);
        const trustData = await getTrustalabsData(address, isGetTrustalabsData)
        await getPrtocol(transactions, address)
        return {
            totalFee: fee,
            totalExchangeAmount: volume,
            activity,
            zksEraBalance,
            zksLiteBalance,
            eth_balance: ethBalance,
            eth_tx_amount: tx,
            bridge,
            trustData,
            result: "success"
        };
    } catch (e) {
        return {
            result: "error",
            reason: e.message
        }
    }
}

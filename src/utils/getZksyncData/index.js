import {getTransactionsList} from "@utils/getZksyncData/getTransactionList.js";
import {getFee} from "@utils/getZksyncData/getFee.js";
import {getVolume} from "@utils/getZksyncData/getVolume.js";
import {getActivities} from "@utils/getZksyncData/getActivity.js";
import {getPrtocol} from "@utils/getZksyncData/getProtocol.js";
import {getZksEra} from "@utils/getZksyncData/getZksEra.js";
import {getZksLite} from "@utils/getZksyncData/getZksLite.js";
import {getEthBalance} from "@utils/getZksyncData/getEthBalance.js";
import {getTxCount} from "@utils/getZksyncData/getTxCount.js";
import {getBridge} from "@utils/getZksyncData/getBridge.js";

export const getAllZksSyncData = async (address) => {
    const transactions = await getTransactionsList(address);
    const fee = await getFee(transactions);
    const volume = getVolume(transactions);
    const activity = await getActivities(address, transactions);
    const protocol = await getPrtocol(transactions, address);
    const zksEraBalance = await getZksEra(address);
    const zksLiteBalance = await getZksLite(address);
    const ethBalance = await getEthBalance(address, "ethereum");
    const tx = await getTxCount(address, "ethereum");
    const bridge = getBridge(transactions, address);
    const result = {
        totalFee: fee,
        totalExchangeAmount: volume,
        ...activity,
        protocol: [...protocol],
        ...zksEraBalance,
        ...zksLiteBalance,
        eth_balance: ethBalance,
        eth_tx_amount: tx,
        ...bridge,
    }
    console.log("result", result)
    return result;
}

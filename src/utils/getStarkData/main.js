import {getTransactionsList} from "@utils/getStarkData/getTransactions.js";
import {getActivities} from "@utils/getStarkData/getActivity.js";
import {getBridge} from "@utils/getStarkData/getBridge.js";
import {getAccountInfo} from "@utils/getStarkData/getAccountInfo.js";
import {getTokenBalance} from "@utils/getStarkData/getTokenBalance.js";
import {getVolume} from "@utils/getStarkData/getVolume.js";

export const getStarkData = async (address) => {
    const transactions = await getTransactionsList(address);
    const activity = await getActivities(address, transactions);
    const bridge = await getBridge(address);
    const account = await getAccountInfo(address);
    const tokenBalance = await getTokenBalance(address);
    const volume = getVolume(transactions);
    return {
        activity,
        bridge,
        account,
        tokenBalance,
        volume,
    }
}

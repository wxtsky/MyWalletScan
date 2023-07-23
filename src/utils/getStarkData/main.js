import {getTransactionsList} from "@utils/getStarkData/getTransactions.js";
import {getActivities} from "@utils/getStarkData/getActivity.js";
import {getBridge} from "@utils/getStarkData/getBridge.js";
import {getAccountInfo} from "@utils/getStarkData/getAccountInfo.js";
import {getTokenBalance} from "@utils/getStarkData/getTokenBalance.js";
import {getVolume} from "@utils/getStarkData/getVolume.js";

export const getStarkData = async (address) => {
    let transactions;
    try {
        transactions = await getTransactionsList(address);
    } catch (e) {
        transactions = [];
    }
    const [
        activity,
        bridge,
        account,
        tokenBalance
    ] = await Promise.all([
        getActivities(address, transactions),
        getBridge(address),
        getAccountInfo(address),
        getTokenBalance(address)
    ]);

    const volume = getVolume(transactions);

    return {
        activity,
        bridge,
        account,
        tokenBalance,
        volume,
    };
}

import getTransactions from "./getTransactions.js";
import getTxAndFee from "./getTxAndFee.js";
import getBalance from "./getBalance.js";
import getActivity from "./getActivity.js";
import {getBridge} from "./getBridge.js";
import {getAccountInfo} from "./getAccountInfo.js";
import getVol from "./getVol.js";

export const getStark = async (address) => {
    try {
        const result = await getTransactions(address);
        const transactions = result['transactions'];
        const transfers = result['transfers'];
        const activity = getActivity(address, transfers)
        const {tx, lastTime, fee} = await getTxAndFee(transactions);
        const balance = await getBalance(address);
        const bridge = getBridge(transfers)
        const accountInfo = await getAccountInfo(address)
        const Vol = getVol(transactions)
        return {
            accountInfo,
            balance,
            tx,
            lastTime,
            fee,
            activity,
            bridge,
            ...Vol,
            result: "success"
        }
    } catch (e) {
        return {
            result: "error",
            reason: e.message
        }
    }
}

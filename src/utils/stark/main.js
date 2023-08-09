import getTransactions from "./getTransactions.js";
import getTxAndFee from "./getTxAndFee.js";
import getBalance from "./getBalance.js";
import getActivity from "./getActivity.js";
import {getBridge} from "./getBridge.js";
import {getAccountInfo} from "./getAccountInfo.js";
import getVol from "./getVol.js";
import {initDB, dbConfig, update} from "@utils/indexedDB/main.js";

export const getStark = async (address) => {
    let data;
    try {
        await initDB(dbConfig);
        const result = await getTransactions(address);
        const transactions = result['transactions'];
        const transfers = result['transfers'];
        const activity = getActivity(address, transactions)
        const {tx, lastTime, fee} = await getTxAndFee(transactions);
        const balance = await getBalance(address);
        const bridge = getBridge(transfers)
        const accountInfo = await getAccountInfo(address)
        const Vol = getVol(transactions)
        data = {
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
        await update("starkTransactions", {
            address: address,
            data: JSON.stringify(transactions)
        })
        return data
    } catch (e) {
        data = {
            result: "error",
            reason: e.message
        }
        return data
    }
}


import {
    getEthBalance,
    getTxCount,
    getZksEra,
    getZksLite,
    getZkSyncBridge,
} from "@utils"

export const refreshZkAddress = async (address) => {
    const item = {
        address,
    };
    const promisesQueue = []
    promisesQueue.push(() => {
        item.zks2_balance = null;
        item.zks2_tx_amount = null;
        item.zks2_usdcBalance = null;
        return getZksEra(address).then(({ balance2, tx2, usdcBalance }) => {
            item.zks2_balance = balance2;
            item.zks2_tx_amount = tx2;
            item.zks2_usdcBalance = usdcBalance;
        })
    });
    promisesQueue.push(() => {
        item.zks1_balance = null;
        item.zks1_tx_amount = null;
        return getZksLite(address).then(({ balance1, tx1 }) => {
            item.zks1_balance = balance1;
            item.zks1_tx_amount = tx1;
        })
    });
    promisesQueue.push(() => {
        item.eth_balance = null;
        return getEthBalance(address, "ethereum").then((eth_balance) => {
            item.eth_balance = eth_balance;
        })
    });
    promisesQueue.push(() => {
        item.eth_tx_amount = null;
        return getTxCount(address, "ethereum").then((eth_tx_amount) => {
            item.eth_tx_amount = eth_tx_amount;
        })
    });
    promisesQueue.push(() => {
        item.zks2_last_tx = null;
        item.totalExchangeAmount = null;
        item.totalFee = null;
        item.contractActivity = null;
        item.dayActivity = null;
        item.weekActivity = null;
        item.monthActivity = null;
        item.l1Tol2Times = null;
        item.l1Tol2Amount = null;
        item.l2Tol1Times = null;
        item.l2Tol1Amount = null;
        return getZkSyncBridge(address).then(({
            zks2_last_tx,
            totalExchangeAmount,
            totalFee,
            contractActivity,
            dayActivity,
            weekActivity,
            monthActivity,
            l1Tol2Times,
            l1Tol2Amount,
            l2Tol1Times,
            l2Tol1Amount
        }) => {
            item.zks2_last_tx = zks2_last_tx;
            item.totalExchangeAmount = totalExchangeAmount;
            item.totalFee = totalFee;
            item.contractActivity = contractActivity;
            item.dayActivity = dayActivity;
            item.weekActivity = weekActivity;
            item.monthActivity = monthActivity;
            item.l1Tol2Times = l1Tol2Times;
            item.l1Tol2Amount = l1Tol2Amount;
            item.l2Tol1Times = l2Tol1Times;
            item.l2Tol1Amount = l2Tol1Amount;
        })
    });
    await Promise.all(promisesQueue.map(func => func()));
    return item;
}

export const batchRefresh = async (list, type) => {
    const queue = list.map(item => refreshZkAddress(item.address));
    const data =  await Promise.all(queue);
    return list.map(item => {
        const adr = item.address;
        const val = data.find(d => d.address === adr);
        return {
            ...item,
            ...val
        }
    })
}
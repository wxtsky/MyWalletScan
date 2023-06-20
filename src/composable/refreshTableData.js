
import {
    getEthBalance,
    getTxCount,
    getZksEra,
    getZksLite,
    getZkSyncBridge,
    getStarkTx,
    getStarkBridge,
    getStarkInfo,
    getLayerData
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


export const refreshSNAddress = async (address) => {
    const item = {
        address,
    };
    let promises = [];
    item.stark_tx_amount = null;
    item.stark_latest_tx = null;
    item.stark_eth_balance = null;
    item.stark_id = null;
    item.create_time = null;
    item.d_eth_amount = null;
    item.d_eth_count = null;
    item.d_usdc_amount = null;
    item.d_usdc_count = null;
    item.d_usdt_amount = null;
    item.d_usdt_count = null;
    item.d_dai_amount = null;
    item.d_dai_count = null;
    item.d_wbtc_amount = null;
    item.d_wbtc_count = null;
    item.w_eth_amount = null;
    item.w_eth_count = null;
    item.w_usdc_amount = null;
    item.w_usdc_count = null;
    item.w_usdt_amount = null;
    item.w_usdt_count = null;
    item.w_dai_amount = null;
    item.w_dai_count = null;
    item.w_wbtc_amount = null;
    item.w_wbtc_count = null;
    item.total_widthdraw_count = null;
    item.total_deposit_count = null;
    promises.push(getStarkTx(item.address).then(({ tx, stark_latest_tx }) => {
        item.stark_tx_amount = tx;
        item.stark_latest_tx = stark_latest_tx;
    }))
    promises.push(getStarkInfo(item.address).then(({ eth_balance, stark_id, deployed_at_timestamp }) => {
        item.stark_eth_balance = eth_balance;
        item.stark_id = stark_id;
        item.create_time = deployed_at_timestamp;
    }))
    promises.push(getStarkBridge(item.address).then(({
        d_eth_amount, d_eth_count,
        d_usdc_amount, d_usdc_count,
        d_usdt_amount, d_usdt_count,
        d_dai_amount, d_dai_count,
        d_wbtc_amount,
        d_wbtc_count,
        w_eth_amount, w_eth_count,
        w_usdc_amount, w_usdc_count,
        w_usdt_amount, w_usdt_count,
        w_dai_amount, w_dai_count,
        w_wbtc_amount, w_wbtc_count,
        total_widthdraw_count, total_deposit_count
    }) => {
        item.d_eth_amount = d_eth_amount;
        item.d_eth_count = d_eth_count;
        item.d_usdc_amount = d_usdc_amount;
        item.d_usdc_count = d_usdc_count;
        item.d_usdt_amount = d_usdt_amount;
        item.d_usdt_count = d_usdt_count;
        item.d_dai_amount = d_dai_amount;
        item.d_dai_count = d_dai_count;
        item.d_wbtc_amount = d_wbtc_amount;
        item.d_wbtc_count = d_wbtc_count;
        item.w_eth_amount = w_eth_amount;
        item.w_eth_count = w_eth_count;
        item.w_usdc_amount = w_usdc_amount;
        item.w_usdc_count = w_usdc_count;
        item.w_usdt_amount = w_usdt_amount;
        item.w_usdt_count = w_usdt_count;
        item.w_dai_amount = w_dai_amount;
        item.w_dai_count = w_dai_count;
        item.w_wbtc_amount = w_wbtc_amount;
        item.w_wbtc_count = w_wbtc_count;
        item.total_widthdraw_count = total_widthdraw_count;
        item.total_deposit_count = total_deposit_count;
    }))
    await Promise.all(promises);
    return item;
}

export const refreshL0Address = async (address) => {
    const {arb, avax, bsc, eth, ftm, matic, metis, op, total} = await getLayerData(address, {});
    const item = {
        address,
        arb,
        avax,
        bsc,
        eth,
        ftm,
        matic,
        metis,
        op,
        total,
    };
    return item;
}

export const batchRefresh = async (list, type) => {
    let queue;
    if (type === 'zk') {
        queue = list.map(item => refreshZkAddress(item.address));
    } else if (type === 'sn') {
        queue = list.map(item => refreshSNAddress(item.address));
    } else if (type === 'l0') {
        queue = list.map(item => refreshL0Address(item.address));
    }
    const data = await Promise.all(queue);
    return list.map(item => {
        const adr = item.address;
        const val = data.find(d => d.address === adr);
        return {
            ...item,
            ...val
        }
    })
}
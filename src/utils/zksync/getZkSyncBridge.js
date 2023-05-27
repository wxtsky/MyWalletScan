import axios from "axios";
import {ethers} from "ethers";

function getDayNumber(d) {
    return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    let weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return d.getUTCFullYear() + "W" + weekNo;
}

function getMonthNumber(d) {
    return d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1);
}

function getZkSyncLastTX(lastTxDatetime) {
    const date = new Date(lastTxDatetime);
    const offset = 8;
    const utc8Date = new Date(date.getTime() + offset * 3600 * 1000);
    const now = new Date();
    const utc8Now = new Date(now.getTime() + offset * 3600 * 1000);
    const diff = utc8Now - utc8Date;
    const diffInHours = Math.floor(diff / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays > 0) {
        return `${diffInDays} 天前`
    } else if (diffInHours > 0) {
        return `${diffInHours} 小时前`
    } else {
        return "刚刚"
    }
}

function getAmount(address, list) {
    let totalExchangeAmount = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i]['from'].toLowerCase() === address.toLowerCase() && list[i]['to'].toLowerCase() !== "0x0000000000000000000000000000000000008001".toLowerCase()) {
            const symbol = list[i]['tokenInfo']['symbol']
            if (symbol === "ETH") {
                const usdPrice = list[i]['tokenInfo']['usdPrice']
                totalExchangeAmount += (parseInt(list[i]['amount'], 16) / 10 ** 18) * parseFloat(usdPrice)
                break
            } else if (list[i]['tokenInfo']['symbol'] === "USDC") {
                totalExchangeAmount += parseInt(list[i]['amount'], 16) / 10 ** 6
                break
            }
        } else if (list[i]['to'].toLowerCase() === address.toLowerCase() && list[i]['from'].toLowerCase() !== "0x0000000000000000000000000000000000008001".toLowerCase()) {
            const symbol = list[i]['tokenInfo']['symbol']
            if (symbol === "ETH") {
                const usdPrice = list[i]['tokenInfo']['usdPrice']
                totalExchangeAmount += (parseInt(list[i]['amount'], 16) / 10 ** 18) * parseFloat(usdPrice)
                break
            } else if (list[i]['tokenInfo']['symbol'] === "USDC") {
                totalExchangeAmount += parseInt(list[i]['amount'], 16) / 10 ** 6
                break
            }
        }
    }
    console.log(totalExchangeAmount)
    return totalExchangeAmount;
}

async function processTransactions(
    zks2_last_tx,
    totalExchangeAmount,
    address,
    totalFee,
    contract,
    days,
    weeks,
    months,
    list,
    l1Tol2Times,
    l1Tol2Amount,
    l2Tol1Times,
    l2Tol1Amount
) {
    for (let i = 0; i < list.length; i++) {
        if (list[i]['balanceChanges'][0]['from'].toLowerCase() === address.toLowerCase()) {
            totalExchangeAmount += getAmount(address, list[i]['erc20Transfers'])
            const receivedAt = new Date(Date.parse(list[i]['receivedAt']));
            if (zks2_last_tx === null) {
                zks2_last_tx = getZkSyncLastTX(list[i]['receivedAt']);
                console.log(zks2_last_tx)
            }
            const contractAddress = list[i].data.contractAddress;
            const fee = (parseInt(list[i].fee, 16) / 10 ** 18).toFixed(5)
            totalFee += parseFloat(fee);
            contract.add(contractAddress)
            days.add(getDayNumber(receivedAt));
            weeks.add(getWeekNumber(receivedAt));
            months.add(getMonthNumber(receivedAt));
        }
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
    return [zks2_last_tx, totalExchangeAmount, totalFee, contract, days, weeks, months, l1Tol2Times, l1Tol2Amount,
            l2Tol1Times,
            l2Tol1Amount];
}

async function getZkSyncBridge(address) {
    try {
        let zks2_last_tx = null;
        let contract = new Set();
        let days = new Set();
        let weeks = new Set();
        let months = new Set();
        let dayActivity;
        let weekActivity;
        let monthActivity;
        let contractActivity;
        let totalFee = 0;
        let l1Tol2Times = 0;
        let l1Tol2Amount = 0;
        let l2Tol1Times = 0;
        let l2Tol1Amount = 0;
        let totalExchangeAmount = 0;
        let offset = 0;
        let fromBlockNumber = null;
        let fromTxIndex = null;
        const initUrl = "https://zksync2-mainnet-explorer.zksync.io/transactions?limit=100&direction=older&accountAddress=" + address;
        const initResponse = await axios.get(initUrl)
        const initDataLength = initResponse.data.total;
        [zks2_last_tx, totalExchangeAmount, totalFee, contract, days, weeks, months, l1Tol2Times, l1Tol2Amount,
         l2Tol1Times,
         l2Tol1Amount] =
            await processTransactions(
                zks2_last_tx,
                totalExchangeAmount,
                address,
                totalFee,
                contract,
                days,
                weeks,
                months,
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
                [zks2_last_tx,
                 totalExchangeAmount, totalFee, contract, days, weeks, months, l1Tol2Times, l1Tol2Amount,
                 l2Tol1Times, l2Tol1Amount] =
                    await processTransactions(
                        zks2_last_tx,
                        totalExchangeAmount,
                        address,
                        totalFee,
                        contract,
                        days,
                        weeks,
                        months,
                        response.data.list,
                        l1Tol2Times,
                        l1Tol2Amount,
                        l2Tol1Times,
                        l2Tol1Amount
                    );
                if (ListLength === 100) {
                    offset += ListLength;
                } else {
                    break;
                }
            }
        }
        dayActivity = days.size;
        weekActivity = weeks.size;
        monthActivity = months.size;
        contractActivity = contract.size;
        console.log("zks2_last_tx", zks2_last_tx);
        return {
            zks2_last_tx: zks2_last_tx === null ? "无交易" : zks2_last_tx,
            totalExchangeAmount: totalExchangeAmount.toFixed(2),
            totalFee: totalFee.toFixed(4),
            contractActivity,
            dayActivity,
            weekActivity,
            monthActivity,
            l1Tol2Times,
            l1Tol2Amount: l1Tol2Amount.toFixed(3),
            l2Tol1Times,
            l2Tol1Amount: l2Tol1Amount.toFixed(3)
        }
    } catch (e) {
        console.log(e);
        return {
            zks2_last_tx: "Error",
            totalExchangeAmount: "Error",
            totalFee: "Error",
            contractActivity: "Error",
            dayActivity: "Error", weekActivity: "Error", monthActivity: "Error",
            l1Tol2Times: "Error", l1Tol2Amount: "Error", l2Tol1Times: "Error", l2Tol1Amount: "Error"
        }
    }
}

export default getZkSyncBridge;

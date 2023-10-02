const getTimeAgo = (timestamp) => {
    const date = new Date(timestamp) * 1000;
    const seconds = (new Date().getTime() - new Date(date).getTime()) / 1000;

    if (seconds < 60) {
        return Math.round(seconds) + ' 秒前';
    }

    const minutes = seconds / 60;
    if (minutes < 60) {
        return Math.round(minutes) + ' 分前';
    }

    const hours = minutes / 60;
    if (hours < 24) {
        return Math.round(hours) + ' 时前';
    }

    const days = hours / 24;
    return Math.round(days) + ' 天前';
};

const getWeekNumber = (date) => {
    const year = date.getFullYear();
    const oneJan = new Date(year, 0, 1);
    const dayIndex = (date.getDay() + 6) % 7;
    const daysSinceFirstDay = Math.floor((date.getTime() - oneJan.getTime()) / 86400000);
    const weekIndex = Math.floor((daysSinceFirstDay + oneJan.getDay() - dayIndex) / 7);

    return `${year}-${weekIndex}`;
};

const getActivity = (address, transactions) => {
    let tx = 0, lastTx = null, fee = 0;
    const uniqueDays = new Set();
    const uniqueWeeks = new Set();
    const uniqueMonths = new Set();
    const uniqueContracts = new Set();
    transactions.reverse();
    if (transactions.length === 0) return ({
        tx,
        lastTx: "无",
        fee: fee.toFixed(4),
        dayActivity: uniqueDays.size,
        weekActivity: uniqueWeeks.size,
        monthActivity: uniqueMonths.size,
        contractActivity: uniqueContracts.size,
    })
    transactions.forEach((transaction) => {
        if (transaction.from.toLowerCase() !== address.toLowerCase()) return;
        tx++;
        lastTx = lastTx ? lastTx : getTimeAgo(Number(transaction.timeStamp));
        fee += Number(transaction.gasPrice) * Number(transaction.gasUsed) / 1e18;
        const timestamp = new Date(transaction.timestamp * 1000);
        const year = timestamp.getFullYear();
        const month = timestamp.getMonth();
        const day = timestamp.getDate();
        const week = getWeekNumber(timestamp);
        uniqueDays.add(`${year}-${month}-${day}`);
        uniqueWeeks.add(`${year}-${week}`);
        uniqueMonths.add(`${year}-${month}`);
        uniqueContracts.add(transaction.to);
    })
    return {
        tx,
        lastTx: lastTx ? lastTx : "-",
        fee: fee.toFixed(4),
        dayActivity: uniqueDays.size,
        weekActivity: uniqueWeeks.size,
        monthActivity: uniqueMonths.size,
        contractActivity: uniqueContracts.size,
    };
}
export default getActivity;

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
const countAllTransactionPeriods = (address, transactions) => {
    let fee = 0;
    const uniqueDays = new Set();
    const uniqueWeeks = new Set();
    const uniqueMonths = new Set();
    transactions.forEach((transaction) => {
        const timestamp = new Date(transaction.timestamp * 1000);
        fee += transaction.actual_fee;
        const year = timestamp.getFullYear();
        const month = timestamp.getMonth();
        console.log(`year: ${year}, month: ${month}`);
        const day = timestamp.getDate();
        const week = getWeekNumber(timestamp);
        uniqueDays.add(`${year} -${month} -${day}`);
        uniqueWeeks.add(`${year} -${week}`);
        uniqueMonths.add(`${year} -${month}`);
    });
    return {
        fee: fee.toFixed(3),
        days: uniqueDays.size,
        weeks: uniqueWeeks.size,
        months: uniqueMonths.size,
    };
};

export const getActivities = async (address, transactions) => {
    const {fee, days, weeks, months} = countAllTransactionPeriods(address, transactions);
    const lastTransaction = transactions[0];
    const lastTransactionTimeAgo = getTimeAgo(lastTransaction.timestamp) || '无交易';
    return {
        fee,
        days,
        weeks,
        months,
        lastTransactionTimeAgo,
    }
}


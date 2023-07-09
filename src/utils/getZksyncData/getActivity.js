const getTimeAgo = (date) => {
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
    const uniqueDays = new Set();
    const uniqueWeeks = new Set();
    const uniqueMonths = new Set();
    const uniqueContracts = new Set();
    transactions.forEach((transaction) => {
        if (transaction.from.toLowerCase() !== address.toLowerCase()) return;
        const timestamp = new Date(transaction.receivedAt);
        const year = timestamp.getFullYear();
        const month = timestamp.getMonth();
        const day = timestamp.getDate();
        const week = getWeekNumber(timestamp);

        uniqueDays.add(`${year}-${month}-${day}`);
        uniqueWeeks.add(`${year}-${week}`);
        uniqueMonths.add(`${year}-${month}`);
        uniqueContracts.add(transaction.to);
    });
    return {
        dayActivity: uniqueDays.size,
        weekActivity: uniqueWeeks.size,
        monthActivity: uniqueMonths.size,
        contractActivity: uniqueContracts.size,
    };
};

export const getActivities = async (address, transactions) => {
    if (transactions.length === 0) return ({
        dayActivity: 0,
        weekActivity: 0,
        monthActivity: 0,
        contractActivity: 0,
        zks2_last_tx: '无交易',
    })
    const {
        dayActivity,
        weekActivity,
        monthActivity,
        contractActivity
    } = countAllTransactionPeriods(address, transactions);
    const lastTransaction = transactions[0];
    const zks2_last_tx = getTimeAgo(lastTransaction.receivedAt) || '无交易';
    return {
        dayActivity,
        weekActivity,
        monthActivity,
        contractActivity,
        zks2_last_tx,
    }
}

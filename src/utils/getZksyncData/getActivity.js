import i18n from 'i18next';

const getTimeAgo = (date) => {
    const seconds = (new Date().getTime() - new Date(date).getTime()) / 1000;

    if (seconds < 60) {
        return i18n.t('secondsAgo', {count: Math.round(seconds)});
    }

    const minutes = seconds / 60;
    if (minutes < 60) {
        return i18n.t('minutesAgo', {count: Math.round(minutes)});
    }

    const hours = minutes / 60;
    if (hours < 24) {
        return i18n.t('hoursAgo', {count: Math.round(hours)});
    }

    const days = hours / 24;
    return i18n.t('daysAgo', {count: Math.round(days)});
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
        zks2_last_tx: i18n.t('noTransaction'),
    })
    const {
        dayActivity,
        weekActivity,
        monthActivity,
        contractActivity
    } = countAllTransactionPeriods(address, transactions);
    const lastTransaction = transactions[0];
    const zks2_last_tx = getTimeAgo(lastTransaction.receivedAt) || i18n.t('noTransaction');
    return {
        dayActivity,
        weekActivity,
        monthActivity,
        contractActivity,
        zks2_last_tx,
    }
}

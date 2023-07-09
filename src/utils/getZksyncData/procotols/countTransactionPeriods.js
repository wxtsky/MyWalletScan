const getWeekNumber = (date) => {
    const year = date.getFullYear();
    const oneJan = new Date(year, 0, 1);
    const dayIndex = (date.getDay() + 6) % 7;
    const daysSinceFirstDay = Math.floor((date.getTime() - oneJan.getTime()) / 86400000);
    const weekIndex = Math.floor((daysSinceFirstDay + oneJan.getDay() - dayIndex) / 7);

    return `${year}-${weekIndex}`;
};
export const countTransactionPeriods = (
    address,
    transactions,
    protocol,
    addresses = [],
) => {
    address;
    protocol;
    const uniqueDays = new Set();
    const uniqueWeeks = new Set();
    const uniqueMonths = new Set();
    transactions.forEach((transaction) => {
        if (
            protocol !== 'zksynceraportal' &&
            !addresses.includes(transaction.to.toLowerCase()) &&
            !addresses.includes(transaction.from.toLowerCase())
        )
            return;

        if (protocol === 'zksynceraportal') {
            if (
                !transaction.data.startsWith('0x51cff8d9') &&
                !(transaction.to.toLowerCase() === address.toLowerCase() && transaction.isL1Originated)
            )
                return;
        }
        const timestamp = new Date(transaction.receivedAt);
        const year = timestamp.getFullYear();
        const month = timestamp.getMonth();
        const day = timestamp.getDate();
        const week = getWeekNumber(timestamp);

        uniqueDays.add(`${year}-${month}-${day}`);
        uniqueWeeks.add(`${year}-${week}`);
        uniqueMonths.add(`${year}-${month}`);
    });

    return {
        days: uniqueDays.size,
        weeks: uniqueWeeks.size,
        months: uniqueMonths.size,
    };
};

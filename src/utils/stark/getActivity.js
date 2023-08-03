const getWeekNumber = (date) => {
    const year = date.getFullYear();
    const oneJan = new Date(year, 0, 1);
    const dayIndex = (date.getDay() + 6) % 7;
    const daysSinceFirstDay = Math.floor((date.getTime() - oneJan.getTime()) / 86400000);
    const weekIndex = Math.floor((daysSinceFirstDay + oneJan.getDay() - dayIndex) / 7);

    return `${year}-${weekIndex}`;
};
const countAllTransactionPeriods = (address, transfers) => {
    const uniqueDays = new Set();
    const uniqueWeeks = new Set();
    const uniqueMonths = new Set();
    const uniqueContracts = new Set();
    transfers.forEach((transfer) => {
        if (transfer.transfer_from_address.toLowerCase() !== address.toLowerCase()) return;
        const timestamp = new Date(transfer.timestamp * 1000);
        const year = timestamp.getFullYear();
        const month = timestamp.getMonth();
        const day = timestamp.getDate();
        const week = getWeekNumber(timestamp);

        uniqueDays.add(`${year}-${month}-${day}`);
        uniqueWeeks.add(`${year}-${week}`);
        uniqueMonths.add(`${year}-${month}`);
        uniqueContracts.add(transfer.transfer_to_address);
    });
    return {
        dayActivity: uniqueDays.size,
        weekActivity: uniqueWeeks.size,
        monthActivity: uniqueMonths.size,
        contractActivity: uniqueContracts.size,
    };
};

export default function getActivity(address, transfers) {
    if (transfers.length === 0) return {
        dayActivity: 0,
        weekActivity: 0,
        monthActivity: 0,
        contractActivity: 0,
    }
    const {
        dayActivity,
        weekActivity,
        monthActivity,
        contractActivity
    } = countAllTransactionPeriods(address, transfers);
    return {
        dayActivity,
        weekActivity,
        monthActivity,
        contractActivity,
    }
}

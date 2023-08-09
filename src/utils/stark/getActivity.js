const getWeekNumber = (date) => {
    const year = date.getFullYear();
    const oneJan = new Date(year, 0, 1);
    const dayIndex = (date.getDay() + 6) % 7;
    const daysSinceFirstDay = Math.floor((date.getTime() - oneJan.getTime()) / 86400000);
    const weekIndex = Math.floor((daysSinceFirstDay + oneJan.getDay() - dayIndex) / 7);

    return `${year}-${weekIndex}`;
};


const formatCallData = (callData) => {
    let result = "";
    if (!callData) return result;
    for (let i = 0; i < callData.length; i++) {
        console.log(callData[i].length)
        if (!callData[i]) continue;
        if (callData[i].length === 66 || callData[i].length === 64 || callData[i].length === 65) {
            result = callData[i];
            break;
        }
    }
    return result;
}
const countAllTransactionPeriods = (address, transcations) => {
    const uniqueDays = new Set();
    const uniqueWeeks = new Set();
    const uniqueMonths = new Set();
    const uniqueContracts = new Set();
    transcations.forEach((transcation) => {
        const timestamp = new Date(transcation.timestamp * 1000);
        const year = timestamp.getFullYear();
        const month = timestamp.getMonth();
        const day = timestamp.getDate();
        const week = getWeekNumber(timestamp);

        uniqueDays.add(`${year}-${month}-${day}`);
        uniqueWeeks.add(`${year}-${week}`);
        uniqueMonths.add(`${year}-${month}`);
        const contract = formatCallData(transcation.calldata)
        if (contract) {
            uniqueContracts.add(contract);
        }
    });
    return {
        dayActivity: uniqueDays.size,
        weekActivity: uniqueWeeks.size,
        monthActivity: uniqueMonths.size,
        contractActivity: uniqueContracts.size,
    };
};

export default function getActivity(address, transcations) {
    if (transcations.length === 0) return {
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
    } = countAllTransactionPeriods(address, transcations);
    return {
        dayActivity,
        weekActivity,
        monthActivity,
        contractActivity,
    }
}

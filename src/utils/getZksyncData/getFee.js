export const getFee = async (transactions) => {
    let fee = 0;
    transactions.forEach((transaction) => {
        const tmpFees = parseInt(transaction.fee, 16) * 10 ** -18 * transaction.ethValue;
        fee += tmpFees;
    });
    return fee.toFixed(2);
}


export const getVolume = (transactions) => {
    let volume = 0;
    transactions.forEach((transaction) => {
        const transfers = transaction.transfer.sort(
            (a, b) =>
                parseInt(b.total_value) - parseInt(a.total_value)
        );
        if (transfers.length === 0) return;
        const tmpVolume = parseFloat(transfers[0].total_value)
        volume += tmpVolume;
    });
    return {volume: volume.toFixed(3)}
}

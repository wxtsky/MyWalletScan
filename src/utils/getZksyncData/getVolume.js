export const getVolume = (transactions) => {
    let volume = 0;
    transactions.forEach((transaction) => {
        const transfers = transaction.transfers.sort(
            (a, b) =>
                parseInt(b.amount) * 10 ** -b.token.decimals * b.token.price -
                parseInt(a.amount) * 10 ** -a.token.decimals * a.token.price,
        );
        if (transfers.length === 0) return;
        const tmpVolume = parseInt(transfers[0].amount) * 10 ** -transfers[0].token.decimals * transfers[0].token.price;
        volume += tmpVolume;
    });
    return volume.toFixed(2);
}


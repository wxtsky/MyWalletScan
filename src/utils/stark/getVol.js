export default function getVol(transcations) {
    try {
        let Vol = 0;
        transcations.forEach((transaction) => {
            const transfers = transaction.transfers.sort(
                (a, b) =>
                    parseInt(b.total_value) - parseInt(a.total_value)
            );
            if (transfers.length === 0) return;
            const tmpVol = parseFloat(transfers[0].total_value)
            Vol += tmpVol;
        })
        return {Vol: Vol.toFixed(3)}
    } catch (e) {
        console.log(e)
        return {Vol: '-'}
    }

}

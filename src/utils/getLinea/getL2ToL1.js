const getL2ToL1 = (address, transactions) => {
    let L2ToL1Tx = 0, L2ToL1Amount = 0;
    transactions.forEach((tx) => {
        if (tx.from.toLowerCase() === address.toLowerCase() && tx.txreceipt_status === "1" && tx.to.toLowerCase() === "0x508Ca82Df566dCD1B0DE8296e70a96332cD644ec".toLowerCase()) {
            L2ToL1Tx++;
            L2ToL1Amount += Number(tx.value) / 10 ** 18;
        }
    })
    return {L2ToL1Tx, L2ToL1Amount: L2ToL1Amount.toFixed(4)};
}
export default getL2ToL1;

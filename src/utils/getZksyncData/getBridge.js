import {ethers} from "ethers";

export const getBridge = (transaction, address) => {
    let l1Tol2Times = 0;
    let l1Tol2Amount = 0;
    let l2Tol1Times = 0;
    let l2Tol1Amount = 0;
    transaction.forEach((transaction) => {
        const fromAddress = transaction.from;
        const toAddress = transaction.to;
        const isL1Originated = transaction.isL1Originated;
        if (fromAddress.toLowerCase() !== address.toLowerCase()) return;
        if (isL1Originated) {
            l1Tol2Times++;
            const value = ethers.formatEther(transaction.value);
            l1Tol2Amount += parseFloat(value);
        }
        if (toAddress.toLowerCase() === "0x000000000000000000000000000000000000800A".toLowerCase()) {
            l2Tol1Times++;
            const value = ethers.formatEther(transaction.value);
            l2Tol1Amount += parseFloat(value);
        }
    })
    return {
        l1Tol2Times,
        l1Tol2Amount: l1Tol2Amount.toFixed(3),
        l2Tol1Times,
        l2Tol1Amount: l2Tol1Amount.toFixed(3),
    }
}

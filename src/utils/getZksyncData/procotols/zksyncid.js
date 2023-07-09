import {countTransactionPeriods} from "@utils/getZksyncData/procotols/countTransactionPeriods.js";

const zkSyncIdAddresses = ['0xa531ece441138d8ce52642ad497059f2a79fd96f'];

export const ZkSyncId = {
    getProtocolsState: (transactions, address) => {
        const protocolState = {
            name: 'zkSync ID',
            id: 'zksyncid',
            lastActivity: '',
            volume: 0,
            interactions: 0,
            activeDays: 0,
            approves: 0,
            url: 'https://www.zksyncid.xyz/',
        };

        transactions.forEach((transaction) => {
            if (
                zkSyncIdAddresses.includes(transaction.to.toLowerCase()) ||
                zkSyncIdAddresses.includes(transaction.to.toLowerCase())
            ) {
                if (protocolState.lastActivity === '') protocolState.lastActivity = transaction.receivedAt;
                if (new Date(protocolState.lastActivity) < new Date(transaction.receivedAt))
                    protocolState.lastActivity = transaction.receivedAt;
                protocolState.interactions += 1;

                const transfers = transaction.transfers.sort(
                    (a, b) =>
                        parseInt(b.amount) * 10 ** -b.token.decimals * b.token.price -
                        parseInt(a.amount) * 10 ** -a.token.decimals * a.token.price,
                );

                if (transfers.length === 0) return;
                protocolState.volume +=
                    parseInt(transfers[0].amount) * 10 ** -transfers[0].token.decimals * transfers[0].token.price;
            }
        });

        protocolState.activeDays = countTransactionPeriods(address, transactions, protocolState.id, zkSyncIdAddresses).days;

        return protocolState;
    },
};

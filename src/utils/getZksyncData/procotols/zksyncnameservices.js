import {countTransactionPeriods} from "@utils/getZksyncData/procotols/countTransactionPeriods.js";

const zkSyncNameServiceAddresses = ['0xae23b6e7f91ddebd3b70d74d20583e3e674bd94f'];

export const ZkSyncNameService = {
    getProtocolsState: (transactions, address) => {
        const protocolState = {
            name: 'zkSync Name Service',
            id: 'zksyncnameservice',
            lastActivity: '',
            volume: 0,
            interactions: 0,
            activeDays: 0,
            approves: 0,
            url: 'https://app.zkns.domains/',
        };

        transactions.forEach((transaction) => {
            if (zkSyncNameServiceAddresses.includes(transaction.to.toLowerCase())) {
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

        protocolState.activeDays = countTransactionPeriods(
            address,
            transactions,
            protocolState.id,
            zkSyncNameServiceAddresses,
        ).days;

        return protocolState;
    },
};

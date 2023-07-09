import {countTransactionPeriods} from "@utils/getZksyncData/procotols/countTransactionPeriods.js";

const starmarkerAddresses = ['0x1bdb8250eaf3c596441e6c3417c9d5195d6c85b9'];

export const Starmaker = {
    getProtocolsState: (transactions, address) => {
        const protocolState = {
            name: 'Starmaker',
            id: 'starmaker',
            lastActivity: '',
            volume: 0,
            interactions: 0,
            activeDays: 0,
            approves: 0,
            url: 'https://starmaker.exchange/',
        };

        transactions.forEach((transaction) => {
            if (starmarkerAddresses.includes(transaction.to.toLowerCase())) {
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
            starmarkerAddresses,
        ).days;

        return protocolState;
    },
};

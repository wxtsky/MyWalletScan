import {countTransactionPeriods} from "@utils/getZksyncData/procotols/countTransactionPeriods.js";

const holdstationAddresses = [
    '0x7b4872e2096ec9410b6b8c8b7d039589e6ee8022',
    '0xaf08a9d918f16332f22cf8dc9abe9d9e14ddcbc2',
];

export const Holdstation = {
    getProtocolsState: (transactions, address) => {
        const protocolState = {
            name: 'Holdstation',
            id: 'holdstation',
            lastActivity: '',
            volume: 0,
            interactions: 0,
            activeDays: 0,
            approves: 0,
            url: 'https://holdstation.exchange/',
        };

        transactions.forEach((transaction) => {
            if (holdstationAddresses.includes(transaction.to.toLowerCase())) {
                if (protocolState.lastActivity === '') protocolState.lastActivity = transaction.receivedAt;
                if (new Date(protocolState.lastActivity) < new Date(transaction.receivedAt))
                    protocolState.lastActivity = transaction.receivedAt;
                protocolState.interactions += 1;

                const transfers = transaction.transfers.sort(
                    (a, b) =>
                        parseInt(b.amount) * 10 ** -b.token.decimals * b.token.price -
                        parseInt(a.amount) * 10 ** -a.token.decimals * a.token.price
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
            holdstationAddresses
        ).days;

        return protocolState;
    },
};

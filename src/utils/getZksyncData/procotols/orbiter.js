import {countTransactionPeriods} from "@utils/getZksyncData/procotols/countTransactionPeriods.js";

const orbiterRouters = [
    '0xe4edb277e41dc89ab076a1f049f4a3efa700bce8',
    '0x80c67432656d59144ceff962e8faf8926599bcf8',
    '0xee73323912a4e3772b74ed0ca1595a152b0ef282',
    '0x0a88BC5c32b684D467b43C06D9e0899EfEAF59Df',
];

export const Orbiter = {
    getProtocolsState: (transactions, address) => {
        const protocolState = {
            name: 'Orbiter Finance',
            id: 'orbiter',
            lastActivity: '',
            volume: 0,
            interactions: 0,
            activeDays: 0,
            approves: 0,
            url: 'https://orbiter.finance/',
        };

        transactions.forEach((transaction) => {
            if (
                orbiterRouters.includes(transaction.to.toLowerCase()) ||
                orbiterRouters.includes(transaction.from.toLowerCase())
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

        protocolState.activeDays = countTransactionPeriods(
            address,
            transactions,
            protocolState.id,
            orbiterRouters,
        ).days;

        return protocolState;
    },
};

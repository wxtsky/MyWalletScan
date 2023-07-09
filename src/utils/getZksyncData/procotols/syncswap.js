import {countTransactionPeriods} from "@utils/getZksyncData/procotols/countTransactionPeriods.js";

const syncSwapRouter = '0x2da10a1e27bf85cedd8ffb1abbe97e53391c0295';

const syncSwapPools = [
    '0x80115c708e12edd42e504c1cd52aea96c547c05c',
    '0x176b23f1ddfeedd10fc250b8f769362492ef810b',
    '0x4e7d2e3f40998daeb59a316148bfbf8efd1f7f3c',
    '0xae092fcec5fd04836b12e87da0d7ed3a707b38b0',
];

export const SyncSwap = {
    getProtocolsState: (transactions, address) => {
        const protocolState = {
            name: 'SyncSwap',
            id: 'syncswap',
            lastActivity: '',
            volume: 0,
            interactions: 0,
            activeDays: 0,
            approves: 0,
            url: 'https://syncswap.xyz/',
        };

        transactions.forEach((transaction) => {
            if (
                syncSwapRouter.includes(transaction.to.toLowerCase()) ||
                syncSwapPools.includes(transaction.to.toLowerCase())
            ) {
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
            syncSwapPools.concat([syncSwapRouter])
        ).days;

        return protocolState;
    },
};

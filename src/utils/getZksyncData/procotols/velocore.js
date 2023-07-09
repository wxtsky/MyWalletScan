import {countTransactionPeriods} from "@utils/getZksyncData/procotols/countTransactionPeriods.js";

const velocoreRouter = '0xd999e16e68476bc749a28fc14a0c3b6d7073f50c';

const velocorePools = ['0xcd52cbc975fbb802f82a1f92112b1250b5a997df'];

export const Velocore = {
    getProtocolsState: (transactions, address) => {
        const protocolState = {
            name: 'Velocore',
            id: 'velocore',
            lastActivity: '',
            volume: 0,
            interactions: 0,
            activeDays: 0,
            approves: 0,
            url: 'https://velocore.xyz/',
        };

        transactions.forEach((transaction) => {
            if (
                velocoreRouter.includes(transaction.to.toLowerCase()) ||
                velocorePools.includes(transaction.to.toLowerCase())
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
            velocorePools.concat([velocoreRouter]),
        ).days;

        return protocolState;
    },
};

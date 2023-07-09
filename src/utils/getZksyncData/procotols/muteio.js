import {countTransactionPeriods} from "@utils/getZksyncData/procotols/countTransactionPeriods.js";

const muteRouter = '0x8b791913eb07c32779a16750e3868aa8495f5964';

const mutePools = [
    '0xdfaab828f5f515e104baaba4d8d554da9096f0e4',
    '0xb85feb6af3412d690dfda280b73eaed73a2315bc',
];

export const Mute = {
    getProtocolsState: (transactions, address) => {
        const protocolState = {
            name: 'Mute.io',
            id: 'muteio',
            lastActivity: '',
            volume: 0,
            interactions: 0,
            activeDays: 0,
            approves: 0,
            url: 'https://mute.io/',
        };

        transactions.forEach((transaction) => {
            if (muteRouter.includes(transaction.to.toLowerCase()) || mutePools.includes(transaction.to.toLowerCase())) {
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
            mutePools.concat([muteRouter])
        ).days;

        return protocolState;
    },
};

import {countTransactionPeriods} from "@utils/getZksyncData/procotols/countTransactionPeriods.js";

const maverickAddresses = [
    '0xfd54762d435a490405dda0fbc92b7168934e8525',
    '0x852639ee9dd090d30271832332501e87d287106c',
    '0x77ee88b1c9cce741ec35553730eb1f19cd45a379',
    '0x39e098a153ad69834a9dac32f0fca92066ad03f4',
];

export const Maverick = {
    getProtocolsState: (transactions, address) => {
        const protocolState = {
            name: 'Maverick',
            id: 'maverick',
            lastActivity: '',
            volume: 0,
            interactions: 0,
            activeDays: 0,
            approves: 0,
            url: 'https://app.mav.xyz/',
        };

        transactions.forEach((transaction) => {
            if (maverickAddresses.includes(transaction.to.toLowerCase())) {
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
            maverickAddresses
        ).days;

        return protocolState;
    },
};

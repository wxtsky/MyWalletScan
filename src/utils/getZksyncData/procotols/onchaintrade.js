import {countTransactionPeriods} from "@utils/getZksyncData/procotols/countTransactionPeriods.js";

const onchainTradeAddresses = [
    '0x84c18204c30da662562b7a2c79397c9e05f942f0',
    '0xca806b267fc0c1c12edbf77a2e5bca5939c7d953',
    '0xaa08a6d7b10724d03b8f4857d4fa14e7f92814e3',
    '0x10c8044ae3f2b1c7decb439ff2dc1164d750c39d',
    '0xe676b11421d68a28ba50920f2841183af93067a2',
    '0x6219f06135b79705d34f5261852e9f6b98821e1f',
];

export const OnchainTrade = {
    getProtocolsState: (transactions, address) => {
        const protocolState = {
            name: 'Onchain Trade',
            id: 'onchaintrade',
            lastActivity: '',
            volume: 0,
            interactions: 0,
            activeDays: 0,
            approves: 0,
            url: 'https://onchain.trade/',
        };

        transactions.forEach((transaction) => {
            if (onchainTradeAddresses.includes(transaction.to.toLowerCase())) {
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
            onchainTradeAddresses
        ).days;

        return protocolState;
    },
};

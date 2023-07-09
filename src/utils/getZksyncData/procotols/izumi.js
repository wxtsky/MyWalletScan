import {countTransactionPeriods} from "@utils/getZksyncData/procotols/countTransactionPeriods.js";

const izumiFinanceAddresses = [
    '0x33d9936b7b7bc155493446b5e6ddc0350eb83aec',
    '0x7499ce9c8f4ff47be5dd5308ab54cc710de751e1',
    '0xbc94aedd2a0a986476b89e072b05e0df117a3f8b',
    '0xc319755dff1601b3d0520b421a281b11bf22e80f',
    '0x8df80089b7ab1646db211d43949ecdfc94582011',
    '0x0066f3791bd9d5a25d88f978dd8e1006445fe0d6',
    '0x377ec7c9ae5a0787f384668788a1654249059dd6',
    '0x3ec82c07981d6d213da9bd35a0ba4cd324fea438',
    '0x9606ec131eec0f84c95d82c9a63959f2331cf2ac',
    '0x936c9a1b8f88bfdbd5066ad08e5d773bc82eb15f',
    '0x8b9d7d609a83b2f69d2135786a7d230043af7283',
    '0x7dee7de9814ed6c1e20b3e4e2fa9b1b96e15fde1',
];

export const IzumiFinance = {
    getProtocolsState: (transactions, address) => {
        const protocolState = {
            name: 'iZUMi finance',
            id: 'izumi',
            lastActivity: '',
            volume: 0,
            interactions: 0,
            activeDays: 0,
            approves: 0,
            url: 'https://izumi.finance/home',
        };

        transactions.forEach((transaction) => {
            if (izumiFinanceAddresses.includes(transaction.to.toLowerCase())) {
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
            izumiFinanceAddresses
        ).days;

        return protocolState;
    },
};

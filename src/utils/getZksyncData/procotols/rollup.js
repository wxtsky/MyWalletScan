import {countTransactionPeriods} from "@utils/getZksyncData/procotols/countTransactionPeriods.js";

const rollupAddresses = [
    '0xefde2aefe307a7362c7e0e3be019d1491dc7e163',
    '0xba5f1898f3af43e30b552cac559f11f5d5a2fd1e',
    '0xf9895dcb26c60743fce3ae54f506c47b763693bb',
    '0xbbca935fb05d8671b8875293c2d82df73105ac60',
    '0xc8db02c5900de3ed03139e9ec62a84b2f5e06d7f',
    '0xc2e9dfb2fded2139b0b60c6781b4c648f1385c16',
    '0x0ed4a1c66fcdf17341177422e73ca919284e040c',
    '0x015d01187a77055fadb96c63a9de9f8981e3d0f5',
    '0x9eb48ce91a77ff37f2edd032c90d7ec6a953b4fd',
    '0x1f79cce5b8876a07541900e681b31a8e51766b5a',
    '0xf77ded0ae91c41c432555beb25da2a6658338e5a',
    '0xcc8b6c37fb97bdc774f0ea7f8b047e8ee057458c',
    '0xc05c6a229c6ed34b9d31c88421d70ef71fbaabcf',
    '0xf35eb225803ccf6ffb64be531bb91132a9229196',
    '0x277e57e33c92c7f145832274384eeef35828db3d',
    '0x2dddd703578d1f5bd1fad113c9e12f0c416305d5',
    '0xd23432901c0754e28999661f31ab4aa3633ec2ed',
    '0x747cc81b6c2b4afe13be59d31591d4229854b826',
    '0xa0c13b5eca719be98ef27d0c4111cb5abbe97731',
    '0x824422bd3ba030ca9ca5bcad26dfd4b45409849d',
    '0xd2589f416c9412572df8d94fa1d58073c9f8f3bf',
    '0x7bd375b95a1dbcbddb1e8219a01c550b21ed6ea2',
    '0x5b91962f5eca75e6558e4d32df69b30f75cc6fe5',
    '0x901b51b9a4214990ac6f0fd50a45df1573b7a51a',
];

export const Rollup = {
    getProtocolsState: (transactions, address) => {
        const protocolState = {
            name: 'Rollup Finance',
            id: 'rollup',
            lastActivity: '',
            volume: 0,
            interactions: 0,
            activeDays: 0,
            approves: 0,
            url: 'https://rollup.finance/',
        };

        transactions.forEach((transaction) => {
            if (rollupAddresses.includes(transaction.to.toLowerCase())) {
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
            rollupAddresses,
        ).days;

        return protocolState;
    },
};

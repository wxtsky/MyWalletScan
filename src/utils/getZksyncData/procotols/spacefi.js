import {countTransactionPeriods} from "@utils/getZksyncData/procotols/countTransactionPeriods.js";

const spaceFiAddresses = [
    '0x0700fb51560cfc8f896b2c812499d17c5b0bf6a7',
    '0xe8826fc3ce6e74932144dbc2b369e7b52e88193a',
    '0x7cf85f98c0339559eab22deea1e018721e800add',
    '0xb376fceacd9fef24a342645cbf72a4c439ea0614',
    '0xacf5a67f2fcfeda3946ccb1ad9d16d2eb65c3c96',
    '0x4ad9ee1698b6d521ebb2883dd9fc3655c7553561',
    '0x00f093ff2bca9da894396336286c7c5bd2310ca5',
    '0x307baa142ba2bfa4a3059efb631899c992a193ee',
    '0x77d807b74d54b81a87a5769176bc7719f676c8ce',
    '0xbe7d1fd1f6748bbdefc4fbacafbb11c6fc506d1d',
];

export const SpaceFi = {
    getProtocolsState: (transactions, address) => {
        const protocolState = {
            name: 'SpaceFi',
            id: 'spacefi',
            lastActivity: '',
            volume: 0,
            interactions: 0,
            activeDays: 0,
            approves: 0,
            url: 'https://spacefi.io/',
        };

        transactions.forEach((transaction) => {
            if (spaceFiAddresses.includes(transaction.to.toLowerCase())) {
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
            spaceFiAddresses,
        ).days;

        return protocolState;
    },
};

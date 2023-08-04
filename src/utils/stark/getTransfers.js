import axios from 'axios';

async function fetchTransfers(url, Json_data, headers) {
    const response = await axios.post(url, Json_data, {headers: headers});
    let transfers = [];
    const Price = {
        "StarkGate: ETH": 1800,
        "StarkGate: USDT": 1,
        "StarkGate: USDC": 1,
        "StarkGate: DAI": 1,
        "StarkGate: WBTC": 29500,
    }
    response.data.data['erc20TransferEvents']['edges'].forEach((item) => {
        const {
            transaction_hash,
            from_address,
            transfer_amount_display,
            transfer_from_address,
            transfer_to_address,
            from_erc20_identifier,
            main_call,
            timestamp,
            __typename,
        } = item['node'];
        transfers.push({
            transaction_hash,
            from_address,
            transfer_amount_display,
            transfer_from_address,
            transfer_to_address,
            from_erc20_identifier,
            timestamp,
            main_call,
            __typename,
            total_value: Price.hasOwnProperty(from_erc20_identifier) ? transfer_amount_display * Price[from_erc20_identifier] : 0,
        })
    });
    return {
        transfers: transfers,
        hasNextPage: response.data.data['erc20TransferEvents']['pageInfo']['hasNextPage'],
        endCursor: response.data.data['erc20TransferEvents']['pageInfo']['endCursor'],
    }
}

export async function getTransfers(address) {
    const url = "https://starkscan.stellate.sh/";
    const headers = {
        'authority': 'starkscan.stellate.sh',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    }
    const Json_data = {
        'query': 'query ERC20TransferEventsTableQuery(\n  $first: Int!\n  $after: String\n  $input: ERC20TransferEventsInput!\n) {\n  ...ERC20TransferEventsTablePaginationFragment_erc20TransferEvents_2DAjA4\n}\n\nfragment ERC20TransferEventsTablePaginationFragment_erc20TransferEvents_2DAjA4 on Query {\n  erc20TransferEvents(first: $first, after: $after, input: $input) {\n    edges {\n      node {\n        id\n        ...ERC20TransferEventsTableRowFragment_erc20TransferEvent\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment ERC20TransferEventsTableRowFragment_erc20TransferEvent on ERC20TransferEvent {\n  id\n  transaction_hash\n  from_address\n  from_erc20_identifier\n  from_contract {\n    is_social_verified\n    id\n  }\n  transfer_from_address\n  transfer_from_identifier\n  transfer_from_contract {\n    is_social_verified\n    id\n  }\n  transfer_to_address\n  transfer_to_identifier\n  transfer_to_contract {\n    is_social_verified\n    id\n  }\n  transfer_amount\n  transfer_amount_display\n  timestamp\n  main_call {\n    selector_identifier\n    id\n  }\n}\n',
        'variables': {
            'first': 100,
            'after': null,
            'input': {
                'transfer_from_or_to_address': address,
                'call_invocation_type': 'FUNCTION',
                'sort_by': 'timestamp',
                'order_by': 'desc'
            }
        }
    }
    let allTransfers = [];
    let results = await fetchTransfers(url, Json_data, headers);
    allTransfers.push(...results.transfers);
    while (results.hasNextPage) {
        Json_data['variables']['after'] = results.endCursor;
        results = await fetchTransfers(url, Json_data, headers);
        allTransfers.push(...results.transfers);
    }
    return allTransfers;
}

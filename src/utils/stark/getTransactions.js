import axios from "axios";
import {getTransfers} from "./getTransfers.js";

async function fetchTransactions(url, Json_data, headers) {
    const response = await axios.post(url, Json_data, {headers: headers});
    let transactions = [];
    response.data.data['transactions']['edges'].forEach((item) => {
        const {
            actual_fee_display,
            initiator_address,
            initiator_identifier,
            nonce,
            calldata,
            main_calls,
            timestamp,
            transaction_hash,
        } = item['node'];
        transactions.push({
            actual_fee_display,
            initiator_address,
            initiator_identifier,
            nonce,
            calldata,
            main_calls,
            timestamp,
            transaction_hash,
            transfers: []
        })
    });
    return {
        transactions: transactions,
        hasNextPage: response.data.data['transactions']['pageInfo']['hasNextPage'],
        endCursor: response.data.data['transactions']['pageInfo']['endCursor'],
    }
}

export default async function getTransactions(address) {
    const url = "https://graphql.starkscancdn.com/";
    const headers = {
        'authority': 'graphql.starkscancdn.com',
        'accept': 'application/json',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'content-type': 'application/json',
    }
    const Json_data = {
        'query': 'query TransactionsTableQuery(\n  $first: Int!\n  $after: String\n  $input: TransactionsInput!\n) {\n  ...TransactionsTablePaginationFragment_transactions_2DAjA4\n}\n\nfragment TransactionsTableExpandedItemFragment_transaction on Transaction {\n  entry_point_selector_name\n  calldata_decoded\n  entry_point_selector\n  calldata\n  initiator_address\n  initiator_identifier\n actual_fee\n  actual_fee_display\n main_calls {\n    selector\n    selector_name\n    calldata_decoded\n    selector_identifier\n    calldata\n    contract_address\n    contract_identifier\n    id\n  }\n}\n\nfragment TransactionsTablePaginationFragment_transactions_2DAjA4 on Query {\n  transactions(first: $first, after: $after, input: $input) {\n    edges {\n      node {\n        id\n        ...TransactionsTableRowFragment_transaction\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment TransactionsTableRowFragment_transaction on Transaction {\n  id\n  transaction_hash\n  block_number\n  transaction_status\n  transaction_type\n  timestamp\n  nonce\n contract_address\n  contract_identifier\n sender_address\n  sender_identifier\n initiator_address\n  initiator_identifier\n  initiator {\n    is_social_verified\n    id\n  }\n  main_calls {\n    selector_identifier\n    id\n  }\n  ...TransactionsTableExpandedItemFragment_transaction\n}\n',
        'variables': {
            'first': 100,
            'after': null,
            'input': {
                'initiator_address': address,
                'sort_by': 'timestamp',
                'order_by': 'desc',
                'min_block_number': null,
                'max_block_number': null,
                'min_timestamp': null,
                'max_timestamp': null
            }
        }
    };
    let allTransactions = [];
    let results = await fetchTransactions(url, Json_data, headers);
    allTransactions.push(...results.transactions);
    while (results.hasNextPage) {
        Json_data['variables']['after'] = results.endCursor;
        results = await fetchTransactions(url, Json_data, headers);
        allTransactions.push(...results.transactions);
    }
    const transfers = await getTransfers(address)
    transfers.forEach((transfer) => {
        allTransactions.forEach((transaction) => {
            if (transfer['transaction_hash'] === transaction['transaction_hash']) {
                transaction['transfers'].push(transfer)
            }
        })
    })
    // const localTransactions = JSON.parse(localStorage.getItem('stark_transactions'));
    // if (localTransactions === null) {
    //     localStorage.setItem('stark_transactions', JSON.stringify([{
    //         address: address,
    //         transactions: allTransactions
    //     }]))
    //     return allTransactions;
    // } else {
    //     const index = localTransactions.findIndex((item) => item.address === address);
    //     if (index === -1) {
    //         localTransactions.push({
    //             address: address,
    //             transactions: allTransactions
    //         })
    //     } else {
    //         localTransactions[index].transactions = allTransactions;
    //     }
    //     localStorage.setItem('stark_transactions', JSON.stringify(localTransactions));
    // }
    return {transfers, transactions: allTransactions}
}


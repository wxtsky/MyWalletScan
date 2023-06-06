import axios from "axios";
import { StarkApi } from "../../constants/apiKey";

async function processData(address, deposit_data, widthdraw_data, erc20TransferEventsData) {
    for (let i = 0; i < erc20TransferEventsData.length; i++) {
        const erc20TransferEventsDataItem = erc20TransferEventsData[i].node
        const transaction_hash = erc20TransferEventsDataItem['transaction_hash']
        const transfer_amount_display = erc20TransferEventsDataItem['transfer_amount_display']
        const transfer_from_address = erc20TransferEventsDataItem['transfer_from_address']
        const timestamp = erc20TransferEventsDataItem.timestamp
        const transfer_to_identifier = erc20TransferEventsDataItem['transfer_to_identifier']
        const method = erc20TransferEventsDataItem.main_call ? erc20TransferEventsDataItem.main_call['selector_identifier'] : null
        if (transfer_from_address === "0x0000000000000000000000000000000000000000000000000000000000000000" && method === "handle_deposit") {
            const from_erc20_identifier = erc20TransferEventsDataItem['from_erc20_identifier']
            if (from_erc20_identifier in deposit_data) {
                const amount = deposit_data[from_erc20_identifier]["amount"] += parseFloat(transfer_amount_display)
                const count = deposit_data[from_erc20_identifier]["count"] += 1
                deposit_data[from_erc20_identifier] = {
                    "amount": amount,
                    "count": count
                }
            } else {
                deposit_data[from_erc20_identifier] = {
                    "amount": parseFloat(transfer_amount_display),
                    "count": 1
                }
            }
        } else if (transfer_from_address === address) {
            if (method === "initiate_withdraw") {
                const from_erc20_identifier = erc20TransferEventsDataItem['from_erc20_identifier']
                if (from_erc20_identifier in widthdraw_data) {
                    const amount = widthdraw_data[from_erc20_identifier]["amount"] += parseFloat(transfer_amount_display)
                    const count = widthdraw_data[from_erc20_identifier]["count"] += 1
                    widthdraw_data[from_erc20_identifier] = {
                        "amount": amount,
                        "count": count
                    }
                } else {
                    widthdraw_data[from_erc20_identifier] = {
                        "amount": parseFloat(transfer_amount_display),
                        "count": 1
                    }
                }
            }
        }
    }
    return [deposit_data, widthdraw_data];

}

async function getStarkBridge(address) {
    try {
        const url = StarkApi;
        const headers = {
            'authority': 'starkscan.stellate.sh',
            'accept': 'application/json',
            'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'content-type': 'application/json',
        }
        const Json_data = {
            'query': 'query ERC20TransferEventsTableQuery(\n  $first: Int!\n  $after: String\n  $input: ERC20TransferEventsInput!\n) {\n  ...ERC20TransferEventsTablePaginationFragment_erc20TransferEvents_2DAjA4\n}\n\nfragment ERC20TransferEventsTablePaginationFragment_erc20TransferEvents_2DAjA4 on Query {\n  erc20TransferEvents(first: $first, after: $after, input: $input) {\n    edges {\n      node {\n        id\n        ...ERC20TransferEventsTableRowFragment_erc20TransferEvent\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment ERC20TransferEventsTableRowFragment_erc20TransferEvent on ERC20TransferEvent {\n  id\n  transaction_hash\n  from_address\n  from_erc20_identifier\n  from_contract {\n    is_social_verified\n    id\n  }\n  transfer_from_address\n  transfer_from_identifier\n  transfer_from_contract {\n    is_social_verified\n    id\n  }\n  transfer_to_address\n  transfer_to_identifier\n  transfer_to_contract {\n    is_social_verified\n    id\n  }\n  transfer_amount\n  transfer_amount_display\n  timestamp\n  main_call {\n    selector_identifier\n    id\n  }\n}\n',
            'variables': {
                'first': 30,
                'after': null,
                'input': {
                    'transfer_from_or_to_address': address,
                    'call_invocation_type': 'FUNCTION',
                    'sort_by': 'timestamp',
                    'order_by': 'desc'
                }
            }
        }
        let response = await axios.post(url, Json_data, {headers: headers});
        let erc20TransferEventsData = response.data.data['erc20TransferEvents']['edges']
        let deposit_data = {}
        let widthdraw_data = {}
        let hasNextPage = response.data.data['erc20TransferEvents']['pageInfo']['hasNextPage']
        let endCursor
        ([deposit_data, widthdraw_data] = await processData(address, deposit_data, widthdraw_data, erc20TransferEventsData));
        if (hasNextPage) {
            endCursor = response.data.data['erc20TransferEvents']['pageInfo']['endCursor']
        }
        while (hasNextPage === true) {
            Json_data.variables.after = endCursor
            let response2 = await axios.post(url, Json_data, {headers: headers});
            hasNextPage = response2.data.data['erc20TransferEvents']['pageInfo']['hasNextPage']
            if (hasNextPage === false) {
                endCursor = null
            } else {
                endCursor = response2.data.data['erc20TransferEvents']['pageInfo']['endCursor']
            }
            ([deposit_data, widthdraw_data] = await processData(address, deposit_data, widthdraw_data, response2.data.data['erc20TransferEvents']['edges']));
        }
        let total_deposit_count = 0;
        let total_widthdraw_count = 0;
        for (let key in deposit_data) {
            total_deposit_count += deposit_data[key]["count"]
        }
        for (let key in widthdraw_data) {
            total_widthdraw_count += widthdraw_data[key]["count"]
        }

        return {
            "d_eth_amount": deposit_data["StarkGate: ETH"] ? parseFloat(deposit_data["StarkGate: ETH"]["amount"]).toFixed(3) : 0,
            "d_eth_count": deposit_data["StarkGate: ETH"] ? deposit_data["StarkGate: ETH"]["count"] : 0,
            "d_usdc_amount": deposit_data["StarkGate: USDC"] ? parseFloat(deposit_data["StarkGate: USDC"]["amount"]).toFixed(3) : 0,
            "d_usdc_count": deposit_data["StarkGate: USDC"] ? deposit_data["StarkGate: USDC"]["count"] : 0,
            "d_usdt_amount": deposit_data["StarkGate: USDT"] ? parseFloat(deposit_data["StarkGate: USDT"]["amount"]).toFixed(3) : 0,
            "d_usdt_count": deposit_data["StarkGate: USDT"] ? deposit_data["StarkGate: USDT"]["count"] : 0,
            "d_dai_amount": deposit_data["StarkGate: DAI"] ? parseFloat(deposit_data["StarkGate: DAI"]["amount"]).toFixed(3) : 0,
            "d_dai_count": deposit_data["StarkGate: DAI"] ? deposit_data["StarkGate: DAI"]["count"] : 0,
            "d_wbtc_amount": deposit_data["StarkGate: WBTC"] ? parseFloat(deposit_data["StarkGate: WBTC"]["amount"]).toFixed(6) : 0,
            "d_wbtc_count": deposit_data["StarkGate: WBTC"] ? deposit_data["StarkGate: WBTC"]["count"] : 0,
            "w_eth_amount": widthdraw_data["StarkGate: ETH"] ? parseFloat(widthdraw_data["StarkGate: ETH"]["amount"]).toFixed(3) : 0,
            "w_eth_count": widthdraw_data["StarkGate: ETH"] ? widthdraw_data["StarkGate: ETH"]["count"] : 0,
            "w_usdc_amount": widthdraw_data["StarkGate: USDC"] ? parseFloat(widthdraw_data["StarkGate: USDC"]["amount"]).toFixed(3) : 0,
            "w_usdc_count": widthdraw_data["StarkGate: USDC"] ? widthdraw_data["StarkGate: USDC"]["count"] : 0,
            "w_usdt_amount": widthdraw_data["StarkGate: USDT"] ? parseFloat(widthdraw_data["StarkGate: USDT"]["amount"]).toFixed(3) : 0,
            "w_usdt_count": widthdraw_data["StarkGate: USDT"] ? widthdraw_data["StarkGate: USDT"]["count"] : 0,
            "w_dai_amount": widthdraw_data["StarkGate: DAI"] ? parseFloat(widthdraw_data["StarkGate: DAI"]["amount"]).toFixed(3) : 0,
            "w_dai_count": widthdraw_data["StarkGate: DAI"] ? widthdraw_data["StarkGate: DAI"]["count"] : 0,
            "w_wbtc_amount": widthdraw_data["StarkGate: WBTC"] ? parseFloat(widthdraw_data["StarkGate: WBTC"]["amount"]).toFixed(6) : 0,
            "w_wbtc_count": widthdraw_data["StarkGate: WBTC"] ? widthdraw_data["StarkGate: WBTC"]["count"] : 0,
            "total_deposit_count": total_deposit_count,
            "total_widthdraw_count": total_widthdraw_count
        }
    } catch (e) {
        return {
            "d_eth_amount": "Error",
            "d_eth_count": "Error",
            "d_usdc_amount": "Error",
            "d_usdc_count": "Error",
            "d_usdt_amount": "Error",
            "d_usdt_count": "Error",
            "d_dai_amount": "Error",
            "d_dai_count": "Error",
            "d_wbtc_amount": "Error",
            "d_wbtc_count": "Error",
            "w_eth_amount": "Error",
            "w_eth_count": "Error",
            "w_usdc_amount": "Error",
            "w_usdc_count": "Error",
            "w_usdt_amount": "Error",
            "w_usdt_count": "Error",
            "w_dai_amount": "Error",
            "w_dai_count": "Error",
            "w_wbtc_amount": "Error",
            "w_wbtc_count": "Error",
            "total_deposit_count": "Error",
            "total_widthdraw_count": "Error"
        }
    }
}

export default getStarkBridge;

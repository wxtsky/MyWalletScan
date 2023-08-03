import axios from 'axios';

export default async function getBalance(address) {
    try {
        const url = "https://starkscan.stellate.sh/"
        const data = {
            'query': 'query ERC20BalancesByOwnerAddressTableQuery(\n  $input: ERC20BalancesByOwnerAddressInput!\n) {\n  erc20BalancesByOwnerAddress(input: $input) {\n    id\n    ...ERC20BalancesByOwnerAddressTableRowFragment_erc20Balance\n  }\n}\n\nfragment ERC20BalancesByOwnerAddressTableRowFragment_erc20Balance on ERC20Balance {\n  id\n  contract_address\n  contract_erc20_identifier\n  contract_erc20_contract {\n    symbol\n    is_social_verified\n    icon_url\n    id\n  }\n  balance_display\n}\n',
            'variables': {
                'input': {
                    'owner_address': address,
                }
            }
        }
        const headers = {
            'authority': 'starkscan.stellate.sh',
            'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        }
        const response = await axios.post(url, data, {headers: headers});
        let balance = {
            'ETH': 0,
            'USDT': 0,
            'USDC': 0,
            "DAI": 0,
            "WBTC": 0,
        }
        response.data['data']['erc20BalancesByOwnerAddress'].forEach((token) => {
            if (token['contract_address'] === '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7') {
                balance['ETH'] = Number(parseFloat(token['balance_display'])).toFixed(3)
            } else if (token['contract_address'] === '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8') {
                balance['USDT'] = Number(parseFloat(token['balance_display'])).toFixed(3)
            } else if (token['contract_address'] === '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8') {
                balance['USDC'] = Number(parseFloat(token['balance_display'])).toFixed(3)
            } else if (token['contract_address'] === '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3') {
                balance['DAI'] = Number(parseFloat(token['balance_display'])).toFixed(3)
            } else if (token['contract_address'] === '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3') {
                balance['WBTC'] = Number(parseFloat(token['balance_display'])).toFixed(3)
            }
        })
        return balance
    } catch (e) {
        console.log(e)
        return {
            'ETH': '-',
            'USDT': '-',
            'USDC': '-',
            "DAI": '-',
            "WBTC": '-',
        }
    }

}



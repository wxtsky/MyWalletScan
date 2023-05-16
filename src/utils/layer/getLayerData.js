import axios from "axios";

const netMap = {
    "bsc": "https://api.bscscan.com",
    "ftm": "https://api.ftmscan.com",
    "metis": "https://andromeda-explorer.metis.io",
    "avax": "https://api.snowtrace.io",
    "matic": "https://api.polygonscan.com",
    "arb": "https://api.arbiscan.io",
    "op": "https://api-optimistic.etherscan.io",
    "eth": "https://api.etherscan.io"
}
const keyMap = {
    "bsc": "IHA6XUNGC9A8CS1EVB4ZKMMNCEVWQYWGNF",
    "ftm": "7NS7WM87WNYTDWXFRUP1QFVEGEMEWWTT1R",
    "metis": null,
    "avax": "XZVMR1A53KHXIEZV2X5QYZ2GSYFDDHUGVS",
    "matic": "5N7B38PZTENUK44XDF3WUPFFN68ICZ87Y3",
    "arb": "FTAT7G2F45P8VNVQG66SGF7T4TS6R2QFGY",
    "op": "C8JSVBMBI2NBBYWUJ99ZR2QCQ8GB33NFGB",
    "eth": "FPFT5EGK6F4JS97IA4E8SI24UN559W53VI"
}
let txMap = {}

async function getLayerData(address, apiKeyData) {
    console.log(apiKeyData)
    const txMapPromises = Object.keys(netMap).map(async (net) => {
        try {
            const u = netMap[net];
            let k;
            if (apiKeyData[net] !== undefined) {
                k = apiKeyData[net];
            }
            // const k = keyMap[net];
            let tx = 0;
            address = address.toLowerCase();
            let url;
            if (k === null) {
                url = `${u}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc`;
            } else {
                url = `${u}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=${k}`;
            }
            const res = await axios.get(url);
            for (let i = 0; i < res.data.result.length; i++) {
                const methodId = res.data.result[i].input.slice(0, 10);
                if (res.data.result[i].from === address && res.data.result[i]['txreceipt_status'] === "1") {
                    const methodIds =
                        ["0x9fbf10fc", "0x1114cd2a", "0xc858f5f9", "0x76a9099a", "0x2e15238c", "0xae30f6ee",
                         "0xc45dec27", "0x2cdf0b95", "0x879762e2", "0x656f3d64", "0x51905636", "0xad660825",
                         "0xfe359a0d", "0xca23bb4c"];
                    if (methodIds.includes(methodId)) {
                        tx += 1;
                    }
                }
            }
            return {net, tx};
        } catch (e) {
            console.log(e.message);
            return {net, tx: "error"};
        }
    });

    const txMapResults = await Promise.all(txMapPromises);
    let totalTx = 0;

    txMapResults.forEach(({net, tx}) => {
        if (tx !== "error") {
            totalTx += tx;
        }
        txMap[net] = tx;
    });

    txMap["total"] = totalTx;
    return txMap;
}

export default getLayerData

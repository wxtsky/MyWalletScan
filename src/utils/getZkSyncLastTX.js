import axios from "axios";

async function getZkSyncLastTX(address) {
    const url = "https://zksync2-mainnet-explorer.zksync.io/transactions?limit=5&direction=older&accountAddress=" + address;
    try {
        const response = await axios.get(url);
        if (response.data.total === 0) {
            return {"zkSyncLastTx": "无交易"}
        } else {
            const lastTxDatetime = response.data.list[0].receivedAt;
            const date = new Date(lastTxDatetime);
            const offset = 8;
            const utc8Date = new Date(date.getTime() + offset * 3600 * 1000);
            const now = new Date();
            const utc8Now = new Date(now.getTime() + offset * 3600 * 1000);
            const diff = utc8Now - utc8Date;
            const diffInHours = Math.floor(diff / (1000 * 60 * 60));
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays > 0) {
                return {"zkSyncLastTx": `${diffInDays} 天前`}
            } else if (diffInHours > 0) {
                return {"zkSyncLastTx": `${diffInHours} 小时前`}
            } else {
                return {"zkSyncLastTx": "刚刚"}
            }
        }
    } catch (error) {
        console.error(error);
        return {"zkSyncLastTx": "Error"};
    }
}

export default getZkSyncLastTX;

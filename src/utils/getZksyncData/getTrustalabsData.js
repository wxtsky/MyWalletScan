import axios from "axios";

const getTrustalabsData = async (address, isGetTrustalabsData) => {
    let result;
    if (!isGetTrustalabsData) {
        result = {
            score: '-',
            rank: '-',
            top: '-'
        }
        return result;
    }
    try {
        const url = "https://mp.trustalabs.ai/zksyncera/score?account=" + address.toLowerCase() + "&chainId=324"
        const headers = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'Authorization': 'TOKEN',
            'Connection': 'keep-alive',
        }
        const res = await axios.get(url, {headers});
        if (res.data.message === "request success") {
            const score = res.data.data.score;
            const rank = res.data.data['rankValue']['rank'];
            const total = res.data.data['rankValue']['total'];
            const top = (Number(rank) / Number(total) * 100).toFixed(1)
            result = {
                score: Number(score).toFixed(0),
                rank,
                top
            }
        } else {
            result = {
                score: 0,
                rank: -1,
                top: 100
            }
        }
    } catch (e) {
        result = {
            score: '-',
            rank: '-',
            top: '-'
        }
    }
    return result;
}
export default getTrustalabsData;

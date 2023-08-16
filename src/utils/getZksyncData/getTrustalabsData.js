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
        const url = "https://mp.trustalabs.ai/zksyncera/score?account=" + address + "&chainId=324"
        const res = await axios.get(url);
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
        console.log(e.message)
    }
    return result;
}
export default getTrustalabsData;

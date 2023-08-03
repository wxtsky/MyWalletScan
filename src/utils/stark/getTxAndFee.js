import {getTimeAgo} from "./utils.js";

const getTxAndFee = async (transcations) => {
    try {
        if (!transcations) return {
            tx: 0,
            lastTime: '无交易',
            fee: 0
        }
        let fee = 0;
        transcations.forEach((transaction) => {
            fee += parseFloat(transaction['actual_fee_display']);
        })
        const tx = transcations[0]['nonce']
        const lastTimeStamp = transcations[0]['timestamp']
        const lastTime = getTimeAgo(lastTimeStamp) || '无交易'
        return {
            tx,
            lastTime,
            fee: Number(fee).toFixed(3)
        }
    } catch (e) {
        return {
            tx: '-',
            lastTime: '-',
            fee: '-'
        }
    }

}
export default getTxAndFee;

import {dbConfig, getAllKeys, initDB} from "@utils/indexedDB/main.js";

const getDBTranscationsData = async (chain) => {
    await initDB(dbConfig)
    if (chain === 'zkSync') {
        return await getAllKeys('zkTransactions')
    } else if (chain === 'stark') {
        return await getAllKeys('starkTransactions')
    }
}
export default getDBTranscationsData

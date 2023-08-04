import {dbConfig, initDB} from "@utils/indexedDB/main.js";

const initPage = async () => {
    await initDB(dbConfig)
    const item = window.localStorage.getItem('stark_transactions');
    if (item) {
        window.localStorage.removeItem('stark_transactions');
    }
    const item2 = window.localStorage.getItem('zkSync_transactions');
    if (item2) {
        window.localStorage.removeItem('zkSync_transactions');
    }
}
export default initPage;

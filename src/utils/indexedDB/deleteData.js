import {dbConfig, get, initDB, remove} from "@utils/indexedDB/main.js";

const deleteData = async (storeName, keys) => {
    try {
        await initDB(dbConfig)
        const promises = keys.map(async key => {
            const result = await get(storeName, key)
            console.log(result)
            if (result) {
                await remove(storeName, key)
            }
        });

        await Promise.all(promises);
    } catch (e) {
        console.log(e)
    }

}

export default deleteData

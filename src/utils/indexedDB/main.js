import {openDB} from 'idb';

let db = null;

export const initDB = async (config) => {
    try {
        db = await openDB(config.name, config.version, {
            upgrade(db) {
                config.objectStoresMeta.forEach(meta => {
                    if (!db.objectStoreNames.contains(meta.store)) {
                        let store = db.createObjectStore(meta.store, meta.storeConfig);
                        meta.storeSchema.forEach(schema => {
                            store.createIndex(schema.key, schema.value);
                        });
                    }
                });
            },
        });
    } catch (err) {
        console.error('Failed to open db:', err);
    }
};

export const add = async (storeName, value) => {
    try {
        return db?.add(storeName, value);
    } catch (err) {
        console.error('Failed to add:', err);
        return null;
    }
};

export const get = async (storeName, key) => {
    try {
        return db?.get(storeName, key);
    } catch (err) {
        console.error('Failed to get:', err);
        return null;
    }
};

export const remove = async (storeName, key) => {
    try {
        return db?.delete(storeName, key);
    } catch (err) {
        console.error('Failed to remove:', err);
        return null;
    }
};

export const update = async (storeName, value) => {
    try {
        return db?.put(storeName, value);
    } catch (err) {
        console.error('Failed to update:', err);
        return null;
    }
};
export const getAllKeys = async (storeName) => {
    try {
        let tx = db.transaction(storeName, 'readonly'); // Corrected this line
        let store = tx.objectStore(storeName);
        return await store.getAllKeys();
    } catch (err) {
        console.error('Failed to get all keys:', err);
        return null;
    }
}


export const dbConfig = {
    name: "BitBoxTools",
    version: 2,
    objectStoresMeta: [
        {
            store: "starkTransactions",
            storeConfig: {keyPath: "address", autoIncrement: false},
            storeSchema: [
                {key: "address", value: "address"},
                {key: "data", value: "data"},
            ]
        },
        {
            store: "zkTransactions",
            storeConfig: {keyPath: "address", autoIncrement: false},
            storeSchema: [
                {key: "address", value: "address"},
                {key: "data", value: "data"},
            ]
        },
        {
            store: "zkProtocol",
            storeConfig: {keyPath: "address", autoIncrement: false},
            storeSchema: [
                {key: "address", value: "address"},
                {key: "data", value: "data"},
            ]
        }
    ],
};

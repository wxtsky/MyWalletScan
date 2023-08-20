const RestoreData = async (data, isDeleteOld) => {
    const addressTypes = [
        "addresses",
        "stark_addresses",
        "l0_addresses",
        "linea_addresses",
    ];

    if (isDeleteOld) {
        addressTypes.forEach((type) => {
            window.localStorage.removeItem(type);
        });
        Object.keys(data).forEach((localStorageKey) => {
            const item = data[localStorageKey];
            if (item) {
                item.forEach((address, index) => {
                    address.key = index;
                    address.result = "success"
                })
                window.localStorage.setItem(localStorageKey, JSON.stringify(item));
            }
        });
    } else {
        // 保留旧数据
        const oldData = {};
        addressTypes.forEach((type) => {
            const localStorageData = window.localStorage.getItem(type);
            if (localStorageData) {
                oldData[type] = JSON.parse(localStorageData);
            }
        });

        // 合并新数据到旧数据
        Object.keys(data).forEach((localStorageKey) => {
            const newItem = data[localStorageKey];
            if (newItem) {
                const oldItem = oldData[localStorageKey] || [];
                newItem.forEach((address) => {
                    const existingAddress = oldItem.find((oldAddress) => oldAddress.address === address.address);
                    if (!existingAddress) {
                        oldItem.push(address);
                    }
                });
                oldData[localStorageKey] = oldItem;
            }
        });

        // 为合并后的数据分配新的 key 值
        Object.keys(oldData).forEach((localStorageKey) => {
            const item = oldData[localStorageKey];
            if (item) {
                item.forEach((address, index) => {
                    address.key = index;
                    address.result = "success"
                });
            }
        });

        // 更新 localStorage 中的数据
        Object.keys(oldData).forEach((localStorageKey) => {
            const item = oldData[localStorageKey];
            if (item) {
                window.localStorage.setItem(localStorageKey, JSON.stringify(item));
            }
        });
    }
};

export default RestoreData;

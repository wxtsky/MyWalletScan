import {saveAs} from 'file-saver';

const BackupData = async () => {
    const addressTypes = [
        "addresses",
        "stark_addresses",
        "l0_addresses",
        "linea_addresses",
    ];

    const data = {};
    addressTypes.forEach((type) => {
        const localStorageData = window.localStorage.getItem(type);
        if (localStorageData) {
            data[type] = JSON.parse(localStorageData).map((address) => ({
                key: address.key,
                address: address.address,
                name: address.name || "",
            }));
        }
    });

    const blob = new Blob([JSON.stringify(data)], {type: "application/json;charset=utf-8"});
    await saveAs(blob, "myWalletAddress.json");
};

export default BackupData;

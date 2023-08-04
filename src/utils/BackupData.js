// import {saveAs} from 'file-saver';

const BackupData = () => {
    let data = {
        "zkSync": [],
        "starkNet": [],
        "l0": [],
    }
    const item = window.localStorage.getItem("addresses")
    if (item) {
        JSON.parse(item).forEach((address) => {
            data['zkSync'].push({
                "address": address.address,
                "name": address.name ? address.name : "",
            })
        })
    }
    const item2 = window.localStorage.getItem("stark_addresses")
    if (item2) {
        JSON.parse(item2).forEach((address) => {
            data['starkNet'].push({
                "address": address.address,
                "name": address.name ? address.name : "",
            })
        })
    }
    const item3 = window.localStorage.getItem("l0_addresses")
    if (item3) {
        JSON.parse(item3).forEach((address) => {
            data['l0'].push({
                "address": address.address,
                "name": address.name ? address.name : "",
            })
        })
    }
    const blob = new Blob([JSON.stringify(data)], {type: "application/json;charset=utf-8"});
    // saveAs(blob, "myAddressDetailBackUp.json");
}
export default BackupData;

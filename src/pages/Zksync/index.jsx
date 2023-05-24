import {
    Button,
    Input,
    Space,
    Table,
    Modal,
    Form,
    notification,
    Spin,
    Tag,
    Popconfirm,
    Row, Col, InputNumber, Badge, message, Switch, Pagination
} from 'antd';
import {
    getEthBalance,
    getTxCount,
    getZksEra,
    getZksLite,
    getZkSyncLastTX,
    getZkSyncBridge,
    exportToExcel
} from "@utils"
import {useEffect, useState} from "react";
import './index.css';
import {Layout, Card} from 'antd';

const {Content} = Layout;
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    PlusOutlined, SettingOutlined,
    SyncOutlined,
    UploadOutlined
} from "@ant-design/icons";

const {TextArea} = Input;

function Zksync() {
    const [batchProgress, setBatchProgress] = useState(0);
    const [batchLength, setBatchLength] = useState(0);
    const [batchloading, setBatchLoading] = useState(false);
    const [zkSyncConfigStore, setZkSyncConfigStore] = useState({});
    const [data, setData] = useState([]);
    const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
    const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);
    const [batchForm] = Form.useForm();
    const [walletForm] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    useEffect(() => {
        setBatchProgress(0);
        const zksync_config = localStorage.getItem('zksync_config');
        if (zksync_config) {
            const config = JSON.parse(zksync_config);
            setZkSyncConfigStore(config);
            walletForm.setFieldsValue(config);
        } else {
            setZkSyncConfigStore(
                {
                    "ETHTx": null,
                    "zkSyncLiteMinTx": null,
                    "zkSyncEraMinTx": null,
                    "dayMin": null,
                    "weekMin": null,
                    "monthMin": null,
                    "L1ToL2Tx": null,
                    "L2ToL1Tx": null,
                    "L1ToL2ETH": null,
                    "L2ToL1ETH": null,
                    "gasFee": null,
                    "contractMin": null,
                    "totalAmount": null,
                }
            )
        }
    }, []);
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (values.address.length !== 42) {
                notification.error({
                    message: "错误",
                    description: "请输入正确的地址",
                }, 2);
                return;
            }
            setIsModalVisible(false);
            const index = data.findIndex(item => item.address === values.address);
            if (index !== -1) {
                setData(data.map((item, i) => {
                    if (i === index) {
                        return {
                            ...item,
                            name: values.name,
                        }
                    }
                    return item;
                }));
                const updatedData = [...data];
                getZksEra(values.address).then(({balance2, tx2, usdcBalance}) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        zks2_balance: balance2,
                        zks2_tx_amount: tx2,
                        zks2_usdcBalance: usdcBalance,
                    };
                    setData(updatedData);
                    localStorage.setItem('addresses', JSON.stringify(data));
                })
                getZkSyncLastTX(values.address).then(({zkSyncLastTx}) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        zks2_last_tx: zkSyncLastTx,
                    };
                    setData(updatedData);
                    localStorage.setItem('addresses', JSON.stringify(data));

                })
                getZksLite(values.address).then(({balance1, tx1}) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        zks1_balance: balance1,
                        zks1_tx_amount: tx1,
                    };
                    setData(updatedData);
                    localStorage.setItem('addresses', JSON.stringify(data));

                })
                getEthBalance(values.address, "ethereum").then((eth_balance) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        eth_balance,
                    };
                    setData(updatedData);
                    localStorage.setItem('addresses', JSON.stringify(data));

                })
                getTxCount(values.address, "ethereum").then((eth_tx_amount) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        eth_tx_amount,
                    };
                    setData(updatedData);
                    localStorage.setItem('addresses', JSON.stringify(data));
                })
                getZkSyncBridge(values.address).then(({
                                                          totalExchangeAmount,
                                                          totalFee,
                                                          contractActivity,
                                                          dayActivity,
                                                          weekActivity,
                                                          monthActivity,
                                                          l1Tol2Times,
                                                          l1Tol2Amount,
                                                          l2Tol1Times,
                                                          l2Tol1Amount
                                                      }) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        totalExchangeAmount,
                        totalFee,
                        contractActivity,
                        dayActivity,
                        weekActivity,
                        monthActivity,
                        l1Tol2Times,
                        l1Tol2Amount,
                        l2Tol1Times,
                        l2Tol1Amount,
                    };
                    setData(updatedData);
                    localStorage.setItem('addresses', JSON.stringify(data));
                })
            } else {
                const newEntry = {
                    key: data.length.toString(),
                    name: values.name,
                    address: values.address,
                    eth_balance: null,
                    eth_tx_amount: null,
                    zks2_balance: null,
                    zks2_tx_amount: null,
                    zks2_usdcBalance: null,
                    zks2_last_tx: null,
                    zks1_balance: null,
                    zks1_tx_amount: null,
                    dayActivity: null,
                    weekActivity: null,
                    monthActivity: null,
                    l1Tol2Times: null,
                    l1Tol2Amount: null,
                    l2Tol1Times: null,
                    l2Tol1Amount: null,
                    contractActivity: null,
                    totalFee: null,
                    totalExchangeAmount: null,
                };
                const newData = [...data, newEntry];
                setData(newData);
                getZksEra(values.address).then(({balance2, tx2, usdcBalance}) => {
                    newEntry.zks2_balance = balance2;
                    newEntry.zks2_tx_amount = tx2;
                    newEntry.zks2_usdcBalance = usdcBalance;
                    setData([...newData]);
                    localStorage.setItem('addresses', JSON.stringify(newData));
                })
                getZkSyncLastTX(values.address).then(({zkSyncLastTx}) => {
                    newEntry.zks2_last_tx = zkSyncLastTx;
                    setData([...newData]);
                    localStorage.setItem('addresses', JSON.stringify(newData));

                })
                getZksLite(values.address).then(({balance1, tx1}) => {
                    newEntry.zks1_balance = balance1;
                    newEntry.zks1_tx_amount = tx1;
                    setData([...newData]);
                    localStorage.setItem('addresses', JSON.stringify(newData));

                })
                getEthBalance(values.address, "ethereum").then((eth_balance) => {
                    newEntry.eth_balance = eth_balance;
                    setData([...newData]);
                    localStorage.setItem('addresses', JSON.stringify(newData));

                })
                getTxCount(values.address, "ethereum").then((eth_tx_amount) => {
                    newEntry.eth_tx_amount = eth_tx_amount;
                    setData([...newData]);
                    localStorage.setItem('addresses', JSON.stringify(newData));
                })
                getZkSyncBridge(values.address).then(({
                                                          totalExchangeAmount,
                                                          totalFee,
                                                          contractActivity,
                                                          dayActivity,
                                                          weekActivity,
                                                          monthActivity,
                                                          l1Tol2Times,
                                                          l1Tol2Amount,
                                                          l2Tol1Times,
                                                          l2Tol1Amount
                                                      }) => {
                    newEntry.totalFee = totalFee;
                    newEntry.contractActivity = contractActivity;
                    newEntry.dayActivity = dayActivity;
                    newEntry.weekActivity = weekActivity;
                    newEntry.monthActivity = monthActivity;
                    newEntry.l1Tol2Times = l1Tol2Times;
                    newEntry.l1Tol2Amount = l1Tol2Amount;
                    newEntry.l2Tol1Times = l2Tol1Times;
                    newEntry.l2Tol1Amount = l2Tol1Amount;
                    newEntry.totalExchangeAmount = totalExchangeAmount;
                    setData([...newData]);
                    localStorage.setItem('addresses', JSON.stringify(newData));
                })
            }
        } catch (error) {
            notification.error({
                message: "错误",
                description: error.message,
            }, 2);
        } finally {
            form.resetFields();
        }
    }
    const handleRefresh = async () => {
        if (!selectedKeys.length) {
            notification.error({
                message: "错误",
                description: "请先选择要刷新的地址",
            }, 2);
            return;
        }
        setIsLoading(true);
        try {
            const limit = 50;
            let activePromises = 0;
            let promisesQueue = [];
            const newData = [...data];
            const processQueue = () => {
                while (activePromises < limit && promisesQueue.length > 0) {
                    const promise = promisesQueue.shift();
                    activePromises += 1;

                    promise().finally(() => {
                        activePromises -= 1;
                        processQueue();
                    });
                }
            };
            for (let key of selectedKeys) {
                const index = newData.findIndex(item => item.key === key);
                if (index !== -1) {
                    const item = newData[index];

                    promisesQueue.push(() => {
                        item.zks2_balance = null;
                        item.zks2_tx_amount = null;
                        item.zks2_usdcBalance = null;
                        return getZksEra(item.address).then(({balance2, tx2, usdcBalance}) => {
                            item.zks2_balance = balance2;
                            item.zks2_tx_amount = tx2;
                            item.zks2_usdcBalance = usdcBalance;
                            setData([...newData]);
                            localStorage.setItem('addresses', JSON.stringify(newData));
                        })
                    });
                    promisesQueue.push(() => {
                        item.zks2_last_tx = null;
                        return getZkSyncLastTX(item.address).then(({zkSyncLastTx}) => {
                            item.zks2_last_tx = zkSyncLastTx;
                            setData([...newData]);
                            localStorage.setItem('addresses', JSON.stringify(newData));
                        })
                    });
                    promisesQueue.push(() => {
                        item.zks1_balance = null;
                        item.zks1_tx_amount = null;
                        return getZksLite(item.address).then(({balance1, tx1}) => {
                            item.zks1_balance = balance1;
                            item.zks1_tx_amount = tx1;
                            setData([...newData]);
                            localStorage.setItem('addresses', JSON.stringify(newData));
                        })
                    });
                    promisesQueue.push(() => {
                        item.eth_balance = null;
                        return getEthBalance(item.address, "ethereum").then((eth_balance) => {
                            item.eth_balance = eth_balance;
                            setData([...newData]);
                            localStorage.setItem('addresses', JSON.stringify(newData));
                        })
                    });
                    promisesQueue.push(() => {
                        item.eth_tx_amount = null;
                        return getTxCount(item.address, "ethereum").then((eth_tx_amount) => {
                            item.eth_tx_amount = eth_tx_amount;
                            setData([...newData]);
                            localStorage.setItem('addresses', JSON.stringify(newData));
                        })
                    });
                    promisesQueue.push(() => {
                        item.totalExchangeAmount = null;
                        item.totalFee = null;
                        item.contractActivity = null;
                        item.dayActivity = null;
                        item.weekActivity = null;
                        item.monthActivity = null;
                        item.l1Tol2Times = null;
                        item.l1Tol2Amount = null;
                        item.l2Tol1Times = null;
                        item.l2Tol1Amount = null;
                        return getZkSyncBridge(item.address).then(({
                                                                       totalExchangeAmount,
                                                                       totalFee,
                                                                       contractActivity,
                                                                       dayActivity,
                                                                       weekActivity,
                                                                       monthActivity,
                                                                       l1Tol2Times,
                                                                       l1Tol2Amount,
                                                                       l2Tol1Times,
                                                                       l2Tol1Amount
                                                                   }) => {
                            item.totalExchangeAmount = totalExchangeAmount;
                            item.totalFee = totalFee;
                            item.contractActivity = contractActivity;
                            item.dayActivity = dayActivity;
                            item.weekActivity = weekActivity;
                            item.monthActivity = monthActivity;
                            item.l1Tol2Times = l1Tol2Times;
                            item.l1Tol2Amount = l1Tol2Amount;
                            item.l2Tol1Times = l2Tol1Times;
                            item.l2Tol1Amount = l2Tol1Amount;
                            setData([...newData]);
                            localStorage.setItem('addresses', JSON.stringify(newData));
                        })
                    });
                }
                processQueue();
            }
            while (activePromises > 0 || promisesQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        } catch (error) {
            notification.error({
                message: "错误",
                description: error.message,
            }, 2);
        } finally {
            setIsLoading(false);
            setSelectedKeys([]);
            message.success("刷新成功");
        }
    };

    const handleBatchOk = async () => {
        try {
            setBatchLoading(true);
            setIsBatchModalVisible(false);
            const values = await batchForm.validateFields();
            const addresses = values.addresses.split("\n");
            setBatchLength(addresses.length);
            const newData = [...data];
            const limit = 50;
            let activePromises = 0;
            let promisesQueue = [];
            setBatchProgress(0);
            const processQueue = () => {
                while (promisesQueue.length > 0 && activePromises < limit) {
                    const promise = promisesQueue.shift();
                    activePromises += 1;

                    promise().finally(() => {
                        activePromises -= 1;
                        processQueue();
                    });
                }
            };

            for (let address of addresses) {
                address = address.trim();
                if (address.length !== 42) {
                    notification.error({
                        message: "错误",
                        description: "请输入正确的地址",
                    });
                    continue;
                }
                let promiseWithProgress = () => {
                    return new Promise((resolve, reject) => {
                        setBatchProgress(prevProgress => prevProgress + 1);
                        resolve();
                    });
                };
                const index = newData.findIndex(item => item.address === address);
                const item = index !== -1 ? newData[index] : {
                    key: newData.length.toString(),
                    address: address,
                    eth_balance: null,
                    eth_tx_amount: null,
                    zks2_balance: null,
                    zks2_tx_amount: null,
                    zks2_usdcBalance: null,
                    zks1_balance: null,
                    zks1_tx_amount: null,
                    zks2_last_tx: null,
                    dayActivity: null,
                    weekActivity: null,
                    monthActivity: null,
                    l1Tol2Times: null,
                    l1Tol2Amount: null,
                    l2Tol1Times: null,
                    l2Tol1Amount: null,
                    contractActivity: null,
                    totalFee: null,
                    totalExchangeAmount: null,
                };
                if (index === -1) {
                    newData.push(item);
                }
                promisesQueue.push(() => getZksEra(address).then(({balance2, tx2, usdcBalance}) => {
                    item.zks2_balance = balance2;
                    item.zks2_tx_amount = tx2;
                    item.zks2_usdcBalance = usdcBalance;
                }));

                promisesQueue.push(() => getZkSyncLastTX(address).then(({zkSyncLastTx}) => {
                    item.zks2_last_tx = zkSyncLastTx;
                }));

                promisesQueue.push(() => getZksLite(address).then(({balance1, tx1}) => {
                    item.zks1_balance = balance1;
                    item.zks1_tx_amount = tx1;
                }));

                promisesQueue.push(() => getEthBalance(address, "ethereum").then((eth_balance) => {
                    item.eth_balance = eth_balance;
                }));

                promisesQueue.push(() => getTxCount(address, "ethereum").then((eth_tx_amount) => {
                    item.eth_tx_amount = eth_tx_amount;
                }));

                promisesQueue.push(() => getZkSyncBridge(address).then(({
                                                                            totalExchangeAmount,
                                                                            totalFee,
                                                                            contractActivity,
                                                                            dayActivity,
                                                                            weekActivity,
                                                                            monthActivity,
                                                                            l1Tol2Times,
                                                                            l1Tol2Amount,
                                                                            l2Tol1Times,
                                                                            l2Tol1Amount
                                                                        }) => {
                    item.totalExchangeAmount = totalExchangeAmount;
                    item.totalFee = totalFee;
                    item.contractActivity = contractActivity;
                    item.dayActivity = dayActivity;
                    item.weekActivity = weekActivity;
                    item.monthActivity = monthActivity;
                    item.l1Tol2Times = l1Tol2Times;
                    item.l1Tol2Amount = l1Tol2Amount;
                    item.l2Tol1Times = l2Tol1Times;
                    item.l2Tol1Amount = l2Tol1Amount;
                }));
                promisesQueue.push(promiseWithProgress);
                processQueue();

            }
            while (activePromises > 0 || promisesQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            setData(newData);
            localStorage.setItem('addresses', JSON.stringify(newData));
        } catch (error) {
            notification.error({
                message: "错误",
                description: error.message,
            });
        } finally {
            setBatchLoading(false);
            setBatchProgress(0);
            batchForm.resetFields();
            setSelectedKeys([]);
            message.success("批量添加成功");
        }
    };


    const showModal = () => {
        setIsModalVisible(true);
    };
    const showBatchModal = () => {
        setIsBatchModalVisible(true);
    };
    const exportToExcelFile = () => {
        exportToExcel(data, 'walletInfo');
    }
    useEffect(() => {
        setTableLoading(true);
        const storedAddresses = localStorage.getItem('addresses');
        setTimeout(() => {
            setTableLoading(false);
        }, 500);
        if (storedAddresses) {
            setData(JSON.parse(storedAddresses));
        }
    }, []);
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleDelete = (key) => {
        setData(data.filter(item => item.key !== key));
        localStorage.setItem('addresses', JSON.stringify(data.filter(item => item.key !== key)));
    }
    const handleDeleteSelected = () => {
        if (!selectedKeys.length) {
            notification.error({
                message: "错误",
                description: "请先选择要删除的地址",
            }, 2);
            return;
        }
        setData(data.filter(item => !selectedKeys.includes(item.key)));
        localStorage.setItem('addresses', JSON.stringify(data.filter(item => !selectedKeys.includes(item.key))));
        setSelectedKeys([]);
    }
    const rowSelection = {
        selectedRowKeys: selectedKeys,
        onChange: (selectedRowKeys) => {
            setSelectedKeys(selectedRowKeys);
        },
    };
    const handleBatchCancel = () => {
        setIsBatchModalVisible(false);
    };
    const [editingKey, setEditingKey] = useState(null);
    const columns = [
        {
            title: "#",
            key: "index",
            align: "center",
            render: (text, record, index) => index + 1,
            // width: 34.5,
        },
        {
            title: "备注",
            dataIndex: "name",
            key: "name",
            align: "center",
            render: (text, record) => {
                const isEditing = record.key === editingKey;
                return isEditing ? (
                    <Input
                        placeholder="请输入备注"
                        defaultValue={text}
                        onPressEnter={(e) => {
                            record.name = e.target.value;
                            setData([...data]);
                            localStorage.setItem('addresses', JSON.stringify(data));
                            setEditingKey(null);
                        }}
                    />
                ) : (
                    <>
                        <Tag color="blue">{text}</Tag>
                        <Button
                            shape="circle"
                            icon={<EditOutlined/>}
                            size={"small"}
                            onClick={() => setEditingKey(record.key)}
                        />
                    </>
                );
            },
            // width: 70
        },
        {
            title: "钱包地址",
            dataIndex: "address",
            key: "address",
            align: "center",
            render: (text, record) => {
                return isRowSatisfyCondition(record) ?
                    <div
                        style={{backgroundColor: '#bbeefa', borderRadius: '5px'}}
                    >
                        {text}</div> : text ||
                    <Spin/>;
            },
            // width: 375
        },
        {
            title: "ETH",
            key: "eth_group",
            className: "zks_eth",
            children: [
                {
                    title: "ETH",
                    dataIndex: "eth_balance",
                    key: "eth_balance",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> : text),
                    // width: 60
                },
                {
                    title: "Tx",
                    dataIndex: "eth_tx_amount",
                    key: "eth_tx_amount",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> : text),
                    // width: 40
                },
            ],
        },
        {
            title: "zkSyncLite",
            key: "zks_lite_group",
            className: "zks_lite",
            children: [
                {
                    title: "ETH",
                    dataIndex: "zks1_balance",
                    key: "zks1_balance",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> : text),
                    // width: 60
                },
                {
                    title: "Tx",
                    dataIndex: "zks1_tx_amount",
                    key: "zks1_tx_amount",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> : text),
                    // width: 34.5
                },
            ],
        },
        {
            title: "zkSyncEra",
            key: "zks_era_group",
            className: "zks_era",
            children: [
                {
                    title: "ETH",
                    dataIndex: "zks2_balance",
                    key: "zks2_balance",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> : text),
                    // width: 60
                },
                {
                    title: "USDC",
                    dataIndex: "zks2_usdcBalance",
                    key: "zks2_usdcBalance",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> : text),
                    // width: 63
                },
                {
                    title: "Tx",
                    dataIndex: "zks2_tx_amount",
                    key: "zks2_tx_amount",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> : text),
                    // width: 34.2
                },
                {
                    title: "最后交易",
                    dataIndex: "zks2_last_tx",
                    key: "zks2_last_tx",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> :
                        <a href={"https://explorer.zksync.io/address/" + record.address}
                           target={"_blank"}>{text}</a>),
                    // width: 77
                },
                {
                    title: "官方桥跨链Tx数",
                    key: "cross_chain_tx_count_group",
                    children: [
                        {
                            title: "L1->L2",
                            dataIndex: "l1Tol2Times",
                            key: "l1Tol2Times",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                            // width: 60
                        },
                        {
                            title: "L2->L1",
                            dataIndex: "l2Tol1Times",
                            key: "l2Tol1Times",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                            // width: 60
                        },
                    ],
                },
                {
                    title: "官方桥跨链金额(ETH)",
                    key: "cross_chain_amount_group",
                    children: [
                        {
                            title: "L1->L2",
                            dataIndex: "l1Tol2Amount",
                            key: "l1Tol2Amount",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                            // width: 75
                        },
                        {
                            title: "L2->L1",
                            dataIndex: "l2Tol1Amount",
                            key: "l2Tol1Amount",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                            // width: 75
                        },
                    ],
                },
                {
                    title: "活跃统计",
                    key: "activity_stats_group",
                    children: [
                        {
                            title: "日",
                            dataIndex: "dayActivity",
                            key: "dayActivity",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                            // width: 34
                        },
                        {
                            title: "周",
                            dataIndex: "weekActivity",
                            key: "weekActivity",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                            // width: 34
                        },
                        {
                            title: "月",
                            dataIndex: "monthActivity",
                            key: "monthActivity",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                            // width: 34
                        },
                        {
                            title: "不同合约",
                            dataIndex: "contractActivity",
                            key: "contractActivity",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                            // width: 73.5
                        },
                        {
                            title: "金额(U)",
                            dataIndex: "totalExchangeAmount",
                            key: "totalExchangeAmount",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                        },
                        {
                            title: "FeeΞ",
                            dataIndex: "totalFee",
                            key: "totalFee",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                            // width: 61.5
                        }
                    ],
                },
            ],
        },
        {
            title: "操作",
            key: "action",
            align: "center",
            render: (text, record) => (
                <Space size="small">
                    <Popconfirm title={"确认删除？"} onConfirm={() => handleDelete(record.key)}>
                        <Button icon={<DeleteOutlined/>}/>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    const handleWalletOk = () => {
        const values = walletForm.getFieldsValue();
        localStorage.setItem('zksync_config', JSON.stringify(values));
        setZkSyncConfigStore(values);
        setIsWalletModalVisible(false);
        console.log(zkSyncConfigStore)
    };
    const FormItem = ({name, addonBefore, addonAfter}) => (
        <Form.Item name={name}>
            <InputNumber min={0} style={{width: '100%'}}
                         addonBefore={addonBefore} addonAfter={addonAfter}
            />
        </Form.Item>
    );
    const isRowSatisfyCondition = (record) => {
        const conditionKeyMapping = {
            "ETHTx": "eth_tx_amount",
            "zkSyncLiteMinTx": "zks1_tx_amount",
            "zkSyncEraMinTx": "zks2_tx_amount",
            "L1ToL2Tx": "l1Tol2Times",
            "L2ToL1Tx": "l2Tol1Times",
            "L1ToL2ETH": "l1Tol2Amount",
            "L2ToL1ETH": "l2Tol1Amount",
            "contractMin": "contractActivity",
            "dayMin": "dayActivity",
            "weekMin": "weekActivity",
            "monthMin": "monthActivity",
            "gasFee": "totalFee",
            "totalAmount": "totalExchangeAmount",
        };
        return Object.keys(conditionKeyMapping).every((conditionKey) => {
            if (!(conditionKey in zkSyncConfigStore) || zkSyncConfigStore[conditionKey] === null || zkSyncConfigStore[conditionKey] === undefined) {
                return true;
            }
            const recordKey = conditionKeyMapping[conditionKey];
            return Number(record[recordKey]) >= Number(zkSyncConfigStore[conditionKey])
        });
    };

    return (
        <div>
            <Content>
                <Modal title="批量添加地址" open={isBatchModalVisible} onOk={handleBatchOk}
                       onCancel={handleBatchCancel}
                       okButtonProps={{loading: isLoading}}
                       okText={"添加地址"}
                       cancelText={"取消"}
                    // style={{zIndex: 3}}
                >
                    <Form form={batchForm} layout="vertical">
                        <Form.Item label="地址" name="addresses" rules={[{required: true}]}>
                            <TextArea placeholder="请输入地址，每行一个" style={{width: "500px", height: "200px"}}/>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="添加地址" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}
                       okButtonProps={{loading: isLoading}}
                       okText={"添加地址"}
                       cancelText={"取消"}
                    // style={{zIndex: 3}}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item label="地址" name="address" rules={[{required: true}]}>
                            <Input placeholder="请输入地址"/>
                        </Form.Item>
                        <Form.Item label="备注" name="name">
                            <Input placeholder="请输入备注"/>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="zkSync"
                       open={isWalletModalVisible}
                       onOk={handleWalletOk}
                       onCancel={() => {
                           setIsWalletModalVisible(false);
                       }}
                       okText={"保存"}
                       cancelText={"取消"}
                       width={700}
                       style={{top: 10}}
                    // style={{zIndex: 3}}

                >
                    <Form form={walletForm} layout="vertical">
                        <Card title="设置钱包预期标准，若钱包达到设置标准，钱包地址背景会为蓝色，更清晰"
                              bordered={true}
                              style={{width: '100%'}}>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <FormItem name="ETHTx" addonBefore="ETH Tx数量 ≥ "
                                              addonAfter="个"/>
                                    <FormItem name="zkSyncLiteMinTx" addonBefore="zkSyncLite Tx数量 ≥ "
                                              addonAfter="个"/>
                                    <FormItem name="zkSyncEraMinTx" addonBefore="zkSyncEra Tx数量 ≥ "
                                              addonAfter="个"/>
                                    <FormItem name="dayMin" addonBefore="日活跃天数 ≥ " addonAfter="天"/>
                                    <FormItem name="weekMin" addonBefore="周活跃天数 ≥ " addonAfter="天"/>
                                    <FormItem name="monthMin" addonBefore="月活跃天数 ≥ " addonAfter="天"/>
                                </Col>
                                <Col span={12}>
                                    <FormItem name="L1ToL2Tx" addonBefore="L1->L2跨链Tx ≥ " addonAfter="个"/>
                                    <FormItem name="L2ToL1Tx" addonBefore="L2->L1跨链Tx ≥ " addonAfter="个"/>
                                    <FormItem name="L1ToL2ETH" addonBefore="L1->L2跨链金额 ≥ " addonAfter="ETH"/>
                                    <FormItem name="L2ToL1ETH" addonBefore="L2->L1跨链金额 ≥ " addonAfter="ETH"/>
                                    <FormItem name="gasFee" addonBefore="消耗gasFee" addonAfter="ETH"/>
                                    <FormItem name="contractMin" addonBefore="不同合约数 ≥ " addonAfter="个"/>
                                    <FormItem name="totalAmount" addonBefore="总交易金额 ≥ " addonAfter="U"/>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Modal>
                <Spin spinning={tableLoading}>
                    <Table
                        rowSelection={rowSelection}
                        dataSource={data}
                        pagination={false}
                        bordered={true}
                        style={{marginBottom: "20px", zIndex: 2}}
                        size={"small"}
                        columns={columns}
                        // sticky
                        summary={pageData => {
                            let ethBalance = 0;
                            let zks1Balance = 0;
                            let zks2Balance = 0;
                            let zks2UsdcBalance = 0;
                            let totalFees = 0;
                            pageData.forEach(({
                                                  eth_balance,
                                                  zks1_balance,
                                                  zks2_balance,
                                                  zks2_usdcBalance,
                                                  totalFee
                                              }) => {
                                ethBalance += Number(eth_balance);
                                zks1Balance += Number(zks1_balance);
                                zks2Balance += Number(zks2_balance);
                                zks2UsdcBalance += Number(zks2_usdcBalance);
                                totalFees += Number(totalFee);
                            })

                            const emptyCells = Array(10).fill().map((_, index) => <Table.Summary.Cell
                                index={index + 6}/>);

                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={4}>总计</Table.Summary.Cell>
                                        <Table.Summary.Cell index={4}>{ethBalance.toFixed(4)}</Table.Summary.Cell>
                                        <Table.Summary.Cell index={5}/>
                                        <Table.Summary.Cell index={6}>{zks1Balance.toFixed(4)}</Table.Summary.Cell>
                                        <Table.Summary.Cell index={7}/>
                                        <Table.Summary.Cell index={8}>{zks2Balance.toFixed(4)}</Table.Summary.Cell>
                                        <Table.Summary.Cell
                                            index={9}>{zks2UsdcBalance.toFixed(2)}</Table.Summary.Cell>
                                        {emptyCells}
                                        <Table.Summary.Cell index={19}/>
                                        <Table.Summary.Cell index={20}>{totalFees.toFixed(4)}</Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            )
                        }}
                        footer={() => (
                            <Card>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: '10px'
                                }}>
                                    <Button type="primary" onClick={() => {
                                        setIsWalletModalVisible(true)
                                    }} size={"large"} style={{width: "20%"}}
                                            icon={<SettingOutlined/>}>
                                        配置
                                    </Button>
                                    <Button type="primary" onClick={showModal} size={"large"} style={{width: "20%"}}
                                            icon={<PlusOutlined/>}>
                                        添加地址
                                    </Button>
                                    <Button type="primary" onClick={showBatchModal} size={"large"}
                                            style={{width: "20%"}}
                                            icon={<UploadOutlined/>}
                                            loading={batchloading}
                                    >
                                        {batchloading ? `添加中 进度:(${batchProgress}/${batchLength})` : "批量添加地址"}
                                    </Button>
                                    <Button type="primary" onClick={handleRefresh} loading={isLoading}
                                            size={"large"}
                                            style={{width: "20%"}} icon={<SyncOutlined/>}>
                                        {isLoading ? "正在刷新" : "刷新选中地址"}
                                    </Button>
                                    <Popconfirm title={"确认删除" + selectedKeys.length + "个地址？"}
                                                onConfirm={handleDeleteSelected}>
                                        <Button type="primary" danger size={"large"}
                                                style={{width: "20%"}} icon={<DeleteOutlined/>}>
                                            删除选中地址
                                        </Button>
                                    </Popconfirm>
                                    <Button type="primary" icon={<DownloadOutlined/>} size={"large"}
                                            style={{width: "8%"}}
                                            onClick={exportToExcelFile}/>
                                </div>
                            </Card>
                        )
                        }
                    />
                </Spin>
            </Content>
        </div>
    );
}

export default Zksync;

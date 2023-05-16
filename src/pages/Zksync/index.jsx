import {Button, Input, Space, Table, Modal, Form, notification, Spin, Tag} from 'antd';
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
    PlusOutlined,
    SyncOutlined,
    UploadOutlined
} from "@ant-design/icons";

const {TextArea} = Input;
const {Column, ColumnGroup} = Table;

function Zksync() {
    const [data, setData] = useState([]);
    const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
    const [batchForm] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
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
                // 添加备注
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
                getZkSyncBridge(values.address).then(({l1Tol2Times, l1Tol2Amount, l2Tol1Times, l2Tol1Amount}) => {
                    updatedData[index] = {
                        ...updatedData[index],
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
                    l1Tol2Times: null,
                    l1Tol2Amount: null,
                    l2Tol1Times: null,
                    l2Tol1Amount: null,
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
                getZkSyncBridge(values.address).then(({l1Tol2Times, l1Tol2Amount, l2Tol1Times, l2Tol1Amount}) => {
                    newEntry.l1Tol2Times = l1Tol2Times;
                    newEntry.l1Tol2Amount = l1Tol2Amount;
                    newEntry.l2Tol1Times = l2Tol1Times;
                    newEntry.l2Tol1Amount = l2Tol1Amount;
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
            const newData = [...data];
            for (let key of selectedKeys) {
                const index = newData.findIndex(item => item.key === key);
                if (index !== -1) {
                    const item = newData[index];
                    item.eth_balance = null;
                    item.eth_tx_amount = null;
                    item.zks1_balance = null;
                    item.zks1_tx_amount = null;
                    item.zks2_balance = null;
                    item.zks2_tx_amount = null;
                    item.zks2_usdcBalance = null;
                    item.zks2_last_tx = null;
                    item.l1Tol2Times = null;
                    item.l1Tol2Amount = null;
                    item.l2Tol1Times = null;
                    item.l2Tol1Amount = null;
                    setData([...newData]);
                    getZksEra(item.address).then(({balance2, tx2, usdcBalance}) => {
                        item.zks2_balance = balance2;
                        item.zks2_tx_amount = tx2;
                        item.zks2_usdcBalance = usdcBalance;
                        setData([...newData]);
                        localStorage.setItem('addresses', JSON.stringify(data));
                    });
                    getZkSyncLastTX(item.address).then(({zkSyncLastTx}) => {
                        item.zks2_last_tx = zkSyncLastTx;
                        setData([...newData]);
                        localStorage.setItem('addresses', JSON.stringify(data));
                    })
                    getZksLite(item.address).then(({balance1, tx1}) => {
                        item.zks1_balance = balance1;
                        item.zks1_tx_amount = tx1;
                        setData([...newData]);
                        localStorage.setItem('addresses', JSON.stringify(data));
                    });
                    getEthBalance(item.address, "ethereum").then((eth_balance) => {
                        item.eth_balance = eth_balance;
                        setData([...newData]);
                        localStorage.setItem('addresses', JSON.stringify(data));
                    });
                    getTxCount(item.address, "ethereum").then((eth_tx_amount) => {
                        item.eth_tx_amount = eth_tx_amount;
                        setData([...newData]);
                        localStorage.setItem('addresses', JSON.stringify(data));
                    });
                    getZkSyncBridge(item.address).then(({l1Tol2Times, l1Tol2Amount, l2Tol1Times, l2Tol1Amount}) => {
                        item.l1Tol2Times = l1Tol2Times;
                        item.l1Tol2Amount = l1Tol2Amount;
                        item.l2Tol1Times = l2Tol1Times;
                        item.l2Tol1Amount = l2Tol1Amount;
                        setData([...newData]);
                        localStorage.setItem('addresses', JSON.stringify(data));
                    })
                }
            }
        } catch (error) {
            notification.error({
                message: "错误",
                description: error.message,
            }, 2);
        } finally {
            setIsLoading(false);
        }
    };
    const handleBatchOk = async () => {
        try {
            const values = await batchForm.validateFields();
            const addresses = values.addresses.split("\n");
            const newData = [...data];
            for (let address of addresses) {
                address = address.trim();
                if (address.length !== 42) {
                    notification.error({
                        message: "错误",
                        description: "请输入正确的地址",
                    });
                    continue;
                }
                const index = newData.findIndex(item => item.address === address);
                if (index !== -1) {
                    const updatedData = [...newData];
                    getZksEra(address).then(({balance2, tx2, usdcBalance}) => {
                        updatedData[index] = {
                            ...updatedData[index],
                            zks2_balance: balance2,
                            zks2_tx_amount: tx2,
                            zks2_usdcBalance: usdcBalance,
                        };
                        setData(updatedData);
                        localStorage.setItem('addresses', JSON.stringify(updatedData));
                    })
                    getZkSyncLastTX(address).then(({zkSyncLastTx}) => {
                        updatedData[index] = {
                            ...updatedData[index],
                            zks2_last_tx: zkSyncLastTx,
                        };
                        setData(updatedData);
                        localStorage.setItem('addresses', JSON.stringify(updatedData));
                    })
                    getZksLite(address).then(({balance1, tx1}) => {
                        updatedData[index] = {
                            ...updatedData[index],
                            zks1_balance: balance1,
                            zks1_tx_amount: tx1,
                        };
                        setData(updatedData);
                        localStorage.setItem('addresses', JSON.stringify(updatedData));
                    })
                    getEthBalance(address, "ethereum").then((eth_balance) => {
                        updatedData[index] = {
                            ...updatedData[index],
                            eth_balance,
                        };
                        setData(updatedData);
                        localStorage.setItem('addresses', JSON.stringify(updatedData));
                    })
                    getTxCount(address, "ethereum").then((eth_tx_amount) => {
                        updatedData[index] = {
                            ...updatedData[index],
                            eth_tx_amount,
                        };
                        setData(updatedData);
                        localStorage.setItem('addresses', JSON.stringify(updatedData));
                    })
                    getZkSyncBridge(address).then(({l1Tol2Times, l1Tol2Amount, l2Tol1Times, l2Tol1Amount}) => {
                        updatedData[index] = {
                            ...updatedData[index],
                            l1Tol2Times,
                            l1Tol2Amount,
                            l2Tol1Times,
                            l2Tol1Amount,
                        };
                        setData(updatedData);
                        localStorage.setItem('addresses', JSON.stringify(updatedData));
                    })
                } else {
                    const newEntry = {
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
                        l1Tol2Times: null,
                        l1Tol2Amount: null,
                        l2Tol1Times: null,
                        l2Tol1Amount: null,
                    };
                    newData.push(newEntry);
                    setData(newData);
                    getZksEra(address).then(({balance2, tx2, usdcBalance}) => {
                        newEntry.zks2_balance = balance2;
                        newEntry.zks2_tx_amount = tx2;
                        newEntry.zks2_usdcBalance = usdcBalance;
                        setData([...newData]);
                        localStorage.setItem('addresses', JSON.stringify(newData));
                    })
                    getZkSyncLastTX(address).then(({zkSyncLastTx}) => {
                        newEntry.zks2_last_tx = zkSyncLastTx;
                        setData([...newData]);
                        localStorage.setItem('addresses', JSON.stringify(newData));

                    })
                    getZksLite(address).then(({balance1, tx1}) => {
                        newEntry.zks1_balance = balance1;
                        newEntry.zks1_tx_amount = tx1;
                        setData([...newData]);
                        localStorage.setItem('addresses', JSON.stringify(newData));

                    })
                    getEthBalance(address, "ethereum").then((eth_balance) => {
                        newEntry.eth_balance = eth_balance;
                        setData([...newData]);
                        localStorage.setItem('addresses', JSON.stringify(newData));

                    })
                    getTxCount(address, "ethereum").then((eth_tx_amount) => {
                        newEntry.eth_tx_amount = eth_tx_amount;
                        setData([...newData]);
                        localStorage.setItem('addresses', JSON.stringify(newData));
                    })
                    getZkSyncBridge(address).then(({l1Tol2Times, l1Tol2Amount, l2Tol1Times, l2Tol1Amount}) => {
                        newEntry.l1Tol2Times = l1Tol2Times;
                        newEntry.l1Tol2Amount = l1Tol2Amount;
                        newEntry.l2Tol1Times = l2Tol1Times;
                        newEntry.l2Tol1Amount = l2Tol1Amount;
                        setData([...newData]);
                        localStorage.setItem('addresses', JSON.stringify(newData));
                    })
                }
            }
            setIsBatchModalVisible(false);
        } catch (error) {
            notification.error({
                message: "错误",
                description: error.message,
            });
        } finally {
            batchForm.resetFields();
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
        setData(data.filter(item => !selectedKeys.includes(item.key)));
        localStorage.setItem('addresses', JSON.stringify(data.filter(item => !selectedKeys.includes(item.key))));
        setSelectedKeys([]);
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedKeys(selectedRowKeys);
        },
    };
    const handleBatchCancel = () => {
        setIsBatchModalVisible(false);
    };
    const [editingKey, setEditingKey] = useState(null);
    return (
        <div>
            <Content>
                <Modal title="批量添加地址" open={isBatchModalVisible} onOk={handleBatchOk}
                       onCancel={handleBatchCancel}
                       okButtonProps={{loading: isLoading}}
                       okText={"添加地址"}
                       cancelText={"取消"}
                >
                    <Form form={batchForm} layout="vertical">
                        <Form.Item label="地址" name="addresses" rules={[{required: true}]}>
                            <TextArea placeholder="请输入地址，每行一个"/>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="添加地址" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}
                       okButtonProps={{loading: isLoading}}
                       okText={"添加地址"}
                       cancelText={"取消"}
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
                <Spin spinning={tableLoading}>
                    <Table
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }}
                        dataSource={data}
                        pagination={false}
                        bordered={true}
                        style={{marginBottom: "20px"}}
                        size={"small"}
                    >
                        <Column
                            title="备注"
                            dataIndex="name"
                            key="name"
                            align={"center"}
                            className={""}
                            render={(text, record) => {
                                const isEditing = record.key === editingKey; // Check if this row is being edited
                                return isEditing ? (
                                    <Input
                                        placeholder="请输入备注"
                                        defaultValue={text}
                                        onPressEnter={(e) => {
                                            record.name = e.target.value;
                                            setData([...data]);
                                            localStorage.setItem('addresses', JSON.stringify(data));
                                            setEditingKey(null); // Stop editing when Enter is pressed
                                        }}
                                    />
                                ) : (
                                    <>
                                        <Tag color="blue">{text}</Tag>
                                        <Button
                                            shape="circle"
                                            icon={<EditOutlined/>}
                                            size={"small"}
                                            onClick={() => setEditingKey(record.key)} // Start editing when the button is clicked
                                        />
                                    </>
                                );
                            }}
                        />
                        <Column title="钱包地址" dataIndex="address" key="address" align={"center"}
                                className={""}/>
                        <ColumnGroup title="ETH" className={"zks_eth"}>
                            <Column title="ETH" dataIndex="eth_balance" key="eth_balance" align={"center"}
                                    render={(text, record) => (text === null ? <Spin/> : text)} className={""}/>
                            <Column title="Tx" dataIndex="eth_tx_amount" key="eth_tx_amount" align={"center"}
                                    render={(text, record) => (text === null ? <Spin/> : text)} className={""}/>
                        </ColumnGroup>
                        <ColumnGroup title="zkSyncLite" className={"zks_lite"}>
                            <Column title="ETH" dataIndex="zks1_balance" key="zks1_balance" align={"center"}
                                    render={(text, record) => (text === null ? <Spin/> : text)} className={""}/>
                            <Column title="Tx" dataIndex="zks1_tx_amount" key="zks1_tx_amount" align={"center"}
                                    render={
                                        (text, record) => (text === null ? <Spin/> : text)
                                    } className={""}/>
                        </ColumnGroup>
                        <ColumnGroup title="zkSyncEra" className={"zks_era"}>
                            <Column title="ETH" dataIndex="zks2_balance" key="zks2_balance" align={"center"}
                                    render={(text, record) => (text === null ? <Spin/> : text)} className={""}/>
                            <Column title="USDC" dataIndex="zks2_usdcBalance" key="zks2_usdc_balance" align={"center"}
                                    render={(text, record) => (text === null ? <Spin/> : text)} className={""}/>
                            <Column title="Tx" dataIndex="zks2_tx_amount" key="zks2_tx_amount" align={"center"}
                                    render={(text, record) => (text === null ? <Spin/> : text)} className={""}/>
                            <Column title="最后交易" dataIndex="zks2_last_tx" key="zks2_last_tx" align={"center"}
                                    render={(text, record) => (text === null ? <Spin/> :
                                        <a href={"https://explorer.zksync.io/address/" + record.address}
                                           target={"_blank"}>{text}</a>)}
                                    className={""}/>
                            <ColumnGroup title="官方桥跨链Tx数" className={""}>
                                <Column title="L1->L2" dataIndex="l1Tol2Times" key="l1Tol2Tx" align={"center"}
                                        render={(text, record) => (text === null ? <Spin/> : text)}
                                        className={""}/>
                                <Column title="L2->L1" dataIndex="l2Tol1Times" key="l2Tol1Tx" align={"center"}
                                        render={(text, record) => (text === null ? <Spin/> : text)}
                                        className={""}/>
                            </ColumnGroup>
                            <ColumnGroup title="官方桥跨链金额(ETH)" className={""}>
                                <Column title="L1->L2" dataIndex="l1Tol2Amount" key="l1Tol2Amount" align={"center"}
                                        render={(text, record) => (text === null ? <Spin/> : text)}
                                        className={""}/>
                                <Column title="L2->L1" dataIndex="l2Tol1Amount" key="l2Tol1Amount" align={"center"}
                                        render={(text, record) => (text === null ? <Spin/> : text)}
                                        className={""}/>
                            </ColumnGroup>
                        </ColumnGroup>
                        <Column
                            className={"action"}
                            title="操作"
                            key="action"
                            align={"center"}
                            render={(text, record) => (
                                <Space size="small">
                                    <Button
                                        type="primary"
                                        danger
                                        onClick={() => handleDelete(record.key)}
                                    >
                                        删除
                                    </Button>
                                </Space>
                            )}
                        />
                    </Table>
                </Spin>
                <Card>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', gap: '10px'}}>
                        <Button type="primary" onClick={showModal} size={"large"} style={{width: "20%"}}
                                icon={<PlusOutlined/>}>
                            添加地址
                        </Button>
                        <Button type="primary" onClick={showBatchModal} size={"large"} style={{width: "20%"}}
                                icon={<UploadOutlined/>}>
                            批量添加地址
                        </Button>
                        <Button type="primary" onClick={handleRefresh} loading={isLoading} size={"large"}
                                style={{width: "20%"}} disabled={!selectedKeys.length} icon={<SyncOutlined/>}>
                            刷新选中地址
                        </Button>
                        <Button type="primary" danger onClick={handleDeleteSelected} size={"large"}
                                style={{width: "20%"}} disabled={!selectedKeys.length} icon={<DeleteOutlined/>}>
                            删除选中地址
                        </Button>
                        <Button type="primary" icon={<DownloadOutlined/>} size={"large"} style={{width: "8%"}}
                                onClick={exportToExcelFile}/>
                    </div>
                </Card>
            </Content>
        </div>
    );
}

export default Zksync;

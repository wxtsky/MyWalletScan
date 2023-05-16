import {useEffect, useState} from "react";
import {Button, Input, Space, Table, Modal, Form, notification, Spin, Tag} from 'antd';
import {Layout, Card} from 'antd';
import {
    getStarkTx,
    getStarkBridge,
    getStarkInfo,
    exportToExcel,
} from "@utils"
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    PlusOutlined,
    SyncOutlined,
    UploadOutlined
} from "@ant-design/icons";
import './index.css'

const {TextArea} = Input;

const {Content} = Layout;


const {Column, ColumnGroup} = Table;
const Stark = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
    const [data, setData] = useState([]);
    const [batchForm] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [form] = Form.useForm();
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedKeys(selectedRowKeys);
        },
    };
    useEffect(() => {
        setTableLoading(true)
        const storedAddresses = localStorage.getItem('stark_addresses');
        setTimeout(() => {
            setTableLoading(false);
        }, 500);
        if (storedAddresses) {
            setData(JSON.parse(storedAddresses));
        }
    }, []);
    const handleDelete = (key) => {
        setData(data.filter(item => item.key !== key));
        localStorage.setItem('stark_addresses', JSON.stringify(data.filter(item => item.key !== key)));
    }
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (values.address.length !== 66 && values.address.length !== 64) {
                notification.error({
                    message: "错误",
                    description: "请输入正确的stark地址(64位)",
                }, 2);
                return;
            }
            if (!values.address.startsWith('0x')) {
                values.address = '0x' + values.address;
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
                getStarkInfo(values.address).then(({eth_balance, stark_id, deployed_at_timestamp}) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        stark_eth_balance: eth_balance,
                        stark_id: stark_id,
                        create_time: deployed_at_timestamp,
                    };
                    setData(updatedData);
                    localStorage.setItem('stark_addresses', JSON.stringify(data));
                })
                getStarkBridge(values.address).then(({
                                                         d_eth_amount, d_eth_count,
                                                         d_usdc_amount, d_usdc_count,
                                                         d_usdt_amount, d_usdt_count,
                                                         d_dai_amount, d_dai_count,
                                                         d_wbtc_amount,
                                                         d_wbtc_count,
                                                         w_eth_amount, w_eth_count,
                                                         w_usdc_amount, w_usdc_count,
                                                         w_usdt_amount, w_usdt_count,
                                                         w_dai_amount, w_dai_count,
                                                         w_wbtc_amount, w_wbtc_count,
                                                         total_deposit_count, total_widthdraw_count

                                                     }) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        d_eth_amount, d_eth_count,
                        d_usdc_amount, d_usdc_count,
                        d_usdt_amount, d_usdt_count,
                        d_dai_amount, d_dai_count,
                        d_wbtc_amount,
                        d_wbtc_count,
                        w_eth_amount, w_eth_count,
                        w_usdc_amount, w_usdc_count,
                        w_usdt_amount, w_usdt_count,
                        w_dai_amount, w_dai_count,
                        w_wbtc_amount, w_wbtc_count,
                        total_deposit_count, total_widthdraw_count
                    };
                    setData(updatedData);
                    localStorage.setItem('stark_addresses', JSON.stringify(data));
                })
                getStarkTx(values.address).then(({tx, stark_latest_tx}) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        stark_tx_amount: tx,
                        stark_latest_tx: stark_latest_tx
                    };
                    setData(updatedData);
                    localStorage.setItem('stark_addresses', JSON.stringify(data));
                })
            } else {
                const newEntry = {
                    key: data.length.toString(),
                    name: values.name,
                    address: values.address,
                    stark_eth_balance: null,
                    stark_id: null,
                    create_time: null,
                    d_eth_amount: null,
                    d_eth_count: null,
                    d_usdc_amount: null,
                    d_usdc_count: null,
                    d_usdt_amount: null,
                    d_usdt_count: null,
                    d_dai_amount: null,
                    d_dai_count: null,
                    d_wbtc_amount: null,
                    d_wbtc_count: null,
                    w_eth_amount: null,
                    w_eth_count: null,
                    w_usdc_amount: null,
                    w_usdc_count: null,
                    w_usdt_amount: null,
                    w_usdt_count: null,
                    w_dai_amount: null,
                    w_dai_count: null,
                    w_wbtc_amount: null,
                    w_wbtc_count: null,
                    stark_tx_amount: null,
                    stark_latest_tx: null,
                    total_deposit_count: null,
                    total_widthdraw_count: null
                };
                const newData = [...data, newEntry];
                setData(newData);
                getStarkTx(values.address).then(({tx, stark_latest_tx}) => {
                    newEntry.stark_tx_amount = tx;
                    newEntry.stark_latest_tx = stark_latest_tx;
                    setData([...newData]);
                    localStorage.setItem('stark_addresses', JSON.stringify(newData));
                })
                getStarkInfo(values.address).then(({eth_balance, stark_id, deployed_at_timestamp}) => {
                    newEntry.stark_eth_balance = eth_balance;
                    newEntry.stark_id = stark_id;
                    newEntry.create_time = deployed_at_timestamp;
                    setData([...newData]);
                    localStorage.setItem('stark_addresses', JSON.stringify(newData));
                })
                getStarkBridge(values.address).then(({
                                                         d_eth_amount, d_eth_count,
                                                         d_usdc_amount, d_usdc_count,
                                                         d_usdt_amount, d_usdt_count,
                                                         d_dai_amount, d_dai_count,
                                                         d_wbtc_amount,
                                                         d_wbtc_count,
                                                         w_eth_amount, w_eth_count,
                                                         w_usdc_amount, w_usdc_count,
                                                         w_usdt_amount, w_usdt_count,
                                                         w_dai_amount, w_dai_count,
                                                         w_wbtc_amount, w_wbtc_count,
                                                         total_widthdraw_count, total_deposit_count
                                                     }) => {
                    newEntry.d_eth_amount = d_eth_amount;
                    newEntry.d_eth_count = d_eth_count;
                    newEntry.d_usdc_amount = d_usdc_amount;
                    newEntry.d_usdc_count = d_usdc_count;
                    newEntry.d_usdt_amount = d_usdt_amount;
                    newEntry.d_usdt_count = d_usdt_count;
                    newEntry.d_dai_amount = d_dai_amount;
                    newEntry.d_dai_count = d_dai_count;
                    newEntry.d_wbtc_amount = d_wbtc_amount;
                    newEntry.d_wbtc_count = d_wbtc_count;
                    newEntry.w_eth_amount = w_eth_amount;
                    newEntry.w_eth_count = w_eth_count;
                    newEntry.w_usdc_amount = w_usdc_amount;
                    newEntry.w_usdc_count = w_usdc_count;
                    newEntry.w_usdt_amount = w_usdt_amount;
                    newEntry.w_usdt_count = w_usdt_count;
                    newEntry.w_dai_amount = w_dai_amount;
                    newEntry.w_dai_count = w_dai_count;
                    newEntry.w_wbtc_amount = w_wbtc_amount;
                    newEntry.w_wbtc_count = w_wbtc_count;
                    newEntry.total_deposit_count = total_deposit_count;
                    newEntry.total_widthdraw_count = total_widthdraw_count;
                    setData([...newData]);
                    localStorage.setItem('stark_addresses', JSON.stringify(newData));
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
    const handleBatchOk = async () => {
        try {
            const values = await batchForm.validateFields();
            const addresses = values.addresses.split("\n");
            const newData = [...data];
            for (let address of addresses) {
                address = address.trim();
                if (address.length !== 66 && address.length !== 64) {
                    notification.error({
                        message: "错误",
                        description: "请输入正确的stark地址(64位)",
                    });
                    continue;
                }
                if (!address.startsWith("0x")) {
                    address = "0x" + address;
                }
                const index = newData.findIndex(item => item.address === address);
                if (index !== -1) {
                    const updatedData = [...newData];
                    getStarkTx(address).then(({tx, stark_latest_tx}) => {
                        updatedData[index] = {
                            ...updatedData[index],
                            stark_tx_amount: tx,
                            stark_latest_tx: stark_latest_tx,
                        };
                        setData(updatedData);
                        localStorage.setItem('stark_addresses', JSON.stringify(updatedData));
                    })
                    getStarkInfo(address).then(({eth_balance, stark_id, deployed_at_timestamp}) => {
                        updatedData[index] = {
                            ...updatedData[index],
                            stark_eth_balance: eth_balance,
                            stark_id: stark_id,
                            create_time: deployed_at_timestamp,
                        };
                        setData(updatedData);
                        localStorage.setItem('stark_addresses', JSON.stringify(updatedData));
                    })
                    getStarkBridge(address).then(({
                                                      d_eth_amount, d_eth_count,
                                                      d_usdc_amount, d_usdc_count,
                                                      d_usdt_amount, d_usdt_count,
                                                      d_dai_amount, d_dai_count,
                                                      d_wbtc_amount,
                                                      d_wbtc_count,
                                                      w_eth_amount, w_eth_count,
                                                      w_usdc_amount, w_usdc_count,
                                                      w_usdt_amount, w_usdt_count,
                                                      w_dai_amount, w_dai_count,
                                                      w_wbtc_amount, w_wbtc_count,
                                                      total_widthdraw_count, total_deposit_count
                                                  }) => {
                        updatedData[index] = {
                            ...updatedData[index],
                            d_eth_amount: d_eth_amount,
                            d_eth_count: d_eth_count,
                            d_usdc_amount: d_usdc_amount,
                            d_usdc_count: d_usdc_count,
                            d_usdt_amount: d_usdt_amount,
                            d_usdt_count: d_usdt_count,
                            d_dai_amount: d_dai_amount,
                            d_dai_count: d_dai_count,
                            d_wbtc_amount: d_wbtc_amount,
                            d_wbtc_count: d_wbtc_count,
                            w_eth_amount: w_eth_amount,
                            w_eth_count: w_eth_count,
                            w_usdc_amount: w_usdc_amount,
                            w_usdc_count: w_usdc_count,
                            w_usdt_amount: w_usdt_amount,
                            w_usdt_count: w_usdt_count,
                            w_dai_amount: w_dai_amount,
                            w_dai_count: w_dai_count,
                            w_wbtc_amount: w_wbtc_amount,
                            w_wbtc_count: w_wbtc_count,
                            total_widthdraw_count: total_widthdraw_count,
                            total_deposit_count: total_deposit_count,
                        };
                    })
                } else {
                    const newEntry = {
                        key: newData.length.toString(),
                        address: address,
                        stark_eth_balance: null,
                        stark_id: null,
                        create_time: null,
                        d_eth_amount: null,
                        d_eth_count: null,
                        d_usdc_amount: null,
                        d_usdc_count: null,
                        d_usdt_amount: null,
                        d_usdt_count: null,
                        d_dai_amount: null,
                        d_dai_count: null,
                        d_wbtc_amount: null,
                        d_wbtc_count: null,
                        w_eth_amount: null,
                        w_eth_count: null,
                        w_usdc_amount: null,
                        w_usdc_count: null,
                        w_usdt_amount: null,
                        w_usdt_count: null,
                        w_dai_amount: null,
                        w_dai_count: null,
                        w_wbtc_amount: null,
                        w_wbtc_count: null,
                        stark_tx_amount: null,
                        stark_latest_tx: null,
                        total_deposit_count: null,
                        total_widthdraw_count: null

                    };
                    newData.push(newEntry);
                    setData(newData);
                    getStarkTx(address).then(({tx, stark_latest_tx}) => {
                        newEntry.stark_tx_amount = tx;
                        newEntry.stark_latest_tx = stark_latest_tx;
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(newData));
                    })
                    getStarkInfo(address).then(({eth_balance, stark_id, deployed_at_timestamp}) => {
                        newEntry.stark_eth_balance = eth_balance;
                        newEntry.stark_id = stark_id;
                        newEntry.create_time = deployed_at_timestamp;
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(newData));
                    })
                    getStarkBridge(address).then(({
                                                      d_eth_amount, d_eth_count,
                                                      d_usdc_amount, d_usdc_count,
                                                      d_usdt_amount, d_usdt_count,
                                                      d_dai_amount, d_dai_count,
                                                      d_wbtc_amount,
                                                      d_wbtc_count,
                                                      w_eth_amount, w_eth_count,
                                                      w_usdc_amount, w_usdc_count,
                                                      w_usdt_amount, w_usdt_count,
                                                      w_dai_amount, w_dai_count,
                                                      w_wbtc_amount, w_wbtc_count,
                                                      total_widthdraw_count, total_deposit_count
                                                  }) => {
                        newEntry.d_eth_amount = d_eth_amount;
                        newEntry.d_eth_count = d_eth_count;
                        newEntry.d_usdc_amount = d_usdc_amount;
                        newEntry.d_usdc_count = d_usdc_count;
                        newEntry.d_usdt_amount = d_usdt_amount;
                        newEntry.d_usdt_count = d_usdt_count;
                        newEntry.d_dai_amount = d_dai_amount;
                        newEntry.d_dai_count = d_dai_count;
                        newEntry.d_wbtc_amount = d_wbtc_amount;
                        newEntry.d_wbtc_count = d_wbtc_count;
                        newEntry.w_eth_amount = w_eth_amount;
                        newEntry.w_eth_count = w_eth_count;
                        newEntry.w_usdc_amount = w_usdc_amount;
                        newEntry.w_usdc_count = w_usdc_count;
                        newEntry.w_usdt_amount = w_usdt_amount;
                        newEntry.w_usdt_count = w_usdt_count;
                        newEntry.w_dai_amount = w_dai_amount;
                        newEntry.w_dai_count = w_dai_count;
                        newEntry.w_wbtc_amount = w_wbtc_amount;
                        newEntry.w_wbtc_count = w_wbtc_count;
                        newEntry.total_widthdraw_count = total_widthdraw_count;
                        newEntry.total_deposit_count = total_deposit_count;
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(newData));
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
                    item.stark_tx_amount = null;
                    item.stark_latest_tx = null;
                    item.stark_eth_balance = null;
                    item.stark_id = null;
                    item.create_time = null;
                    item.d_eth_amount = null;
                    item.d_eth_count = null;
                    item.d_usdc_amount = null;
                    item.d_usdc_count = null;
                    item.d_usdt_amount = null;
                    item.d_usdt_count = null;
                    item.d_dai_amount = null;
                    item.d_dai_count = null;
                    item.d_wbtc_amount = null;
                    item.d_wbtc_count = null;
                    item.w_eth_amount = null;
                    item.w_eth_count = null;
                    item.w_usdc_amount = null;
                    item.w_usdc_count = null;
                    item.w_usdt_amount = null;
                    item.w_usdt_count = null;
                    item.w_dai_amount = null;
                    item.w_dai_count = null;
                    item.w_wbtc_amount = null;
                    item.w_wbtc_count = null;
                    item.total_widthdraw_count = null;
                    item.total_deposit_count = null;
                    setData([...newData]);
                    getStarkTx(item.address).then(({tx, stark_latest_tx}) => {
                        item.stark_tx_amount = tx;
                        item.stark_latest_tx = stark_latest_tx;
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(data));
                    })
                    getStarkInfo(item.address).then(({eth_balance, stark_id, deployed_at_timestamp}) => {
                        item.stark_eth_balance = eth_balance;
                        item.stark_id = stark_id;
                        item.create_time = deployed_at_timestamp;
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(data));
                    })
                    getStarkBridge(item.address).then(({
                                                           d_eth_amount, d_eth_count,
                                                           d_usdc_amount, d_usdc_count,
                                                           d_usdt_amount, d_usdt_count,
                                                           d_dai_amount, d_dai_count,
                                                           d_wbtc_amount,
                                                           d_wbtc_count,
                                                           w_eth_amount, w_eth_count,
                                                           w_usdc_amount, w_usdc_count,
                                                           w_usdt_amount, w_usdt_count,
                                                           w_dai_amount, w_dai_count,
                                                           w_wbtc_amount, w_wbtc_count,
                                                           total_widthdraw_count, total_deposit_count
                                                       }) => {
                        item.d_eth_amount = d_eth_amount;
                        item.d_eth_count = d_eth_count;
                        item.d_usdc_amount = d_usdc_amount;
                        item.d_usdc_count = d_usdc_count;
                        item.d_usdt_amount = d_usdt_amount;
                        item.d_usdt_count = d_usdt_count;
                        item.d_dai_amount = d_dai_amount;
                        item.d_dai_count = d_dai_count;
                        item.d_wbtc_amount = d_wbtc_amount;
                        item.d_wbtc_count = d_wbtc_count;
                        item.w_eth_amount = w_eth_amount;
                        item.w_eth_count = w_eth_count;
                        item.w_usdc_amount = w_usdc_amount;
                        item.w_usdc_count = w_usdc_count;
                        item.w_usdt_amount = w_usdt_amount;
                        item.w_usdt_count = w_usdt_count;
                        item.w_dai_amount = w_dai_amount;
                        item.w_dai_count = w_dai_count;
                        item.w_wbtc_amount = w_wbtc_amount;
                        item.w_wbtc_count = w_wbtc_count;
                        item.total_widthdraw_count = total_widthdraw_count;
                        item.total_deposit_count = total_deposit_count;
                        setData([...newData]);
                        localStorage.setItem('stark_addresses', JSON.stringify(data));
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
    const handleDeleteSelected = () => {
        setData(data.filter(item => !selectedKeys.includes(item.key)));
        localStorage.setItem('stark_addresses', JSON.stringify(data.filter(item => !selectedKeys.includes(item.key))));
        setSelectedKeys([]);
    }
    const exportToExcelFile = () => {
        exportToExcel(data, 'starkInfo');
    }
    const [editingKey, setEditingKey] = useState(null);
    return (
        <div>
            <Content>
                <Modal title="批量添加地址" open={isBatchModalVisible} onOk={handleBatchOk}
                       onCancel={() => {
                           setIsBatchModalVisible(false)
                           batchForm.resetFields()
                       }}
                       okText={"添加地址"}
                       cancelText={"取消"}
                >
                    <Form form={batchForm} layout="vertical">
                        <Form.Item label="地址" name="addresses" rules={[{required: true}]}>
                            <TextArea placeholder="请输入地址，每行一个"
                                      style={{width: "500px", height: "200px"}}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="添加地址" open={isModalVisible} onOk={handleOk}
                       onCancel={() => setIsModalVisible(false)}
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
                            className={"name"}
                            render={(text, record) => {
                                const isEditing = record.key === editingKey; // Check if this row is being edited
                                return isEditing ? (
                                    <Input
                                        placeholder="请输入备注"
                                        defaultValue={text}
                                        onPressEnter={(e) => {
                                            record.name = e.target.value;
                                            setData([...data]);
                                            localStorage.setItem('stark_addresses', JSON.stringify(data));
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
                                className={"address"}
                                render={(text, record) => (
                                    text === null ? <Spin/> : text.slice(0, 4) + "..." + text.slice(-4)
                                )}
                        />
                        <Column title="创建时间" dataIndex="create_time" key="create_time" align={"center"}
                                className={"create_time"}
                                render={(text, record) => {
                                    if (text === null) {
                                        return <Spin/>;
                                    } else {
                                        let date = new Date(text * 1000);
                                        let year = date.getFullYear();
                                        let month = (date.getMonth() + 1).toString().padStart(2, '0'); // month is 0-based
                                        let day = date.getDate().toString().padStart(2, '0');
                                        return `${year}/${month}/${day}`;
                                    }
                                }}

                        />

                        <Column title="StarkId" dataIndex="stark_id" key="stark_id" align={"center"}
                                className={"stark_id"}
                                render={(text, record) => (text === null ? <Spin/> : text)}
                        />
                        <ColumnGroup title="StarkWare" className={"zksync2"}>
                            <Column title="ETH" dataIndex="stark_eth_balance" key="stark_eth_balance" align={"center"}
                                    render={(text, record) => (text === null ? <Spin/> : text)} className={"zks2_son"}/>
                            <Column title="Tx" dataIndex="stark_tx_amount" key="stark_tx_amount" align={"center"}
                                    render={(text, record) => (text === null ? <Spin/> : text)} className={"zks2_son"}/>
                            <Column title="最后交易时间" dataIndex="stark_latest_tx" key="stark_latest_tx"
                                    align={"center"}
                                    render={(text, record) => (text === null ? <Spin/> : text)} className={"zks2_son"}/>
                            <ColumnGroup title="官方桥Tx数量" className={"stark_cross_tx"}>
                                <ColumnGroup title="L1->L2" className={"cross12"}>
                                    <Column title="ETH"
                                            dataIndex="d_eth_count"
                                            key="12cross_eth_tx" align={"center"}
                                            render={(text, record) => (text === null ? <Spin/> : text)}
                                            className={"cross_son"}/>
                                    <Column title="USDC" dataIndex="d_usdc_count" key="12cross_usdc_tx"
                                            align={"center"}
                                            render={(text, record) => (text === null ? <Spin/> : text)}
                                            className={"cross_son"}/>
                                    <Column title="USDT" dataIndex="d_usdt_count" key="12cross_usdt_tx"
                                            align={"center"}
                                            render={(text, record) => (text === null ? <Spin/> : text)}
                                            className={"cross_son"}/>
                                    <Column title="总共" dataIndex="total_deposit_count" key="12cross_total_tx"
                                            align={"center"}
                                            render={(text, record) => (text === null ? <Spin/> : text)}
                                            className={"cross_son"}/>
                                </ColumnGroup>
                                <ColumnGroup title="L2->L1" className={"cross21"}>
                                    <Column title="ETH" dataIndex="w_eth_count" key="21cross_eth_tx" align={"center"}
                                            render={(text, record) => (text === null ? <Spin/> : text)}
                                            className={"cross_son"}/>
                                    <Column title="USDC" dataIndex="w_usdc_count" key="21cross_usdc_tx"
                                            align={"center"}
                                            render={(text, record) => (text === null ? <Spin/> : text)}
                                            className={"cross_son"}/>
                                    <Column title="USDT" dataIndex="w_usdt_count" key="21cross_usdt_tx"
                                            align={"center"}
                                            render={(text, record) => (text === null ? <Spin/> : text)}
                                            className={"cross_son"}/>
                                    <Column title="总共" dataIndex="total_widthdraw_count" key="21cross_total_tx"
                                            align={"center"}
                                            render={(text, record) => (text === null ? <Spin/> : text)}
                                            className={"cross_son"}/>
                                </ColumnGroup>
                            </ColumnGroup>
                            <ColumnGroup title="官方桥跨链额" className={"stark_cross_amount"}>
                                <ColumnGroup title="L1->L2" className={"cross12a"}>
                                    <Column title="ETH" dataIndex="d_eth_amount"
                                            key="12cross_eth_amount"
                                            align={"center"}
                                            render={(text, record) => (text === null ? <Spin/> : text)}
                                            className={"cross_son"}/>
                                    <Column title="USDC" dataIndex="d_usdc_amount" key="12cross_usdc_amount"
                                            align={"center"}
                                            render={(text, record) => (text === null ? <Spin/> : text)}
                                            className={"cross_son"}/>
                                    <Column title="USDT" dataIndex="d_usdt_amount" key="12cross_usdt_amount"
                                            align={"center"}
                                            render={(text, record) => (text === null ? <Spin/> : text)}
                                            className={"cross_son"}/>
                                </ColumnGroup>
                                <ColumnGroup title="L2->L1" className={"cross21a"}>
                                    <Column title="ETH" dataIndex="w_eth_amount" key="21cross_eth_amount"
                                            align={"center"}
                                            render={(text, record) => (text === null ? <Spin/> : text)}
                                            className={"cross_son"}/>
                                    <Column title="USDC" dataIndex="w_usdc_amount" key="21cross_usdc_amount"
                                            align={"center"}
                                            render={(text, record) => (text === null ? <Spin/> : text)}
                                            className={"cross_son"}/>
                                    <Column title="USDT" dataIndex="w_usdt_amount" key="21cross_usdt_amount"
                                            align={"center"}
                                            render={(text, record) => (text === null ? <Spin/> : text)}
                                            className={"cross_son"}/>
                                </ColumnGroup>
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
                            // fixed={"right"}
                        />
                    </Table>
                </Spin>
                <Card>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                        <Button type="primary" onClick={() => {
                            setIsModalVisible(true)
                        }} size={"large"} style={{width: "20%"}} icon={<PlusOutlined/>}>
                            添加地址
                        </Button>
                        <Button type="primary" onClick={() => {
                            setIsBatchModalVisible(true)
                        }} size={"large"} style={{width: "20%"}} icon={<UploadOutlined/>}>
                            批量添加地址
                        </Button>
                        <Button type="primary" onClick={handleRefresh} loading={isLoading} size={"large"}
                                style={{width: "20%"}}
                                disabled={!selectedKeys.length} icon={<SyncOutlined/>}>
                            刷新选中地址
                        </Button>
                        <Button type="primary" danger onClick={handleDeleteSelected} size={"large"}
                                style={{width: "20%"}}
                                disabled={!selectedKeys.length} icon={<DeleteOutlined/>}>
                            删除选中地址
                        </Button>
                        <Button type="primary" icon={<DownloadOutlined/>} size={"large"} style={{width: "8%"}}
                                onClick={exportToExcelFile}
                        />
                    </div>
                </Card>
            </Content>
        </div>
    )
}
export default Stark;

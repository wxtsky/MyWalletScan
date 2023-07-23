import {useEffect, useState} from "react";
import {Button, Input, Space, Table, Modal, Form, notification, Spin, Tag, Popconfirm, message} from 'antd';
import {Layout, Card} from 'antd';
import {exportToExcel,} from "@utils"
import {
    CopyOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    PlusOutlined,
    SyncOutlined,
    UploadOutlined
} from "@ant-design/icons";
import {getStarkData} from "@utils/getStarkData/main.js";
import './index.css'
import copy from "copy-to-clipboard";

const {TextArea} = Input;
const {Content} = Layout;
const Stark = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
    const [data, setData] = useState([]);
    const [batchForm] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [form] = Form.useForm();
    let idCounter = data.length;
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
    const columns = [
        {
            title: "#",
            key: "index",
            align: "center",
            render: (text, record, index) => index + 1,
        },
        {
            title: "备注",
            dataIndex: "name",
            key: "name",
            align: "center",
            className: "name",
            render: (text, record) => {
                const isEditing = record.key === editingKey;
                return isEditing ? (
                    <Input
                        placeholder="请输入备注"
                        defaultValue={text}
                        onPressEnter={(e) => {
                            record.name = e.target.value;
                            setData([...data]);
                            localStorage.setItem('stark_addresses', JSON.stringify(data));
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
        },
        {
            title: '钱包地址',
            dataIndex: 'address',
            key: 'address',
            align: 'center',
            className: 'address',
            render: (text, record) => {
                const handleCopy = () => {
                    copy(text); // 复制地址到剪贴板
                    message.success('地址已复制'); // 显示成功提示
                };

                return text ? (
                    <>
                        {text.slice(0, 4)}...{text.slice(-4)}
                        <Button
                            type="text"
                            icon={<CopyOutlined/>}
                            onClick={handleCopy}
                            style={{marginLeft: 8}}
                        />
                    </>
                ) : (
                    <Spin/>
                );
            },
        },
        {
            title: "Type",
            dataIndex: ["account", "classAlias"],
            key: "classAlias",
            align: "center",
            render: (text, record) => text ? text : <Spin/>,
        },
        {
            title: "StarkWare(轻点刷新!不然容易报错)",
            className: "zksync2",
            children: [
                {
                    title: "ETH",
                    dataIndex: ["tokenBalance", "ETH"],
                    key: "stark_eth_balance",
                    align: "center",
                    render: (text, record) => text || text === 0 ? text : <Spin/>, // 0 也是合法值
                },
                {
                    title: "USDC",
                    dataIndex: ["tokenBalance", "USDC"],
                    key: "stark_usdc_balance",
                    align: "center",
                    render: (text, record) => text || text === 0 ? text : <Spin/>,
                },
                {
                    title: "USDT",
                    dataIndex: ["tokenBalance", "USDT"],
                    key: "stark_usdt_balance",
                    align: "center",
                    render: (text, record) => text || text === 0 ? text : <Spin/>,
                },
                {
                    title: "DAI",
                    dataIndex: ["tokenBalance", "DAI"],
                    key: "stark_dai_balance",
                    align: "center",
                    render: (text, record) => text || text === 0 ? text : <Spin/>,
                },
                {
                    title: "WBTC",
                    dataIndex: ["tokenBalance", "WBTC"],
                    key: "stark_wbtc_balance",
                    align: "center",
                    render: (text, record) => text || text === 0 ? text : <Spin/>,
                },
                {
                    title: "Tx",
                    dataIndex: ["account", "nonce"],
                    key: "stark_tx_amount",
                    align: "center",
                    render: (text, record) => text || text === 0 ? text : <Spin/>,
                    sorter: (a, b) => a.account.nonce - b.account.nonce,
                },
                {
                    title: "最后交易",
                    dataIndex: ["activity", "lastTransactionTimeAgo"],
                    key: "stark_latest_tx",
                    align: "center",
                    render: (text, record) => text || text === 0 ?
                        <a href={`https://voyager.online/contract/${record.address}`} target="_blank">{text}</a> :
                        <Spin/>,
                },
                {
                    title: "官方桥Tx",
                    className: "stark_cross_tx",
                    children: [
                        {
                            title: "L1->L2",
                            dataIndex: ["bridge", "l1_l2"],
                            align: "center",
                            render: (text, record) => text || text === 0 ? text : <Spin/>,
                        },
                        {
                            title: "L2->L1",
                            dataIndex: ["bridge", "l2_l1"],
                            align: "center",
                            render: (text, record) => text || text === 0 ? text : <Spin/>,
                        },
                    ]
                },
                {
                    title: "官方桥金额(U)",
                    className: "stark_cross_amount",
                    children: [
                        {
                            title: "L1->L2",
                            dataIndex: ["bridge", "l1_l2_amount"],
                            align: "center",
                            render: (text, record) => text || text === 0 ? text : <Spin/>,

                        },
                        {
                            title: "L2->L1",
                            dataIndex: ["bridge", "l2_l1_amount"],
                            align: "center",
                            render: (text, record) => text || text === 0 ? text : <Spin/>,
                        }
                    ]

                },
                {
                    title: "活跃统计",
                    className: "stark_activity",
                    children: [
                        {
                            title: "天",
                            dataIndex: ["activity", "days"],
                            align: "center",
                            render: (text, record) => text || text === 0 ? text : <Spin/>,
                        },
                        {
                            title: "周",
                            dataIndex: ["activity", "weeks"],
                            align: "center",
                            render: (text, record) => text || text === 0 ? text : <Spin/>,
                        },
                        {
                            title: "月",
                            dataIndex: ["activity", "months"],
                            align: "center",
                            render: (text, record) => text || text === 0 ? text : <Spin/>,
                        },
                        {
                            title: "金额(U)",
                            dataIndex: ["volume", "volume"],
                            align: "center",
                            render: (text, record) => text || text === 0 ? text : <Spin/>,
                            sorter: (a, b) => a.volume.volume - b.volume.volume,
                        },
                        {
                            title: "fee(E)",
                            dataIndex: ["activity", "fee"],
                            align: "center",
                            render: (text, record) => text || text === 0 ? text : <Spin/>,
                            sorter: (a, b) => a.activity.fee - b.activity.fee,
                        }
                    ]

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
                    )

                }
            ]
        },
    ];
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
                getStarkData(values.address).then((response) => {
                    setData(prevData => {
                        const updatedData = [...prevData];
                        updatedData[index] = {
                            ...updatedData[index],
                            ...response,
                        }
                        localStorage.setItem('stark_addresses', JSON.stringify(updatedData));  // 更新 localStorage
                        return updatedData;
                    });
                })
            } else {
                const newEntry = {
                    key: data.length.toString(),
                    name: values.name,
                    address: values.address,
                };
                setData(prevData => [...prevData, newEntry]);
                getStarkData(values.address).then((response) => {
                    setData(prevData => {
                        const newData = [...prevData];
                        newData[newData.length - 1] = {
                            ...newData[newData.length - 1],
                            ...response,
                        }
                        localStorage.setItem('stark_addresses', JSON.stringify(newData));  // 更新 localStorage
                        return newData;
                    });
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

    const handleDelete = (key) => {
        setData(data.filter(item => item.key !== key));
        localStorage.setItem('stark_addresses', JSON.stringify(data.filter(item => item.key !== key)));
    }
    const handleBatchOk = async () => {
        try {
            setIsBatchModalVisible(false);
            const values = await batchForm.validateFields();
            const addresses = values.addresses.split("\n");
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

                const index = data.findIndex(item => item.address === address);
                if (index !== -1) {
                    const response = await getStarkData(address);
                    setData(prevData => {
                        const updatedData = [...prevData];
                        updatedData[index] = {
                            ...updatedData[index],
                            ...response,
                        };
                        localStorage.setItem('stark_addresses', JSON.stringify(updatedData));
                        return updatedData;
                    });
                } else {
                    const newEntry = {
                        key: idCounter.toString(),
                        address: address,
                    };

                    idCounter++; // Increment the counter for each new entry

                    setData(prevData => [...prevData, newEntry]);

                    const response = await getStarkData(address);
                    setData(prevData => {
                        const newData = [...prevData];
                        newData[newData.length - 1] = {
                            ...newData[newData.length - 1],
                            ...response,
                        };
                        localStorage.setItem('stark_addresses', JSON.stringify(newData));
                        return newData;
                    });
                }
            }
        } catch (error) {
            notification.error({
                message: "错误",
                description: error.message,
            });
        } finally {
            batchForm.resetFields();
            setSelectedKeys([]);
        }
    };
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
            for (let key of selectedKeys) {
                const index = data.findIndex(item => item.key === key);
                if (index !== -1) {
                    setData(prevData => {
                        const updatedData = [...prevData];
                        for (let field in updatedData[index]) {
                            if (field !== 'address' && field !== 'name' && field !== 'key') {
                                updatedData[index][field] = null;
                            }
                        }
                        return updatedData;
                    });

                    const response = await getStarkData(data[index].address);

                    setData(prevData => {
                        const updatedData = [...prevData];
                        updatedData[index] = {
                            ...updatedData[index],
                            ...response,
                        };
                        localStorage.setItem('stark_addresses', JSON.stringify(updatedData));
                        return updatedData;
                    });
                }
            }
            notification.success({
                message: "完成",
                description: "刷新地址数据完成",
            }, 2);
        } catch (error) {
            notification.error({
                message: "错误",
                description: error.message,
            }, 2);
        } finally {
            setIsLoading(false);
            setSelectedKeys([]);
        }
    };


    const handleDeleteSelected = () => {
        if (!selectedKeys.length) {
            notification.error({
                message: "错误",
                description: "请先选择要删除的地址",
            }, 2);
            return;
        }
        setData(data.filter(item => !selectedKeys.includes(item.key)));
        localStorage.setItem('stark_addresses', JSON.stringify(data.filter(item => !selectedKeys.includes(item.key))));
        setSelectedKeys([]);
    }
    const exportToExcelFile = () => {
        exportToExcel(data, 'starkInfo');
    }
    const [editingKey, setEditingKey] = useState(null);
    const rowSelection = {
        selectedRowKeys: selectedKeys,
        onChange: (selectedRowKeys) => {
            setSelectedKeys(selectedRowKeys);
        },
    };
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
                       width={800}
                >
                    <Form form={batchForm} layout="vertical">
                        <Form.Item label="地址" name="addresses" rules={[{required: true}]}>
                            <TextArea placeholder="请输入地址，每行一个"
                                      style={{width: "100%", height: "300px", resize: "none"}}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="添加地址" open={isModalVisible} onOk={handleOk}
                       onCancel={() => setIsModalVisible(false)}
                       okText={"添加地址"}
                       cancelText={"取消"}
                       width={800}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item label="地址" name="address" rules={[{required: true}]}>
                            <Input placeholder="请输入地址" style={{width: "100%"}}/>
                        </Form.Item>
                        <Form.Item label="备注" name="name">
                            <Input placeholder="请输入备注" style={{width: "100%"}}/>
                        </Form.Item>
                    </Form>
                </Modal>
                <div style={{marginBottom: "50px"}}>
                    <Spin spinning={tableLoading} size={"large"}>
                        <Table
                            rowSelection={rowSelection}
                            dataSource={data}
                            pagination={false}
                            bordered={true}
                            style={{marginBottom: "20px"}}
                            size={"small"}
                            columns={columns}
                        />
                    </Spin>
                </div>
                <div className="stark_footer">
                    <Card size={"small"} style={{width: "100%"}}>
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
                                    icon={<SyncOutlined/>}>
                                刷新选中地址
                            </Button>
                            <Popconfirm title={"确认删除" + selectedKeys.length + "个地址？"}
                                        onConfirm={handleDeleteSelected}>
                                <Button type="primary" danger size={"large"}
                                        style={{width: "20%"}}
                                        icon={<DeleteOutlined/>}>
                                    删除选中地址
                                </Button>
                            </Popconfirm>
                            <Button type="primary" icon={<DownloadOutlined/>} size={"large"} style={{width: "8%"}}
                                    onClick={exportToExcelFile}
                            />
                        </div>
                    </Card>
                </div>
            </Content>
        </div>
    )
}
export default Stark;

import {useEffect, useState} from "react";
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
    message,
    Tooltip,
    Typography
} from 'antd';
import {Layout, Card} from 'antd';
import {exportToExcel,} from "@utils"
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    CopyOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined, ReloadOutlined,
    SyncOutlined,
    UploadOutlined
} from "@ant-design/icons";
import {getStark} from "@utils/stark/main.js";
import './index.css'
import copy from "copy-to-clipboard";
import deleteData from "@utils/indexedDB/deleteData.js";

const {Text} = Typography;
const {TextArea} = Input;
const {Content} = Layout;
const Stark = () => {
    const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
    const [batchLoading, setBatchLoading] = useState(false);
    const [data, setData] = useState([]);
    const [batchForm] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    let idCounter = data.length + 1;
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        setTableLoading(true);

        const storedAddresses = localStorage.getItem('stark_addresses');
        setTimeout(() => {
            setTableLoading(false);
        }, 500);

        if (storedAddresses) {
            setData(JSON.parse(storedAddresses));
        }

        setInitialized(true);
    }, []);

    useEffect(() => {
        if (!initialized) return;

        localStorage.setItem('stark_addresses', JSON.stringify(data));
    }, [data, initialized]);

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
                const displayText = text || <EditOutlined/>;
                return (
                    <Popconfirm
                        title={
                            <div>
                                <Input
                                    placeholder={"请输入备注"}
                                    defaultValue={text}
                                    onChange={(e) => {
                                        record.name = e.target.value
                                    }}
                                    allowClear
                                    bordered
                                />
                            </div>
                        }
                        icon={<EditOutlined/>}
                        onConfirm={() => {
                            setData([...data]);
                            localStorage.setItem('stark_addresses', JSON.stringify(data));
                        }}
                        onCancel={() => {
                        }}
                        okText={"确定"}
                        cancelText={"取消"}
                    >
                        <Tag color="blue" style={{cursor: "pointer"}}>
                            {displayText}
                        </Tag>
                    </Popconfirm>
                );
            }
        },
        {
            title: '钱包地址',
            dataIndex: 'address',
            key: 'address',
            align: 'center',
            className: 'address',
            render: (text) => {
                const handleCopy = () => {
                    copy(text);
                    message.success('地址已复制');
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
            title: "StarkId",
            dataIndex: ["accountInfo", "starkId"],
            key: "starkId",
            align: "center",
            render: (text) => text,
        },
        {
            title: "StarkNet",
            children: [
                {
                    title: "ETH",
                    dataIndex: ["balance", "ETH"],
                    key: "stark_eth_balance",
                    align: "center",
                },
                {
                    title: "USDC",
                    dataIndex: ["balance", "USDC"],
                    key: "stark_usdc_balance",
                    align: "center",
                },
                {
                    title: "USDT",
                    dataIndex: ["balance", "USDT"],
                    key: "stark_usdt_balance",
                    align: "center",
                },
                {
                    title: "DAI",
                    dataIndex: ["balance", "DAI"],
                    key: "stark_dai_balance",
                    align: "center",
                },
                {
                    title: "WBTC",
                    dataIndex: ["balance", "WBTC"],
                    key: "stark_wbtc_balance",
                    align: "center",
                },
                {
                    title: "Tx",
                    dataIndex: "tx",
                    key: "stark_tx_amount",
                    align: "center",
                    sorter: (a, b) => a.tx - b.tx,
                },
                {
                    title: "最后交易",
                    dataIndex: "lastTime",
                    key: "stark_latest_tx",
                    align: "center",
                    render: (text, record) => <a href={`https://voyager.online/contract/${record.address}`}
                                                 target="_blank">{text}</a>,
                },
                {
                    title: "官方桥Tx",
                    className: "stark_cross_tx",
                    children: [
                        {
                            title: "L1->L2",
                            dataIndex: ["bridge", "DepositTx"],
                            align: "center",
                        },
                        {
                            title: "L2->L1",
                            dataIndex: ["bridge", "WithdrawTx"],
                            align: "center",
                        },
                    ]
                },
                {
                    title: "官方桥金额(U)",
                    className: "stark_cross_amount",
                    children: [
                        {
                            title: "L1->L2",
                            dataIndex: ["bridge", "DepositVolume"],
                            align: "center",

                        },
                        {
                            title: "L2->L1",
                            dataIndex: ["bridge", "WithdrawVolume"],
                            align: "center",
                        }
                    ]

                },
                {
                    title: "活跃统计",
                    className: "stark_activity",
                    children: [
                        {
                            title: "天",
                            dataIndex: ["activity", "dayActivity"],
                            align: "center",
                        },
                        {
                            title: "周",
                            dataIndex: ["activity", "weekActivity"],
                            align: "center",
                        },
                        {
                            title: "月",
                            dataIndex: ["activity", "monthActivity"],
                            align: "center",
                        },
                        {
                            title: "合约",
                            dataIndex: ["activity", "contractActivity"],
                            align: "center",
                        },
                        {
                            title: "Vol(U)",
                            dataIndex: "Vol",
                            align: "center",
                            sorter: (a, b) => a.Vol - b.Vol,
                        },
                        {
                            title: "fee(E)",
                            dataIndex: "fee",
                            align: "center",
                            sorter: (a, b) => a.fee - b.fee,
                        }
                    ]
                },
                {
                    title: "状态",
                    key: "result",
                    align: "center",
                    render: (text, record) => (
                        <Space>
                            {record['result'] === "success" ?
                                <Tag icon={<CheckCircleOutlined/>} color="success">成功</Tag> : null}
                            {record['result'] === "error" ?
                                <Tooltip title={record['reason']}>
                                    <Tag icon={<CloseCircleOutlined/>} color="error">失败 </Tag>
                                </Tooltip> : null}
                            {record['result'] === "pending" ?
                                <Tag icon={<SyncOutlined spin/>} color="processing">获取中 </Tag> : null}
                        </Space>
                    )
                },
                {
                    title: "操作",
                    key: "action",
                    align: "center",
                    render: (text, record) => (
                        <Space>
                            <Popconfirm title={"确认删除？"} onConfirm={async () => {
                                await handleDelete(record.address)
                            }}>
                                <Button icon={<DeleteOutlined/>}/>
                            </Popconfirm>
                            <Button icon={<ReloadOutlined/>} onClick={() => {
                                handleRefresh(record.key)
                            }}/>
                        </Space>
                    )
                }
            ]
        },
    ];
    const handleDelete = async (address) => {
        setData(data.filter(item => item.address !== address));
        localStorage.setItem('stark_addresses', JSON.stringify(data.filter(item => item.address !== address)));
        await deleteData("starkTransactions", [address]);
    }
    const handleBatchOk = async () => {
        try {
            setBatchLoading(true);
            setIsBatchModalVisible(false);
            const values = await batchForm.validateFields();
            const addresses = values.addresses.split("\n");

            const limit = 5;
            let activePromises = 0;
            let promisesQueue = [];

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
                if (address.length === 0) {
                    notification.error({
                        message: "错误",
                        description: "请输入正确的stark地址(64位)",
                        duration: 1,
                    });
                    continue;
                }
                if (!address.startsWith("0x")) {
                    address = "0x" + address;
                }

                const promiseFunction = () => new Promise(async (resolve, reject) => {
                    try {
                        setData(prevData => {
                            const updatedData = [...prevData];
                            const index = updatedData.findIndex(item => item.address === address);
                            if (index === -1) {
                                const newEntry = {
                                    key: idCounter.toString(),
                                    address: address,
                                    result: "pending",
                                };
                                idCounter++;
                                updatedData.push(newEntry);
                            }
                            return updatedData;
                        });
                        const response = await getStark(address);
                        setData(prevData => {
                            const updatedData = [...prevData];
                            const index = updatedData.findIndex(item => item.address === address);
                            if (index !== -1) {
                                updatedData[index] = {
                                    ...updatedData[index],
                                    ...response,
                                };
                            }
                            return updatedData;
                        });
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
                promisesQueue.push(promiseFunction);
            }
            processQueue();
            while (activePromises > 0 || promisesQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            notification.success({
                message: "成功",
                description: "批量添加完成",
                duration: 1,
            })
        } catch (error) {
            notification.error({
                message: "错误",
                description: error.message,
                duration: 1,
            });
        } finally {
            batchForm.resetFields();
            setSelectedKeys([]);
            setBatchLoading(false)
        }
    };
    const handleRefresh = async (singleKey) => {
        const keys = singleKey ? [singleKey] : selectedKeys;
        if (!keys.length) {
            notification.error({
                message: "错误",
                description: "请先选择要刷新的地址",
                duration: 1,
            });
            return;
        }
        setIsLoading(true);
        try {
            const limit = 5;
            let activePromises = 0;
            let promisesQueue = [];
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
            for (let key of keys) {
                const index = data.findIndex(item => item.key === key);
                if (index !== -1) {
                    const promiseFunction = () => new Promise(async (resolve, reject) => {
                        try {
                            setData(prevData => {
                                const updatedData = [...prevData];
                                for (let field in updatedData[index]) {
                                    if (field !== 'address' && field !== 'name' && field !== 'key') {
                                        if (field === "result") {
                                            updatedData[index][field] = "pending";
                                        } else {
                                            updatedData[index][field] = null;
                                        }
                                    }
                                }
                                return updatedData;
                            });

                            const response = await getStark(data[index].address);
                            setData(prevData => {
                                const updatedData = [...prevData];
                                updatedData[index] = {
                                    ...updatedData[index],
                                    ...response,
                                };
                                localStorage.setItem('stark_addresses', JSON.stringify(updatedData));
                                return updatedData;
                            });
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    });
                    promisesQueue.push(promiseFunction);
                }
            }
            processQueue();
            while (activePromises > 0 || promisesQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            notification.success({
                message: "完成",
                description: "刷新地址数据完成",
                duration: 1,
            });
        } catch (error) {
            notification.error({
                message: "错误",
                description: error.message,
                duration: 1,
            });
        } finally {
            setIsLoading(false);
            if (!singleKey) {
                setSelectedKeys([]);
            }
        }
    };

    const handleDeleteSelected = async () => {
        if (!selectedKeys.length) {
            notification.error({
                message: "错误",
                description: "请先选择要删除的地址",
                duration: 1,
            });
            return;
        }
        const addresses = data.filter(item => selectedKeys.includes(item.key)).map(item => item.address);
        await deleteData("starkTransactions", addresses);
        setData(data.filter(item => !selectedKeys.includes(item.key)));
        localStorage.setItem('stark_addresses', JSON.stringify(data.filter(item => !selectedKeys.includes(item.key))));
        setSelectedKeys([]);
    }
    const exportToExcelFile = () => {
        exportToExcel(data, 'starkInfo');
    }
    const rowSelection = {
        selectedRowKeys: selectedKeys,
        onChange: (selectedRowKeys) => {
            setSelectedKeys(selectedRowKeys);
        },
    };

    function formatNumber(number, decimals = 3) {
        return number === 0 ? '0' : number.toFixed(decimals);
    }

    const centeredTextStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
    };
    const tableSummary = (pageData) => {
        let totalEthBalance = 0;
        let totalUsdcBalance = 0;
        let totalUsdtBalance = 0;
        let totalDaiBalance = 0;
        let totalWBTCBalance = 0;
        let totalL1Tol2Amount = 0;
        let totalL2Tol1Amount = 0;
        let totalAmount = 0;
        let totalFee = 0;

        pageData.forEach((row) => {
            totalEthBalance += parseFloat(row.balance?.ETH || 0);
            totalUsdcBalance += parseFloat(row.balance?.USDC || 0);
            totalUsdtBalance += parseFloat(row.balance?.USDT || 0);
            totalDaiBalance += parseFloat(row.balance?.DAI || 0);
            totalWBTCBalance += parseFloat(row.balance?.WBTC || 0);
            totalL1Tol2Amount += parseFloat(row.bridge?.DepositVolume || 0);
            totalL2Tol1Amount += parseFloat(row.bridge?.WithdrawVolume || 0);
            totalAmount += parseFloat(row.Vol || 0);
            totalFee += parseFloat(row.fee || 0);
        });

        return (
            <Table.Summary>
                <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                        <div style={centeredTextStyle}>
                            <Text type={"danger"}>总计</Text>
                        </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}/>
                    <Table.Summary.Cell index={2}/>
                    <Table.Summary.Cell index={3}/>
                    <Table.Summary.Cell index={4}/>
                    <Table.Summary.Cell index={5}>
                        <div style={centeredTextStyle}>
                            <Text type="danger">{formatNumber(totalEthBalance)}</Text>
                        </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6}>
                        <div style={centeredTextStyle}>
                            <Text type="danger">{formatNumber(totalUsdcBalance)}</Text>
                        </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7}>
                        <div style={centeredTextStyle}>
                            <Text type="danger">{formatNumber(totalUsdtBalance)}</Text>
                        </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={8}>
                        <div style={centeredTextStyle}>
                            <Text type="danger">{formatNumber(totalDaiBalance)}</Text>
                        </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={9}>
                        <div style={centeredTextStyle}>
                            <Text type="danger">{formatNumber(totalWBTCBalance)}</Text>
                        </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={10}/>
                    <Table.Summary.Cell index={11}/>
                    <Table.Summary.Cell index={12}/>
                    <Table.Summary.Cell index={13}/>
                    <Table.Summary.Cell index={14}>
                        <div style={centeredTextStyle}>
                            <Text type="danger">{formatNumber(totalL1Tol2Amount, 2)}</Text>
                        </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={15}>
                        <div style={centeredTextStyle}>
                            <Text type="danger">{formatNumber(totalL2Tol1Amount, 2)}</Text>
                        </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={16}/>
                    <Table.Summary.Cell index={17}/>
                    <Table.Summary.Cell index={18}/>
                    <Table.Summary.Cell index={19}/>
                    <Table.Summary.Cell index={20}>
                        <div style={centeredTextStyle}>
                            <Text type="danger">
                                {formatNumber(totalAmount, 2)}
                            </Text>
                        </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={21}>
                        <div style={centeredTextStyle}>
                            <Text type="danger">
                                {formatNumber(totalFee, 2)}
                            </Text>
                        </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={22}/>
                    <Table.Summary.Cell index={23}/>
                </Table.Summary.Row>
            </Table.Summary>
        );
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
                        <Form.Item label="地址" name="addresses" rules={[
                            {
                                required: true,
                                validator: (_, value) => {
                                    const addresses = value.split("\n");
                                    let errorLines = [];
                                    for (let i = 0; i < addresses.length; i++) {
                                        let address = addresses[i].trim();
                                        if (address.length === 0) {
                                            errorLines.push(i + 1);
                                        }
                                    }
                                    if (errorLines.length) {
                                        return Promise.reject(`行 ${errorLines.join(", ")} 的地址格式错误，请输入正确的stark地址`);
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}>
                            <TextArea placeholder="请输入地址，每行一个"
                                      style={{width: "100%", height: "300px", resize: "none"}}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <div style={{marginBottom: "50px"}}>
                    <Spin spinning={tableLoading} size={"small"}>
                        <Table
                            rowSelection={rowSelection}
                            dataSource={data}
                            pagination={false}
                            bordered={true}
                            style={{marginBottom: "20px"}}
                            size={"small"}
                            columns={columns}
                            summary={tableSummary}
                        />
                    </Spin>
                </div>
                <div className="stark_footer">
                    <Card size={"small"} style={{width: "100%"}}>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                            <Button type="primary" onClick={() => {
                                setIsBatchModalVisible(true)
                            }} size={"large"} style={{width: "25%"}} icon={<UploadOutlined/>} loading={batchLoading}>
                                {batchLoading ? "添加中..." : "添加地址"}
                            </Button>
                            <Button type="primary" onClick={() => handleRefresh()} loading={isLoading} size={"large"}
                                    style={{width: "25%"}}
                                    icon={<SyncOutlined/>}>
                                刷新选中地址
                            </Button>
                            <Popconfirm title={"确认删除" + selectedKeys.length + "个地址？"}
                                        onConfirm={async () => {
                                            await handleDeleteSelected()
                                        }}>
                                <Button type="primary" danger size={"large"}
                                        style={{width: "25%"}}
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

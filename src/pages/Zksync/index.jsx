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
    Row, Col, InputNumber, message
} from 'antd';
import {exportToExcel} from "@utils"
import {useEffect, useState} from "react";
import './index.css';
import {Layout, Card} from 'antd';

const {Content} = Layout;
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    PlusOutlined, SearchOutlined, SettingOutlined,
    SyncOutlined,
    UploadOutlined
} from "@ant-design/icons";
import {EyeOutlined, EyeInvisibleOutlined} from "@ant-design/icons"
import {getAllZksSyncData} from "@utils/getZksyncData/index.js";

const {TextArea} = Input;

function Zksync() {
    const [batchProgress, setBatchProgress] = useState(0);
    const [batchLength, setBatchLength] = useState(0);
    const [batchloading, setBatchLoading] = useState(false);
    const [zkSyncConfigStore, setZkSyncConfigStore] = useState({});
    const [data, setData] = useState([]);
    const [hideColumn, setHideColumn] = useState(false);
    const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
    const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);
    const [batchForm] = Form.useForm();
    const [walletForm] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [showAddressDetailModal, setShowAddressDetailModal] = useState(null);
    const [addressDetail, setAddressDetail] = useState(null);
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
                const newData = await getAllZksSyncData(values.address);
                updatedData[index] = {
                    ...updatedData[index],
                    ...newData,
                }
                setData(updatedData);
                localStorage.setItem('addresses', JSON.stringify(data));
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
                    protocol: []
                };
                const newData = [...data, newEntry];
                setData(newData);
                getAllZksSyncData(values.address).then((resp) => {
                    console.log(resp)
                    const mergedData = {...newEntry, ...resp};
                    const newData = [...data, mergedData];
                    setData(newData);
                    localStorage.setItem('addresses', JSON.stringify(newData));
                });
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
            const limit = 5;
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
                        const keys = Object.keys(item);
                        for (let key of keys) {
                            if (key !== 'name' && key !== 'address' && key !== 'key') {
                                item[key] = null;
                            }
                        }
                        return getAllZksSyncData(item.address).then((resp) => {
                            newData[index] = {
                                ...item,
                                ...resp,
                            }
                            setData([...newData]);
                            localStorage.setItem('addresses', JSON.stringify(newData));
                        })
                    })
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
            const limit = 5;
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
                    protocol: []
                };
                if (index === -1) {
                    newData.push(item);
                }
                promisesQueue.push(() => promiseWithProgress().then(() => getAllZksSyncData(address).then((resp) => {
                    const mergedData = {...item, ...resp};
                    const index = newData.findIndex(item => item.address === address);
                    if (index !== -1) {
                        newData[index] = mergedData;
                    }
                })));
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
    const toggleHideColumn = () => {
        setHideColumn(!hideColumn);
    };

    const getEyeIcon = () => {
        if (hideColumn) {
            return <EyeInvisibleOutlined/>;
        }
        return <EyeOutlined/>;
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
        console.log(selectedKeys);
        const newData = data.filter(item => !selectedKeys.includes(item.key));
        console.log(newData);
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
        },
        {
            title: (
                <span>
                钱包地址
                    <span onClick={toggleHideColumn} style={{marginLeft: 8, cursor: 'pointer'}}>
                        {getEyeIcon()}
                    </span>
                </span>
            ),
            dataIndex: "address",
            key: "address",
            align: "center",
            render: (text, record) => {
                if (hideColumn) {
                    return text.slice(0, 4) + '***' + text.slice(-4);
                }
                return isRowSatisfyCondition(record) ?
                    <div
                        style={{backgroundColor: '#bbeefa', borderRadius: '5px'}}
                    >
                        {text}</div> : text ||
                    <Spin/>;
            },
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
                },
                {
                    title: "Tx",
                    dataIndex: "eth_tx_amount",
                    key: "eth_tx_amount",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> : text),
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
                },
                {
                    title: "Tx",
                    dataIndex: "zks1_tx_amount",
                    key: "zks1_tx_amount",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> : text),
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
                },
                {
                    title: "USDC",
                    dataIndex: "zks2_usdcBalance",
                    key: "zks2_usdcBalance",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> : text),
                },
                {
                    title: "Tx",
                    dataIndex: "zks2_tx_amount",
                    key: "zks2_tx_amount",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> : text),
                },
                {
                    title: "最后交易",
                    dataIndex: "zks2_last_tx",
                    key: "zks2_last_tx",
                    align: "center",
                    render: (text, record) => (text === null ? <Spin/> :
                        <a href={"https://explorer.zksync.io/address/" + record.address}
                           target={"_blank"}>{text}</a>),
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
                        },
                        {
                            title: "L2->L1",
                            dataIndex: "l2Tol1Times",
                            key: "l2Tol1Times",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
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
                        },
                        {
                            title: "L2->L1",
                            dataIndex: "l2Tol1Amount",
                            key: "l2Tol1Amount",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
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
                        },
                        {
                            title: "周",
                            dataIndex: "weekActivity",
                            key: "weekActivity",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                        },
                        {
                            title: "月",
                            dataIndex: "monthActivity",
                            key: "monthActivity",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                        },
                        {
                            title: "不同合约",
                            dataIndex: "contractActivity",
                            key: "contractActivity",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                        },
                        {
                            title: "金额(U)",
                            dataIndex: "totalExchangeAmount",
                            key: "totalExchangeAmount",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
                        },
                        {
                            title: "Fee(U)",
                            dataIndex: "totalFee",
                            key: "totalFee",
                            align: "center",
                            render: (text, record) => (text === null ? <Spin/> : text),
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
                    <Button icon={<SearchOutlined/>} onClick={() => setShowAddressDetailModal(record.key)}/>
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
    useEffect(() => {
        let address;
        let protocols;
        if (showAddressDetailModal !== null) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === showAddressDetailModal) {
                    protocols = data[i]['protocol'] || [];
                    address = data[i].address;
                    setAddressDetail({address: address, protocols: protocols,});
                    break;
                }
            }
            console.log(addressDetail);
        }
    }, [showAddressDetailModal]);
    const addressDetailColumns = [
        {
            title: '',
            dataIndex: 'logo',
            key: 'logo',
            align: 'center',
            render: (text, record) => (
                <img src={'/protocol/' + record.id + '.png'} style={{width: '20px', height: '20px'}} alt={record.id}/>
            ),
        },
        {
            title: '协议',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            render: (text, record) => (
                <a href={record.url} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            ),
        },
        {
            title: 'tx',
            dataIndex: 'interactions',
            key: 'interactions',
            sorter: (a, b) => a.volume - b.volume,
            align: 'center',
        },
        {
            title: '最后交易时间',
            dataIndex: 'lastActivity',
            key: 'lastActivity',
            align: 'center',
            render: (text, record) => (text === '' ? '无' : new Date(text).toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'})),
        },
        {
            title: '交易金额(U)',
            dataIndex: 'volume',
            key: 'volume',
            align: 'center',
            sorter: (a, b) => a.volume - b.volume,
            defaultSortOrder: 'descend',
            render: (text, record) => (Number(text).toFixed(2)),
        }
    ]
    return (
        <div>
            <Content>
                <Modal
                    title={addressDetail && addressDetail.address + '  交互数据详情'}
                    open={showAddressDetailModal !== null}
                    onCancel={() => setShowAddressDetailModal(null)}
                    footer={null}
                    width={1000}
                    centered={true}
                    bodyStyle={{height: '500px', overflow: 'auto'}}
                >
                    <div>
                        {addressDetail && (
                            <Table
                                columns={addressDetailColumns}
                                dataSource={addressDetail.protocols}
                                pagination={false}
                                defaultSortOrder="descend"
                                size={"small"}
                            />
                        )}
                    </div>
                </Modal>
                <Modal title="批量添加地址" open={isBatchModalVisible} onOk={handleBatchOk}
                       onCancel={handleBatchCancel}
                       okButtonProps={{loading: isLoading}}
                       okText={"添加地址"}
                       cancelText={"取消"}
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
                                    <FormItem name="dayMin" addonBefore="日活跃数 ≥ " addonAfter="天"/>
                                    <FormItem name="weekMin" addonBefore="周活跃数 ≥ " addonAfter="周"/>
                                    <FormItem name="monthMin" addonBefore="月活跃数 ≥ " addonAfter="月"/>
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
                        rowKey={record => record.key}
                        rowSelection={rowSelection}
                        dataSource={data}
                        pagination={false}
                        bordered={true}
                        style={{marginBottom: "20px", zIndex: 2}}
                        size={"small"}
                        columns={columns}
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
                                    {/*<Button type="primary" onClick={async () => {*/}
                                    {/*    const result = await getAllZksSyncData("0xcE9471cBE175fE91dA7Feb9C80478fE7f3443358");*/}
                                    {/*    console.log(result);*/}
                                    {/*}} size={"large"} style={{width: "8%"}}>*/}
                                    {/*    测试*/}
                                    {/*</Button>*/}
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

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
    Popconfirm, Tooltip, Checkbox
} from 'antd';
import {exportToExcel} from "@utils"
import {useEffect, useState} from "react";
import './index.css';
import {Layout, Card} from 'antd';

const {Content} = Layout;
import {
    AppstoreAddOutlined, CheckCircleOutlined, CloseCircleOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    ReloadOutlined, SearchOutlined,
    SyncOutlined,
    UploadOutlined
} from "@ant-design/icons";
import {EyeOutlined, EyeInvisibleOutlined} from "@ant-design/icons"
import {getAllZksSyncData} from "@utils/getZksyncData/index.js";
import EcosystemModal from "@components/EcosystemModal/index.jsx";
import {useTranslation} from "react-i18next";
import {dbConfig, get, initDB} from "@utils/indexedDB/main.js";
import deleteData from "@utils/indexedDB/deleteData.js";
import {Typography} from 'antd';

const {Text, Paragraph} = Typography;
const {TextArea} = Input;

function Zksync() {
    const {t} = useTranslation();
    const [batchloading, setBatchLoading] = useState(false);
    const [data, setData] = useState([]);
    const [hideColumn, setHideColumn] = useState(true);
    const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
    const [ecosystemModalVisible, setEcosystemModalVisible] = useState(false);
    const [batchForm] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [showAddressDetailModal, setShowAddressDetailModal] = useState(null);
    const [addressDetail, setAddressDetail] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [isGetTustalabsData, setIsGetTustalabsData] = useState(true);
    let idCounter = data.length + 1;
    useEffect(() => {
        const storedIsGetTustalabsData = localStorage.getItem('isGetTustalabsData');
        if (storedIsGetTustalabsData) {
            setIsGetTustalabsData(storedIsGetTustalabsData === 'true');
        }
    }, []);
    useEffect(() => {
        setTableLoading(true);

        const storedAddresses = localStorage.getItem('addresses');
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

        localStorage.setItem('addresses', JSON.stringify(data));
    }, [data, initialized]);
    const handleRefresh = async (singleKey) => {
        const keys = singleKey ? [singleKey] : selectedKeys;
        if (!keys.length) {
            notification.error({
                message: t('zk_error'),
                description: t('zk_error_msg3'),
                duration: 1
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

                            const response = await getAllZksSyncData(data[index].address, isGetTustalabsData);
                            setData(prevData => {
                                const updatedData = [...prevData];
                                updatedData[index] = {
                                    ...updatedData[index],
                                    ...response,
                                };
                                localStorage.setItem('addresses', JSON.stringify(updatedData));
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
            s
            notification.error({
                message: t('zk_error'),
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

    const handleBatchOk = async () => {
        try {
            setBatchLoading(true);
            setIsBatchModalVisible(false);
            const values = await batchForm.validateFields();
            const addresses = values['addresses'].split("\n");

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
                if (address.length !== 42) {
                    notification.error({
                        message: t('zk_error'),
                        description: t('zk_error_msg'),
                        duration: 1,
                    });
                    continue;
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
                        const response = await getAllZksSyncData(address, isGetTustalabsData);
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
                message: t('zk_error'),
                description: error.message,
                duration: 1,
            });
        } finally {
            setBatchLoading(false);
            batchForm.resetFields();
            setSelectedKeys([]);
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
    const showBatchModal = () => {
        setIsBatchModalVisible(true);
    };
    const exportToExcelFile = () => {
        exportToExcel(data, 'walletInfo');
    }
    const handleDelete = async (address) => {
        setData(data.filter(item => item.address !== address));
        localStorage.setItem('addresses', JSON.stringify(data.filter(item => item.address !== address)));
        await deleteData("zkProtocol", [address]);
        await deleteData("zkTransactions", [address]);
    }
    const handleDeleteSelected = async () => {
        if (!selectedKeys.length) {
            notification.error({
                message: t('zk_error'),
                description: t('zk_error_msg2'),
                duration: 1
            });
            return;
        }
        const addresses = data.filter(item => selectedKeys.includes(item.key)).map(item => item.address);
        await deleteData("zkTransactions", addresses);
        await deleteData("zkProtocol", addresses);
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
    const getProtocol = async (address) => {
        await initDB(dbConfig)
        const protocol = await get("zkProtocol", address);
        console.log(protocol)
        const protocolData = protocol.data ? JSON.parse(protocol.data) : [];
        return {address: address, protocols: protocolData} || {address: address, protocols: []};
    }
    const columns = [
        {
            title: "#",
            key: "index",
            align: "center",
            render: (text, record, index) => index + 1,
        },
        {
            title: t("notes"),
            dataIndex: "name",
            key: "name",
            align: "center",
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
                            localStorage.setItem('addresses', JSON.stringify(data));
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
            },
        },
        {
            title: (
                <span>
            {t("address")}
                    <span onClick={toggleHideColumn} style={{marginLeft: 8, cursor: 'pointer'}}>
                {getEyeIcon()}
            </span>
        </span>
            ),
            dataIndex: "address",
            key: "address",
            align: "center",
            render: (text) => {
                const displayText = hideColumn ? text.slice(0, 4) + '***' + text.slice(-4) : text;
                return (
                    <Paragraph copyable={{text}} style={{whiteSpace: "nowrap", margin: 0}}>
                        {displayText}
                    </Paragraph>
                );
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
                },
                {
                    title: "Tx",
                    dataIndex: "eth_tx_amount",
                    key: "eth_tx_amount",
                    align: "center",
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
                    dataIndex: ['zksLiteBalance', "zks1_balance"],
                    key: "zks1_balance",
                    align: "center",
                },
                {
                    title: "Tx",
                    dataIndex: ['zksLiteBalance', "zks1_tx_amount"],
                    key: "zks1_tx_amount",
                    align: "center",
                    sorter: (a, b) => a.zksLiteBalance.zks1_tx_amount - b.zksLiteBalance.zks1_tx_amount,
                },
                {
                    title: t('last_tx'),
                    dataIndex: ['zksLiteBalance', "zks1_latest_tx"],
                    key: "zks1_latest_tx",
                    align: "center",
                }
            ],

        },
        {
            title: "zkSyncEra",
            key: "zks_era_group",
            className: "zks_era",
            children: [
                {
                    title: "ETH",
                    dataIndex: ['zksEraBalance', "zks2_balance"],
                    key: "zks2_balance",
                    align: "center",
                },
                {
                    title: "USDC",
                    dataIndex: ['zksEraBalance', "zks2_usdcBalance"],
                    key: "zks2_usdcBalance",
                    align: "center",
                },
                {
                    title: "Tx",
                    dataIndex: ['zksEraBalance', "zks2_tx_amount"],
                    key: "zks2_tx_amount",
                    align: "center",
                    sorter: (a, b) => a.zksEraBalance.zks2_tx_amount - b.zksEraBalance.zks2_tx_amount,
                },
                {
                    title: t("last_tx"),
                    dataIndex: ['activity', "zks2_last_tx"],
                    key: "zks2_last_tx",
                    align: "center",
                    render: (text, record) => (
                        <a href={"https://explorer.zksync.io/address/" + record.address}
                           target={"_blank"}>{text}</a>),
                },
                {
                    title: t('official_bridge_tx'),
                    key: "cross_chain_tx_count_group",
                    children: [
                        {
                            title: "L1->L2",
                            dataIndex: ['bridge', "l1Tol2Times"],
                            key: "l1Tol2Times",
                            align: "center",
                        },
                        {
                            title: "L2->L1",
                            dataIndex: ['bridge', "l2Tol1Times"],
                            key: "l2Tol1Times",
                            align: "center",
                        },
                    ],
                },
                {
                    title: t('official_bridge_amount'),
                    key: "cross_chain_amount_group",
                    children: [
                        {
                            title: "L1->L2",
                            dataIndex: ['bridge', "l1Tol2Amount"],
                            key: "l1Tol2Amount",
                            align: "center",
                        },
                        {
                            title: "L2->L1",
                            dataIndex: ['bridge', "l2Tol1Amount"],
                            key: "l2Tol1Amount",
                            align: "center",
                        },
                    ],
                },
                {
                    title: t('activities'),
                    key: "activity_stats_group",
                    children: [
                        {
                            title: t('day'),
                            dataIndex: ['activity', "dayActivity"],
                            key: "dayActivity",
                            align: "center",
                        },
                        {
                            title: t('week'),
                            dataIndex: ['activity', "weekActivity"],
                            key: "weekActivity",
                            align: "center",
                        },
                        {
                            title: t('month'),
                            dataIndex: ['activity', "monthActivity"],
                            key: "monthActivity",
                            align: "center",
                        },
                        {
                            title: t('contract'),
                            dataIndex: ['activity', "contractActivity"],
                            key: "contractActivity",
                            align: "center",
                        },
                        {
                            title: t('amount'),
                            dataIndex: "totalExchangeAmount",
                            key: "totalExchangeAmount",
                            align: "center",
                            sorter: (a, b) => a.totalExchangeAmount - b.totalExchangeAmount,
                        },
                        {
                            title: t('fee'),
                            dataIndex: "totalFee",
                            key: "totalFee",
                            align: "center",
                        }
                    ],
                },
            ],
        },
        {
            title: (
                <span>
                    <Space>
                    <span>Trustalabs</span>
                    <Checkbox
                        checked={isGetTustalabsData}
                        onChange={(e) => {
                            setIsGetTustalabsData(e.target.checked);
                            localStorage.setItem('isGetTustalabsData', e.target.checked);
                        }}/>
                        </Space>
                </span>
            ),
            key: 'trustData',
            className: "trustData",
            children: [
                {
                    title: t('score'),
                    key: 'score',
                    dataIndex: ['trustData', 'score'],
                    align: 'center',
                    sorter: (a, b) => a.trustData.score - b.trustData.score,
                },
                {
                    title: t('rank'),
                    key: 'rank',
                    dataIndex: ['trustData', 'rank'],
                    align: 'center',
                    sorter: (a, b) => a.trustData.rank - b.trustData.rank,
                },
                {
                    title: 'Top',
                    key: 'top',
                    dataIndex: ['trustData', 'top'],
                    align: 'center',
                    render: (text) => (text !== "-" && text ? text.toString() + "%" : text),
                    sorter: (a, b) => a.trustData.top - b.trustData.top,
                }
            ]
        },
        {
            title: "NFT是否可领",
            key: "nft",
            align: "center",
            dataIndex: "isCanClaim",
            render: (text) => (
                <Space>
                    {text && text === "yes" ? <Tag color="success">是</Tag> : null}
                    {text && text === "no" ? <Tag color="error">否</Tag> : null}
                    {text && text === "error" ? <Tag color="error">获取失败</Tag> : null}
                </Space>
            )
        },
        {
            title: t("state"),
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
            title: t('operation'),
            key: "action",
            align: "center",
            render: (text, record) => (
                <Space size="small">
                    <Popconfirm title={t('zk_message_confirm_delete')} onConfirm={async () => {
                        await handleDelete(record.address)
                    }}>
                        <Button icon={<DeleteOutlined/>}/>
                    </Popconfirm>
                    <Button icon={<SearchOutlined/>} onClick={() => {
                        setShowAddressDetailModal(record.address)
                        getProtocol(record.address).then((res) => {
                            setAddressDetail(res)
                        })
                    }

                    }/>
                    <Button icon={<ReloadOutlined/>} onClick={() => {
                        handleRefresh(record.key)
                    }}/>
                </Space>
            ),
        },
    ];
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
            title: t('protocol'),
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
            sorter: (a, b) => a.interactions - b.interactions,
            align: 'center',
        },
        {
            title: t('last_tx'),
            dataIndex: 'lastActivity',
            key: 'lastActivity',
            align: 'center',
            render: (text) => (text === '' ? '无' : new Date(text).toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'})),
        },
        {
            title: t('amount'),
            dataIndex: 'volume',
            key: 'volume',
            align: 'center',
            sorter: (a, b) => a.volume - b.volume,
            defaultSortOrder: 'descend',
            render: (text) => (Number(text).toFixed(2)),
        }
    ]

    function formatNumber(number, decimals = 3) {
        return number === 0 ? '0' : number.toFixed(decimals);
    }

    const tableSummary = (pageData) => {
        let totalEthBalance = 0;
        let totalZkLiteEthBalance = 0;
        let totalZkEraEthBalance = 0;
        let totalZkEraUsdcBalance = 0;
        let totalL1Tol2Amount = 0;
        let totalL2Tol1Amount = 0;
        let totalAmount = 0;
        let totalFee = 0;

        pageData.forEach((row) => {
            totalEthBalance += parseFloat(row.eth_balance || 0);
            totalZkLiteEthBalance += parseFloat(row.zksLiteBalance?.zks1_balance || 0);
            totalZkEraEthBalance += parseFloat(row.zksEraBalance?.zks2_balance || 0);
            totalZkEraUsdcBalance += parseFloat(row.zksEraBalance?.zks2_usdcBalance || 0);
            totalL1Tol2Amount += parseFloat(row.bridge?.l1Tol2Amount || 0);
            totalL2Tol1Amount += parseFloat(row.bridge?.l2Tol1Amount || 0);
            totalAmount += parseFloat(row.totalExchangeAmount || 0);
            totalFee += parseFloat(row.totalFee || 0);
        });

        return (
            <Table.Summary>
                <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                        <Text type={"danger"}>总计</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}/>
                    <Table.Summary.Cell index={2}/>
                    <Table.Summary.Cell index={3}/>
                    <Table.Summary.Cell index={4}>
                        <Text type="danger">{formatNumber(totalEthBalance)}</Text></Table.Summary.Cell>
                    <Table.Summary.Cell index={5}/>
                    <Table.Summary.Cell index={6}>
                        <Text type="danger">
                            {formatNumber(totalZkLiteEthBalance)}
                        </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7}/>
                    <Table.Summary.Cell index={8}/>
                    <Table.Summary.Cell index={9}>
                        <Text type="danger">
                            {formatNumber(totalZkEraEthBalance)}
                        </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={10}>
                        <Text type="danger">
                            {formatNumber(totalZkEraUsdcBalance, 2)}
                        </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={11}/>
                    <Table.Summary.Cell index={12}/>
                    <Table.Summary.Cell index={13}/>
                    <Table.Summary.Cell index={14}/>
                    <Table.Summary.Cell index={15}>
                        <Text type="danger">
                            {formatNumber(totalL1Tol2Amount)}
                        </Text>

                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={16}>
                        <Text type="danger">
                            {formatNumber(totalL2Tol1Amount)}
                        </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={17}/>
                    <Table.Summary.Cell index={18}/>
                    <Table.Summary.Cell index={19}/>
                    <Table.Summary.Cell index={20}/>
                    <Table.Summary.Cell index={21}>
                        <Text type="danger">
                            {formatNumber(totalAmount, 2)}
                        </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={22}><Text type="danger">
                        {formatNumber(totalFee, 2)}</Text><
                        /Table.Summary.Cell>
                    <Table.Summary.Cell index={23}/>
                    <Table.Summary.Cell index={24}/>
                    <Table.Summary.Cell index={25}/>
                    <Table.Summary.Cell index={26}/>
                    <Table.Summary.Cell index={27}/>
                    <Table.Summary.Cell index={28}/>
                </Table.Summary.Row>
            </Table.Summary>
        );
    };

    return (
        <div>
            <Content>
                <EcosystemModal open={ecosystemModalVisible} onCancel={() => setEcosystemModalVisible(false)}/>
                <Modal
                    title={addressDetail && addressDetail.address + '  ' + t('address_detail')}
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
                <Modal title={t('batch_add_address')} open={isBatchModalVisible} onOk={handleBatchOk}
                       onCancel={handleBatchCancel}
                       okButtonProps={{loading: isLoading}}
                       okText={"OK"}
                       cancelText={"Cancel"}
                >
                    <Form form={batchForm} layout="vertical">
                        <Form.Item label={t('address')} name="addresses" rules={[{required: true}]}>
                            <TextArea placeholder={t('zk_msg')} style={{width: "500px", height: "200px"}}/>
                        </Form.Item>
                    </Form>
                </Modal>
                <div style={{marginBottom: "50px"}}>
                    <Spin spinning={tableLoading} size={"small"}>
                        <Table
                            rowKey={record => record.key}
                            rowSelection={rowSelection}
                            dataSource={data}
                            pagination={false}
                            bordered={true}
                            style={{marginBottom: "20px", zIndex: 2}}
                            size={"small"}
                            columns={columns}
                            summary={tableSummary}
                        />
                    </Spin>
                </div>
                <div className="zks_footer">
                    <Card size={"small"} style={{width: '100%'}}>
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '10px',
                        }}>
                            <Button type="primary"
                                    onClick={() => {
                                        setEcosystemModalVisible(true)
                                    }}
                                    size="large"
                                    style={{width: "20%"}}
                                    icon={<AppstoreAddOutlined/>}
                            >
                                <span style={{color: 'white'}}>{t('ecosystem')}</span>
                            </Button>
                            <Button type="primary" onClick={showBatchModal} size={"large"}
                                    style={{width: "20%"}}
                                    icon={<UploadOutlined/>}
                                    loading={batchloading}
                            >
                                {batchloading ? t('adding') : t('batch_add_address')}
                            </Button>
                            <Button type="primary" onClick={() => handleRefresh()} loading={isLoading}
                                    size={"large"}
                                    style={{width: "20%"}} icon={<SyncOutlined/>}>
                                {isLoading ? t('refreshing') : t('refresh_selected_address')}
                            </Button>
                            <Popconfirm title={t('confirm_delete') + selectedKeys.length + t('address_count') + "?"}
                                        onConfirm={async () => {
                                            await handleDeleteSelected()
                                        }}>
                                <Button type="primary" danger size={"large"}
                                        style={{width: "20%"}} icon={<DeleteOutlined/>}>
                                    {t('delete_selected_address')}
                                </Button>
                            </Popconfirm>
                            <Button type="primary" icon={<DownloadOutlined/>} size={"large"}
                                    style={{width: "8%"}}
                                    onClick={exportToExcelFile}/>
                        </div>
                    </Card>
                </div>
            </Content>
        </div>
    );
}

export default Zksync;

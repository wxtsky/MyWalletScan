import {useEffect, useState} from "react";
import {Button, Card, Form, Input, Layout, Modal, notification, Space, Spin, Table, Tag} from "antd";
import {exportToExcel, getStgData} from "@utils";
import {DownloadOutlined, EditOutlined} from "@ant-design/icons";

const {Content} = Layout;
const {TextArea} = Input;

const Layer = () => {
    const [data, setData] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [batchForm] = Form.useForm();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedKeys(selectedRowKeys);
        },
    };
    const exportToExcelFile = () => {
        exportToExcel(data, 'LayerZeroInfo');
    }
    const handleDeleteSelected = () => {
        setData(data.filter(item => !selectedKeys.includes(item.key)));
        localStorage.setItem('l0_addresses', JSON.stringify(data.filter(item => !selectedKeys.includes(item.key))));
        setSelectedKeys([]);
    }
    const handleDelete = (key) => {
        setData(data.filter(item => item.key !== key));
        localStorage.setItem('l0_addresses', JSON.stringify(data.filter(item => item.key !== key)));
    }
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (!values.address.startsWith('0x')) {
                values.address = '0x' + values.address;
            }
            if (values.address.length !== 42) {
                notification.error({
                    message: "错误",
                    description: "请输入正确的EVM地址",
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
                getStgData(values.address).then(({arb, avax, bsc, eth, ftm, matic, metis, op, total}) => {
                    updatedData[index] = {
                        ...updatedData[index],
                        arb: arb,
                        avax: avax,
                        bsc: bsc,
                        eth: eth,
                        ftm: ftm,
                        matic: matic,
                        metis: metis,
                        op: op,
                        total: total,
                    }
                    setData(updatedData);
                    localStorage.setItem('l0_addresses', JSON.stringify(data));
                })
            } else {
                const newEntry = {
                    key: data.length.toString(),
                    name: values.name,
                    address: values.address,
                    arb: null,
                    avax: null,
                    bsc: null,
                    eth: null,
                    ftm: null,
                    matic: null,
                    metis: null,
                    op: null,
                    total: null,
                };
                const newData = [...data, newEntry];
                setData(newData);
                getStgData(values.address).then(({arb, avax, bsc, eth, ftm, matic, metis, op, total}) => {
                    newEntry.arb = arb;
                    newEntry.avax = avax;
                    newEntry.bsc = bsc;
                    newEntry.eth = eth;
                    newEntry.ftm = ftm;
                    newEntry.matic = matic;
                    newEntry.metis = metis;
                    newEntry.op = op;
                    newEntry.total = total;
                    setData([...newData]);
                    localStorage.setItem('l0_addresses', JSON.stringify(newData));
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
                    item.eth = null;
                    item.bsc = null;
                    item.ftm = null;
                    item.matic = null;
                    item.metis = null;
                    item.op = null;
                    item.arb = null;
                    item.avax = null;
                    item.total = null;
                    setData([...newData]);
                    getStgData(item.address).then(({arb, avax, bsc, eth, ftm, matic, metis, op, total}) => {
                        item.arb = arb;
                        item.avax = avax;
                        item.bsc = bsc;
                        item.eth = eth;
                        item.ftm = ftm;
                        item.matic = matic;
                        item.metis = metis;
                        item.op = op;
                        item.total = total;
                        setData([...newData]);
                        localStorage.setItem('l0_addresses', JSON.stringify(data));
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
            const addresses = values['addresses'].split("\n");
            const newData = [...data];
            for (let address of addresses) {
                if (!address.startsWith("0x")) {
                    address = "0x" + address;
                }
                address = address.trim();
                if (address.length !== 42) {
                    notification.error({
                        message: "错误",
                        description: "请输入正确的EVM地址",
                    });
                    continue;
                }
                const index = newData.findIndex(item => item.address === address);
                if (index !== -1) {
                    const updatedData = [...newData];
                    getStgData(address).then(({arb, avax, bsc, eth, ftm, matic, metis, op, total}) => {
                        updatedData[index] = {
                            ...updatedData[index],
                            arb: arb,
                            avax: avax,
                            bsc: bsc,
                            eth: eth,
                            ftm: ftm,
                            matic: matic,
                            metis: metis,
                            op: op,
                            total: total,
                        }
                        setData(updatedData);
                        localStorage.setItem('l0_addresses', JSON.stringify(updatedData));
                    })
                } else {
                    const newEntry = {
                        key: newData.length.toString(),
                        address: address,
                        arb: null,
                        avax: null,
                        bsc: null,
                        eth: null,
                        ftm: null,
                        matic: null,
                        metis: null,
                        op: null,
                        total: null,
                    };
                    newData.push(newEntry);
                    setData(newData);
                    getStgData(address).then(({arb, avax, bsc, eth, ftm, matic, metis, op, total}) => {
                        newEntry.arb = arb;
                        newEntry.avax = avax;
                        newEntry.bsc = bsc;
                        newEntry.eth = eth;
                        newEntry.ftm = ftm;
                        newEntry.matic = matic;
                        newEntry.metis = metis;
                        newEntry.op = op;
                        newEntry.total = total;
                        setData([...newData]);
                        localStorage.setItem('l0_addresses', JSON.stringify(newData));
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
    const [editingKey, setEditingKey] = useState(null);
    const columns = [
            {
                title: '备注',
                dataIndex: 'name',
                key: 'name',
                align: 'center',
                render: (text, record) => {
                    const isEditing = record.key === editingKey;
                    return isEditing ? (
                        <Input
                            placeholder="请输入备注"
                            defaultValue={text}
                            onPressEnter={(e) => {
                                record.name = e.target.value;
                                setData([...data]);
                                localStorage.setItem('l0_addresses', JSON.stringify(data));
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
                }
            },
            {
                title: '地址',
                dataIndex: 'address',
                key: 'address',
                align: 'center',
            },
            {
                title: 'ETH',
                dataIndex: 'eth',
                key: 'eth',
                render: (text, record) => {
                    return (text === null ? <Spin/> : text)
                },
                align: 'center',
            },
            {
                title: 'MATIC',
                dataIndex: 'matic',
                key: 'matic',
                render: (text, record) => {
                    return (text === null ? <Spin/> : text)
                },
                align: 'center',
            },
            {
                title: 'BSC',
                dataIndex: 'bsc',
                key: 'bsc',
                render: (text, record) => {
                    return (text === null ? <Spin/> : text)
                },
                align: 'center',
            },
            {
                title: 'ARB',
                dataIndex: 'arb',
                key: 'arb',
                render: (text, record) => {
                    return (text === null ? <Spin/> : text)
                },
                align: 'center',
            },
            {
                title: 'OP',
                dataIndex: 'op',
                key: 'op',
                render: (text, record) => {
                    return (text === null ? <Spin/> : text)
                },
                align: 'center',
            },
            {
                title: 'AVAX',
                dataIndex: 'avax',
                key: 'avax',
                render: (text, record) => {
                    return (text === null ? <Spin/> : text)
                },
                align: 'center',
            },
            {
                title: 'FTM',
                dataIndex: 'ftm',
                key: 'ftm',
                render: (text, record) => {
                    return (text === null ? <Spin/> : text)
                },
                align: 'center',
            },
            {
                title: 'METIS',
                dataIndex: 'metis',
                key: 'metis',
                render: (text, record) => {
                    return (text === null ? <Spin/> : text)
                },
                align: 'center',
            },
            {
                title: "总Tx",
                dataIndex: "total",
                key: "total",
                render: (text, record) => {
                    return (text === null ? <Spin/> : text)
                },
                align: "center"
            },
            {
                title: "操作",
                key: "action",
                render: (text, record) => {
                    return (
                        <Space size="small">
                            <Button
                                type="primary"
                                danger
                                onClick={() => handleDelete(record.key)}
                            >
                                删除
                            </Button>
                        </Space>
                    )
                },
                align: 'center',
            }
        ]
    ;
    useEffect(() => {
        setTableLoading(true)
        const storedAddresses = localStorage.getItem('l0_addresses');
        setTimeout(() => {
            setTableLoading(false);
        }, 500);
        if (storedAddresses) {
            setData(JSON.parse(storedAddresses));
        }
    }, []);
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
                        <Form.Item label="备注" name="name" rules={[{required: true}]}>
                            <Input placeholder="请输入备注"/>
                        </Form.Item>
                    </Form>
                </Modal>
                <Spin spinning={tableLoading}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }}
                        pagination={false}
                        bordered={true}
                        size={"small"}
                    />
                </Spin>
                <Card>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                        <Button type="primary" onClick={() => {
                            setIsModalVisible(true)
                        }} size={"large"} style={{width: "20%"}}>
                            添加地址
                        </Button>
                        <Button type="primary" onClick={() => {
                            setIsBatchModalVisible(true)
                        }} size={"large"} style={{width: "20%"}}>
                            批量添加地址
                        </Button>
                        <Button type="primary" onClick={handleRefresh} loading={isLoading} size={"large"}
                                style={{width: "20%"}}
                                disabled={!selectedKeys.length}>
                            刷新选中地址
                        </Button>
                        <Button type="primary" danger onClick={handleDeleteSelected} size={"large"}
                                style={{width: "20%"}}
                                disabled={!selectedKeys.length}>
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
export default Layer;

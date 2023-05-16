import React, {useState, useEffect} from 'react';
import {Table, Button, Input, Modal, Form, Popconfirm, Space, Spin, Checkbox, Tag} from 'antd';
import './index.css'
import {CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";

const Deposit = () => {
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [isPaginated, setIsPaginated] = useState(true);
    const [searchText, setSearchText] = useState("");
    const isEditing = (record) => record.key === editingKey;
    const onPaginationChange = (e) => {
        setIsPaginated(e.target.checked);
    };
    useEffect(() => {
        setLoading(true)
        const localData = localStorage.getItem('depositData');
        setTimeout(() => {
            setLoading(false)
        }, 500)
        if (localData) {
            setData(JSON.parse(localData));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('depositData', JSON.stringify(data));
    }, [data]);
    const edit = (record) => {
        form.setFieldsValue({...record});
        setEditingKey(record.key);
    };

    const save = async (record) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => record.key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {...item, ...row});
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
        form.resetFields();
    };

    const addRecord = () => {
        form.validateFields().then((values) => {
            const newData = [...data, {key: Date.now().toString(), ...values}];
            setData(newData);
            setIsModalVisible(false);
            form.resetFields();
        }).catch((info) => {
            console.log('Validation failed:', info);
        });
    };

    const cancel = () => {
        setEditingKey('');
    };

    const deleteRecord = (record) => {
        setData(data.filter(item => item.key !== record.key));
    };

    const filteredData = searchText
        ? data.filter(
            item =>
                item.aAddress.toLowerCase().includes(searchText.toLowerCase()) ||
                item.bAddress.toLowerCase().includes(searchText.toLowerCase())
        )
        : data;
    const columns = [
        {
            title: '#',
            key: 'index',
            render: (text, record, index) => index + 1,
            align: 'center',
        },
        {
            title: '个人地址',
            dataIndex: 'aAddress',
            key: 'aAddress',
            render: (text, record) => isEditing(record) ?
                <Form.Item name="aAddress" style={{margin: 0}}>
                    <Input defaultValue={text} onChange={(e) => form.setFieldsValue({aAddress: e.target.value})}/>
                </Form.Item> : text,
            align: 'center',
            width: 500
        },
        {
            title: '交易所地址',
            dataIndex: 'bAddress',
            key: 'bAddress',
            render: (text, record) => isEditing(record) ?
                <Form.Item name="bAddress" style={{margin: 0}}>
                    <Input defaultValue={text} onChange={(e) => form.setFieldsValue({bAddress: e.target.value})}/>
                </Form.Item> : text,
            align: 'center',
            width: 500
        },
        {
            title: '交易所名称',
            dataIndex: 'exchangeName',
            key: 'exchangeName',
            render: (text, record) => isEditing(record) ?
                <Form.Item name="exchangeName" style={{margin: 0}}>
                    <Input defaultValue={text} onChange={(e) => form.setFieldsValue({exchangeName: e.target.value})}/>
                </Form.Item> : text,
            align: 'center'
        },
        {
            title: '备注',
            dataIndex: 'notes',
            key: 'notes',
            render: (text, record) => isEditing(record) ?
                <Form.Item name="notes" style={{margin: 0}}>
                    <Input defaultValue={text} onChange={(e) => form.setFieldsValue({notes: e.target.value})}/>
                </Form.Item> : text,
            align: 'center'
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space>
                        <Button
                            type={"primary"}
                            onClick={() => save(record)}
                            icon={<CheckOutlined/>}
                        />
                        <Button onClick={cancel} icon={<CloseOutlined/>}/>
                    </Space>
                ) : (
                    <Space>
                        <Button
                            type={"primary"}
                            disabled={editingKey !== ''}
                            onClick={() => edit(record)}
                            icon={<EditOutlined/>}
                        />
                        <Popconfirm title={`确定删除吗?`} onConfirm={() => deleteRecord(record)}>
                            <Button icon={<DeleteOutlined/>}/>
                        </Popconfirm>
                    </Space>
                );
            },
            align: 'center'
        },
    ];
    return (
        <>
            <Space style={{marginBottom: 10}}>
                <Button type="primary" onClick={() => setIsModalVisible(true)}
                        icon={<PlusOutlined/>} shape="round"/>
                <Checkbox onChange={onPaginationChange} checked={isPaginated}>是否分页</Checkbox>
                <Tag color="magenta">当前共有{data.length}条记录</Tag>
                <Tag color="magenta">方便管理个人地址和交易所充值地址，做到一一对应，防止女巫</Tag>
            </Space>
            <Input.Search
                bordered
                allowClear
                placeholder="搜索地址"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{marginBottom: 10}}
            />
            <Modal title="添加记录" open={isModalVisible} onOk={addRecord} onCancel={() => setIsModalVisible(false)}>
                <Form form={form} layout="vertical">
                    <Form.Item label="个人地址" name="aAddress" rules={[{required: true, message: '请输入个人地址'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="交易所地址" name="bAddress"
                               rules={[{required: true, message: '请输入交易所地址'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="交易所名称" name="exchangeName">
                        <Input/>
                    </Form.Item>
                    <Form.Item label="备注" name="notes">
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
            <Spin spinning={loading}>
                <Table
                    bordered
                    columns={columns}
                    dataSource={filteredData}
                    className="centered-table"
                    pagination={isPaginated ? {defaultPageSize: 10} : false}
                />
            </Spin>
        </>
    );
};

export default Deposit;

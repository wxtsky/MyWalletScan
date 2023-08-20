import React from 'react';
import {Button, Typography, message, Upload, Modal, Table, Space, Popconfirm} from 'antd';
import {
    CloudDownloadOutlined,
    DeleteOutlined,
    SyncOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import BackupData from "@utils/BackupData.js";
import RestoreData from "@utils/RestoreData.js";
import ClearAllCache from "@utils/ClearAllCache.js";

const {Text} = Typography;
const {Title} = Typography;
const getDataInfo = (data) => {
    try {
        const zksync = data['addresses'] ? data['addresses'].length : 0;
        const stark = data['stark_addresses'] ? data['stark_addresses'].length : 0;
        const linea = data['linea_addresses'] ? data['linea_addresses'].length : 0;
        const l0 = data['l0_addresses'] ? data['l0_addresses'].length : 0;
        return [
            {
                key: '1',
                zksync,
                stark,
                linea,
                l0
            },
        ];
    } catch (e) {
        message.error('备份文件内容错误');
        return [];
    }
}
const Setting = () => {
    const buttonStyles = {
        height: '100px',
        borderRadius: '10px',
        marginBottom: '20px',
    };
    const [loading, setLoading] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [jsonData, setJsonData] = React.useState({});
    const BackUp = async () => {
        setLoading(true);
        await BackupData();
        setTimeout(() => {
            setLoading(false)
            message.success('备份成功,将自动下载备份文件');
        }, 1000);
    }
    const handleUpload = async (file) => {
        if (file.status === 'removed') {
            setJsonData({});
            setData([]);
            return;
        }
        if (file.type !== 'application/json') {
            message.error('上传文件格式错误');
            return;
        }
        try {
            const text = await file.text();
            const jsonData = JSON.parse(text);
            setJsonData(jsonData);
            setData(getDataInfo(jsonData));
        } catch (error) {
            console.log('Error parsing uploaded file:', error);
        }
    };
    return (
        <div>
            <Modal title="备份地址信息(Beta)" open={modalOpen} footer={null}
                   onCancel={() => setModalOpen(false)}>
                <div style={{textAlign: 'center'}}>
                    <Upload beforeUpload={() => false}
                            onChange={(info) => handleUpload(info.file)}
                            maxCount={1}>
                        <Button icon={<CloudDownloadOutlined/>} type={"primary"}>
                            上传备份文件
                        </Button>
                    </Upload>
                    <Text>备份文件中的地址数量信息</Text>
                    <Table dataSource={data} pagination={false} columns={[
                        {
                            title: 'zkSync',
                            dataIndex: 'zksync',
                        },
                        {
                            title: 'stark',
                            dataIndex: 'stark',
                        },
                        {
                            title: 'linea',
                            dataIndex: 'linea',
                        },
                        {
                            title: 'l0',
                            dataIndex: 'l0',
                        }
                    ]}/>
                    <Space style={{marginTop: '20px'}}>
                        <Button type={"primary"}
                                onClick={async () => {
                                    if (data.length === 0) {
                                        message.error('没有数据');
                                        return;
                                    }
                                    await RestoreData(jsonData, false);
                                    setModalOpen(false);
                                }}
                        >合并旧地址并恢复</Button>
                        <Button type={"primary"}
                                onClick={async () => {
                                    if (data.length === 0) {
                                        message.error('没有数据');
                                        return;
                                    }
                                    await RestoreData(jsonData, true);
                                    setModalOpen(false);
                                }}
                        >删除旧地址并恢复</Button>
                    </Space>

                </div>
            </Modal>
            <div style={{padding: '40px', display: 'flex', justifyContent: 'center'}}>
                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    background: '#fff',
                    borderRadius: '10px',
                    padding: '20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                    <Title level={2} style={{color: '#1890ff', textAlign: 'center'}}>设置</Title>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '20px',
                            marginBottom: '20px'
                        }}>
                        <Button style={{...buttonStyles}} loading={loading}
                                onClick={() => BackUp()} type={"primary"}>
                            <DownloadOutlined/> 备份所有地址信息
                        </Button>
                        <Button icon={<CloudDownloadOutlined/>} style={{...buttonStyles}} type={"primary"}
                                onClick={() => setModalOpen(true)}>
                            还原所有地址信息
                        </Button>
                        <Popconfirm title={"确定要清理所有缓存信息吗?"} onConfirm={() => {
                            ClearAllCache();
                        }}>
                            <Button style={{...buttonStyles}} danger>
                                <DeleteOutlined/> 清理所有缓存信息
                            </Button>
                        </Popconfirm>
                        <Button style={{...buttonStyles}} type={"primary"}
                                onClick={
                                    () => {
                                        window.open('https://docs.google.com/forms/d/e/1FAIpQLSdRPvxzg4Xrp3KcRmmkXhj_zVzbiYILYs8gKrGmuUh2B0iu0w/viewform?usp=pp_url');
                                    }
                                }
                        >
                            <SyncOutlined/> 问题反馈与建议
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Setting;

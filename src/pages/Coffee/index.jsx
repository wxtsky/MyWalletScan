import React from 'react';
import {Layout, Typography, Button, message, Space, Image} from 'antd';
import {CopyOutlined} from '@ant-design/icons';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';

const {Content} = Layout;
const {Title, Text} = Typography;

const Coffee = () => {
    const ethAddress = "0x88888A8b367cCE8C82C451f37511905c3028ed49";

    const contentStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 64px)',
        padding: '40px',
        backgroundColor: '#F5F5F5' // 更柔和的背景色
    };

    const qrCodeStyle = {
        marginTop: '20px',
        marginBottom: '20px',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' // 添加阴影
    };

    const textStyle = {
        marginBottom: '30px', // 增加间距
        color: '#333' // 深色文本
    };

    const imageStyle = {
        marginLeft: '10px',
        borderRadius: '50%',
        verticalAlign: 'middle',
        position: 'relative',
        top: '-4px'
    };

    const buttonStyle = {
        backgroundColor: '#FFA726', // 按钮颜色
        borderColor: '#FFA726',
        color: '#fff'
    };

    const copyAddress = () => {
        copy(ethAddress);
        message.success('地址已复制到剪贴板');
    };

    return (
        <Layout>
            <Content style={contentStyle}>
                <Title level={3} style={textStyle}>捐赠作者一杯咖啡
                    <Image src="/coffee.jpg" width={30} preview={false} style={imageStyle}/>
                </Title>
                <div style={textStyle}>
                    <Space>
                        <Text><strong>EVM地址：</strong>{ethAddress}</Text>
                        <Button icon={<CopyOutlined/>} style={buttonStyle} onClick={copyAddress}>复制</Button>
                    </Space>
                </div>
                <div style={qrCodeStyle}>
                    <QRCode value={ethAddress}/>
                </div>
            </Content>
        </Layout>
    );
}

export default Coffee;

import React from 'react';
import {Timeline, Card, Button, Row, Col} from 'antd';
import {updates} from './updates';

const Setting = () => {
    return (
        <Row style={{padding: '20px'}} gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <h1>设置</h1>
                <Card>
                    <Button block style={{marginBottom: '10px'}}>
                        备份所有地址信息
                    </Button>
                    <Button block style={{marginBottom: '10px'}}>
                        还原所有地址信息
                    </Button>
                    <Button block style={{marginBottom: '10px'}}>
                        清理所有缓存
                    </Button>
                    <Button block>
                        同步地址信息
                    </Button>
                </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <h1>MyWallet更新信息</h1>
                <Card>
                    <Timeline
                        mode="left"
                        items={updates}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default Setting;

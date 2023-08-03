import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Col, Row, Spin} from "antd";
import {Typography, Space} from 'antd';
import {Area, Bar} from '@antv/g2plot';
import axios from 'axios';
import moment from "moment";

const {Text} = Typography;

const getStarkTvl = async () => {
    const url = 'https://api.llama.fi/v2/historicalChainTvl/Starknet';
    const response = await axios.get(url);
    return response.data;
}

const Chart = ({data, nowTvl, change24h, onRefresh}) => {
    const containerRef = useRef(null);
    useEffect(() => {
        if (data.length === 0) {
            return;
        }
        let VolData = [];
        data.forEach(item => {
            VolData.push({
                date: new Date(item.date * 1000).toLocaleDateString(),
                tvl: item.tvl / 1000000,
            });
        });
        const max = Math.max(...VolData.map(item => item.tvl));
        if (containerRef.current) {
            const chart = new Area(containerRef.current, {
                data: VolData,
                xField: 'date',
                yField: 'tvl',
                smooth: true,
                isStack: true,
                label: {
                    content: (originData) => {
                        return `${originData.tvl.toFixed(0)}`;
                    },
                },
                slider: {
                    start: 0,
                    end: 1,
                    formatter: (v) => moment(v).format('YYYY-MM-DD'),
                },
                meta: {
                    tvl: {
                        alias: 'TVL(M)',
                        min: 0,
                        max: max * 1.1,

                    }
                }
            });
            chart.render();
        }
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [data]);
    return (
        <Card title="TVL(M)" bordered={true} extra={
            <Space>
                <Text type="secondary">Now </Text>
                <Text>{Number(nowTvl / 1000000).toFixed(2)}M</Text>
                <Text type="secondary">24h </Text>
                <Text type={change24h.includes('-') ? 'danger' : 'success'}>{change24h}</Text>
                <Button type="primary" onClick={onRefresh}>Refresh</Button>
            </Space>
        }>
            <div ref={containerRef} style={{height: 500}}></div>
        </Card>
    )
}
const TvlDetail = ({data}) => {
    const containerRef = useRef(null);
    useEffect(() => {
        if (data.length === 0) {
            return;
        }
        if (containerRef.current) {
            const chart = new Bar(containerRef.current, {
                data,
                xField: 'tvl',
                yField: 'name',
                yAxis: {
                    label: {
                        formatter: (v) => `${v}`,
                    }
                },
                label: {
                    position: 'right',
                    formatter: (v) => `${v.tvl.toFixed(2)}`,
                },
                meta: {
                    tvl: {
                        alias: 'TVL(M)',
                        max: Math.max(...data.map(item => item.tvl)) * 1.1,
                    }
                }
            });
            chart.render();
        }
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [data]);
    return (
        <Card title="Top 30 TVL(M)">
            <div ref={containerRef} style={{height: 500}}></div>
        </Card>
    )
}
const getZkTvlDetail = async () => {
    const url = "https://api.llama.fi/protocols";
    const response = await axios.get(url);
    let result = [];
    response.data.forEach((item) => {
        if (item['chains'].includes("Starknet") && item.category !== "CEX") {
            result.push({
                name: item.name,
                tvl: item['chainTvls']['Starknet'] / 1000000,
            });
        }
    });
    result.sort((a, b) => b.tvl - a.tvl);
    result = result.slice(0, 30);
    return result;
}

const ZkTvl = () => {
    const [data, setData] = useState([]);
    const [change24h, setChange24h] = useState(null);
    const [nowTvl, setNowTvl] = useState(null);
    const [tvlDetail, setTvlDetail] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await getStarkTvl();
            setData(result);
            const change = ((result[result.length - 1].tvl - result[result.length - 2].tvl) / result[result.length - 2].tvl) * 100;
            setChange24h(`${change.toFixed(2)}%`);
            setNowTvl(result[result.length - 1].tvl);
            const detail = await getZkTvlDetail();
            setTvlDetail(detail);
        } catch (error) {
            console.error("Failed to fetch data: ", error);
            setError("Failed to fetch data.");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Spin spinning={isLoading} size={"large"}>
                <Row gutter={16} style={{marginTop: 20}}>
                    <Col xs={24} md={12}>
                        {data.length !== 0 &&
                            <Chart data={data} nowTvl={nowTvl} change24h={change24h} onRefresh={fetchData}/>}
                    </Col>
                    <Col xs={24} md={12}>
                        {tvlDetail.length !== 0 && <TvlDetail data={tvlDetail}/>}
                    </Col>
                </Row>
            </Spin>
        </div>
    );
};

export default ZkTvl;

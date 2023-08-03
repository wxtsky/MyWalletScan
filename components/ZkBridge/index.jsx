import {useEffect, useRef, useState} from "react";
import {Alert, Card, Col, Row, Spin} from "antd";
import {Pie} from '@antv/g2plot';
import axios from "axios";


const PieChart = ({data, title}) => {
    const containerRef = useRef(null);
    useEffect(() => {
        if (containerRef.current) {
            const chart = new Pie(containerRef.current, {
                data,
                angleField: 'value',
                colorField: 'type',
                radius: 0.8,
                label: {
                    type: 'inner',
                    offset: '-30%',
                    content: '{value}',
                    style: {
                        textAlign: 'center',
                        fontSize: 14,
                    }
                },
                interactions: [{type: 'element-active'}],
                legend: {
                    layout: 'horizontal',
                    position: 'bottom',
                }
            })
            chart.render();
        }
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [data]);

    return (
        <Card title={title}>
            <div ref={containerRef} style={{height: '300px'}}></div>
        </Card>
    );
};


const ZkBridge = () => {
    const objectData = [
        {key: "lastHourlyTxs", title: "过去1小数Tx"},
        {key: "currentDayTxs", title: "当天Tx"},
        {key: "prevDayTxs", title: "前一天Tx"},
        {key: "dayBeforeLastTxs", title: "前两天Tx"},
        {key: "weeklyTxs", title: "一周Tx"},
        {key: "monthlyTxs", title: "一月Tx"},
    ]
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const url = "https://bridges.llama.fi/bridge/26"
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(url);
                const eraData = response.data['chainBreakdown']['zkSync Era']
                objectData.forEach((item) => {
                    setData((prev) => [...prev, {
                        title: item.title, value: [
                            {type: 'L2 Withdrawal To L1', value: eraData[item.key]['deposits']},
                            {type: 'L1 Deposit To L2', value: eraData[item.key]['withdrawals']},
                        ]
                    }])
                });
                setError(null);
            } catch (err) {
                console.error("Error fetching data: ", err);
                setError("Error fetching data.");
            }
            setIsLoading(false);
        }
        fetchData();
    }, []);

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon/>;
    }

    return (
        <div>
            <Spin spinning={isLoading}>
                <Row gutter={[16, 16]}>
                    {data.map((item, index) => {
                        return (
                            <Col xs={24} sm={12} md={6} key={index}>
                                <PieChart data={item.value} title={item.title}/>
                            </Col>
                        );
                    })}
                </Row>
            </Spin>
        </div>
    )
}

export default ZkBridge;

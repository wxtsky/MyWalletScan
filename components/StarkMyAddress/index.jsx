import {useEffect, useRef, useState} from "react";
import {Card, Col, Row, Select} from "antd";
import {getEthPrice} from "@utils";
import {dbConfig, get, getAllKeys, initDB} from "@utils/indexedDB/main.js";
import moment from "moment";
import {Area, Column} from "@antv/g2plot";

const createDateRange = (start, end) => {
    let currentDate = moment(start).startOf('day');
    const endDate = moment(end).startOf('day');
    let dateRange = [];

    while (currentDate.isSameOrBefore(endDate)) {
        dateRange.push({date: currentDate.format('YYYY-MM-DD'), value: 0});
        currentDate = currentDate.add(1, 'days');
    }

    return dateRange;
}
const DailyTransaction = ({transactions, ethPrice}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (transactions.length === 0) {
            return;
        }
        const sortedTransactions = transactions.sort((a, b) => moment(a.timestamp).isAfter(b.timestamp) ? 1 : -1);
        const startDate = sortedTransactions[0].timestamp * 1000;
        const endDate = sortedTransactions[sortedTransactions.length - 1].timestamp * 1000;
        const dateRange = createDateRange(startDate, endDate);

        let transactionData = {};
        transactions.forEach(item => {
            const dateOnly = moment(item.timestamp * 1000).format('YYYY-MM-DD');
            transactionData[dateOnly] = {
                date: dateOnly,
                value: parseFloat(item.actual_fee_display) * ethPrice
            };
        });

        let data = dateRange.map(item => transactionData[item.date] || item);

        if (containerRef.current) {
            const chart = new Column(containerRef.current, {
                data,
                xField: 'date',
                yField: 'value',
                slider: {
                    start: 0,
                    end: 1,
                    formatter: (v) => moment(v).format('YYYY-MM-DD'),
                },
            });
            chart.render();
        }
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        }
    }, [transactions]);

    return (
        <Card title={"每日Gas消耗统计(U)"}>
            <div ref={containerRef} style={{height: 300}}></div>
        </Card>
    );
}
const CumulativeGasFee = ({transactions, ethPrice}) => {
    const containerRef = useRef(null);
    useEffect(() => {
        if (transactions.length === 0) {
            return;
        }
        let transactionData = [];
        let cumulativeValue = 0;
        transactions.forEach(item => {
            cumulativeValue += parseFloat(item.actual_fee_display) * ethPrice;
            transactionData.push({
                date: moment(item.timestamp * 1000).format('YYYY-MM-DD'),
                value: cumulativeValue
            });
        });
        if (containerRef.current) {
            const chart = new Area(containerRef.current, {
                data: transactionData,
                xField: 'date',
                yField: 'value',
                smooth: true,
                isStack: true,
                slider: {
                    start: 0,
                    end: 1,
                    formatter: (v) => moment(v).format('YYYY-MM-DD'),
                },
                label: {
                    formatter: (v) => {
                        return v.value.toFixed(2)
                    },
                }
            });
            chart.render();
        }
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [transactions]);

    return (
        <Card title={"累计Gas消耗统计(U)"}>
            <div ref={containerRef} style={{height: 300}}></div>
        </Card>
    );
}
const DailyTransactions = ({transactions}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (transactions.length === 0) {
            return;
        }
        const sortedTransactions = transactions.sort((a, b) => moment(a.timestamp).isAfter(b.timestamp) ? 1 : -1);
        const startDate = sortedTransactions[0].timestamp * 1000;
        const endDate = sortedTransactions[sortedTransactions.length - 1].timestamp * 1000;
        const dateRange = createDateRange(startDate, endDate);

        let transactionData = {};
        transactions.forEach(item => {
            const dateOnly = moment(item.timestamp * 1000).format('YYYY-MM-DD');
            if (!transactionData[dateOnly]) {
                transactionData[dateOnly] = {
                    date: dateOnly,
                    value: 1
                };
            } else {
                transactionData[dateOnly].value += 1;
            }
        });

        let data = dateRange.map(item => transactionData[item.date] || item);

        if (containerRef.current) {
            const chart = new Column(containerRef.current, {
                data,
                xField: 'date',
                yField: 'value',
                slider: {
                    start: 0,
                    end: 1,
                    formatter: (v) => moment(v).format('YYYY-MM-DD'),
                },
            });
            chart.render();
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [transactions]);

    return (
        <Card title={"每日交易Tx"}>
            <div ref={containerRef} style={{height: 300}}></div>
        </Card>
    );
};
const getTransactionVolume = ({transaction}) => {
    const transfers = transaction.transfers.sort(
        (a, b) =>
            parseFloat(b.total_value) - parseFloat(a.total_value),
    );
    if (transfers.length === 0) return 0;
    return parseFloat(transfers[0].total_value);
}
const CumulativeVolume = ({transactions}) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (transactions.length === 0) {
            return;
        }

        let transactionData = {};
        let cumulativeValue = 0;

        transactions.forEach(transaction => {
            const dateOnly = moment(transaction.timestamp * 1000).format('YYYY-MM-DD');
            const volume = getTransactionVolume({transaction});
            cumulativeValue += volume;
            transactionData[dateOnly] = {
                date: dateOnly,
                value: cumulativeValue
            };
        });

        let data = Object.values(transactionData);

        if (containerRef.current) {
            const chart = new Area(containerRef.current, {
                data,
                xField: 'date',
                yField: 'value',
                smooth: true,
                isStack: true,
                slider: {
                    start: 0,
                    end: 1,
                    formatter: (v) => moment(v).format('YYYY-MM-DD'),
                },
                label: {
                    formatter: (v) => {
                        return v.value.toFixed(2)
                    },
                }
            });
            chart.render();
        }
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [transactions]);

    return (
        <Card title={"累计交易量(U)"}>
            <div ref={containerRef} style={{height: 300}}></div>
        </Card>
    );
};
const getStarkAllAddress = async () => {
    await initDB(dbConfig)
    const addresses = await getAllKeys("starkTransactions")
    return addresses || []
}
const getAddressTranscation = async (address) => {
    await initDB(dbConfig)
    const transactions = await get("starkTransactions", address)
    const transactionsData = transactions.data ? JSON.parse(transactions.data) : []
    return transactionsData || []
}
const StarkMyAddress = () => {
    const [address, setAddress] = useState([])
    const [selectAddress, setSelectAddress] = useState('')
    const [transactions, setTransactions] = useState([])
    const [ethPrice, setEthPrice] = useState(0)
    useEffect(() => {
        getEthPrice().then((res) => {
            setEthPrice(Number(res))
        })
    }, [])
    useEffect(() => {
        getStarkAllAddress().then((res) => {
            setAddress(res)
        })
    }, []);
    return (
        <div>
            <Select
                defaultValue="选择地址展示数据."
                style={{
                    width: "100%",
                    marginTop: "20px"
                }}
                onChange={(value) => {
                    setSelectAddress(value)
                    getAddressTranscation(value).then((res) => {
                        setTransactions(res)
                        console.log(res)
                    })
                }}
                notFoundContent={"暂无数据,请先刷新您的starkNet获取数据"}
                options={
                    address.map((item) => {
                        return {
                            value: item,
                            label: item
                        }
                    })
                }
            />
            <Row gutter={16} style={{marginTop: 20}}>
                <Col xs={24} md={12}>
                    {selectAddress && <DailyTransaction transactions={transactions} ethPrice={ethPrice}/>}
                </Col>
                <Col xs={24} md={12}>
                    {selectAddress && <CumulativeGasFee transactions={transactions} ethPrice={ethPrice}/>}
                </Col>
                <Col xs={24} md={12}>
                    {selectAddress && <DailyTransactions transactions={transactions}/>}
                </Col>
                <Col xs={24} md={12}>
                    {selectAddress && <CumulativeVolume transactions={transactions}/>}
                </Col>
            </Row>
        </div>
    )
}
export default StarkMyAddress;

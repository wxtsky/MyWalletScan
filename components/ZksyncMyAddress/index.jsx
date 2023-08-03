import {useState, useEffect, useRef} from "react";
import {Card, Col, Row, Select} from "antd";
import moment from "moment";
import {Area, Column, Line} from '@antv/g2plot';
import {getEthPrice} from "@utils";

const getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

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
        const sortedTransactions = transactions.sort((a, b) => moment(a.receivedAt).isAfter(b.receivedAt) ? 1 : -1);
        const startDate = sortedTransactions[0].receivedAt;
        const endDate = sortedTransactions[sortedTransactions.length - 1].receivedAt;
        const dateRange = createDateRange(startDate, endDate);

        let transactionData = {};
        transactions.forEach(item => {
            const dateOnly = moment(item.receivedAt).format('YYYY-MM-DD');
            transactionData[dateOnly] = {
                date: dateOnly,
                value: parseInt(item.fee, 16) / 10 ** 18 * ethPrice
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
            cumulativeValue += parseInt(item.fee, 16) / 10 ** 18 * ethPrice;
            transactionData.push({
                date: moment(item.receivedAt).format('YYYY-MM-DD'),
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
        const sortedTransactions = transactions.sort((a, b) => moment(a.receivedAt).isAfter(b.receivedAt) ? 1 : -1);
        const startDate = sortedTransactions[0].receivedAt;
        const endDate = sortedTransactions[sortedTransactions.length - 1].receivedAt;
        const dateRange = createDateRange(startDate, endDate);

        let transactionData = {};
        transactions.forEach(item => {
            const dateOnly = moment(item.receivedAt).format('YYYY-MM-DD');
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
            parseInt(b.amount) * 10 ** -b.token.decimals * b.token.price -
            parseInt(a.amount) * 10 ** -a.token.decimals * a.token.price,
    );
    if (transfers.length === 0) return 0;
    return parseInt(transfers[0].amount) * 10 ** -transfers[0].token.decimals * transfers[0].token.price;
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
            const dateOnly = moment(transaction.receivedAt).format('YYYY-MM-DD');
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


const ZksyncMyAddress = () => {
    const [address, setAddress] = useState({})
    const [selectAddress, setSelectAddress] = useState('')
    const [ethPrice, setEthPrice] = useState(0)
    useEffect(() => {
        getEthPrice().then((res) => {
            setEthPrice(Number(res))
        })
        const addressesInfo = getLocalStorage('zkSync_transactions') || [];
        addressesInfo.forEach((item) => {
            setAddress((prev) => {
                    return {...prev, [item.address]: item.transactions}
                }
            )
        })
    }, [])

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
                }}
                options={Object.keys(address).map((item) => {
                    return {label: item, value: item}
                })}
            />
            <Row gutter={16} style={{marginTop: 20}}>
                <Col xs={24} md={12}>
                    {selectAddress && <DailyTransaction transactions={address[selectAddress]} ethPrice={ethPrice}/>}
                </Col>
                <Col xs={24} md={12}>
                    {selectAddress && <CumulativeGasFee transactions={address[selectAddress]} ethPrice={ethPrice}/>}
                </Col>
                <Col xs={24} md={12}>
                    {selectAddress && <DailyTransactions transactions={address[selectAddress]}/>}
                </Col>
                <Col xs={24} md={12}>
                    {selectAddress && <CumulativeVolume transactions={address[selectAddress]}/>}
                </Col>
            </Row>
        </div>
    )
}
export default ZksyncMyAddress;

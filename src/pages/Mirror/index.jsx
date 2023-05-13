import {Card, Input, Row, Col, Typography, Pagination, Select, Spin, Empty, Image, Avatar} from 'antd';
import axios from "axios";
import {useState} from "react";

const {Search} = Input;
const {Meta} = Card;
const {Text} = Typography;
const {Option} = Select;


const Mirror = () => {
    const [results, setResults] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [sort, setSort] = useState('Time');
    const getMirror = (searchValue, currentPage, sort) => {
        setLoading(true);
        const encodedText = encodeURIComponent(searchValue);
        const url = `https://api.mirrorbeats.xyz/mirror/Mirror/search?page=${currentPage}&keyword=${encodedText}&sort=${sort}`;
        axios.get(url).then((res) => {
            console.log(res);
            setResults(res.data.data);
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false);
        });
    }
    const onSearch = (value) => {
        const searchKeyword = value || "空投";
        setSearchValue(searchKeyword);
        getMirror(searchKeyword, currentPage, sort);
    }
    const onPageChange = (page) => {
        setCurrentPage(page);
        const searchKeyword = searchValue || "空投";
        getMirror(searchKeyword, page, sort);
    }
    const onSortChange = (value) => {
        setSort(value);
        getMirror(searchValue, currentPage, value);
    }
    return (
        <div style={{padding: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <Search
                    placeholder="输入你想要查询的Mirror关键词"
                    onSearch={onSearch}
                    enterButton
                    style={{width: '70%', marginRight: '10px'}}
                />
                <Select placeholder="选择排序方式" defaultValue={sort} style={{width: 120}} onChange={onSortChange}>
                    <Option value="Relevance">Relevance</Option>
                    <Option value="Time">Time</Option>
                </Select>
                <Pagination current={currentPage} onChange={onPageChange} total={50} style={{flex: 'none'}}/>
            </div>
            {loading ? (
                <Spin size="large" style={{display: 'block', margin: '0 auto'}}/>
            ) : results.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {results.map(result => (
                        <Col span={6}>
                            <a href={result.link} target="_blank" rel="noreferrer">
                                <Card
                                    key={result.id}
                                    style={{
                                        borderRadius: '15px',
                                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                        transition: '0.3s',
                                        width: '100%',
                                        padding: '10px',
                                        marginBottom: '20px',
                                    }}
                                    hoverable
                                >
                                    <Meta
                                        title={<Text style={{
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                            whiteSpace: 'normal'
                                        }}>{result.title}</Text>}
                                        description={
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <div>
                                                    <Text strong>作者: </Text>
                                                    {result.nickname}
                                                    <br/>
                                                    <Text strong>创建时间: </Text>
                                                    {new Date(result.creat_time * 1000).toLocaleString()}
                                                </div>
                                                <div style={{marginLeft: '10px'}}>
                                                    <Avatar
                                                        src={result.avatar}
                                                        size={64}
                                                        onError={(e) => {
                                                            e.target.src = 'https://image.theblockbeats.info/icon/mirrorLogo.jpeg';
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        }
                                    />
                                </Card>
                            </a>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Empty description="Nothing"/>
            )}
        </div>
    )
}
export default Mirror;

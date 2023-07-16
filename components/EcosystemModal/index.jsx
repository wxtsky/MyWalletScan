import {Modal, Table, Button, Tooltip, Tag, Image} from "antd";

const ecosystemColumns = [
    {
        title: "",
        dataIndex: "logo",
        key: "logo",
        align: "center",
        render: (text) => (
            <div style={{
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Image
                    src={`/ecosystem/${text}`}
                    alt="logo"
                    style={{width: '100%', height: '100%', objectFit: 'contain'}}
                />
            </div>
        ),
    },
    {
        title: "协议",
        dataIndex: "name",
        key: "name",
        align: "center",
    },
    {
        title: "分类",
        dataIndex: "category",
        key: "category",
        align: "center",
        filters: [
            {text: 'DEX', value: 'DEX'},
        ],
        onFilter: (value, record) => record.category === value,
    },
    {
        title: "链接",
        dataIndex: "url",
        key: "url",
        align: "center",
        render: (text) => (
            <Tooltip title="点击确认前，请确保链接的安全性">
                <a href={text} target="_blank" rel="noreferrer">
                    {text}
                </a>
            </Tooltip>
        ),
    },
    {
        title: "介绍",
        dataIndex: "description",
        key: "description",
        align: "center",
        render: (text) => (
            <Tooltip title={text}>
                <span>{text.length > 30 ? `${text.substring(0, 30)}...` : text}</span>
            </Tooltip>
        ),
    },
];

const data = [
    {
        key: "1",
        logo: 'izi.png',
        name: "iziswap",
        category: "DEX",
        url: "https://zksync.izumi.finance/swap",
        description: "izumi_Finance是专注流动性的多链DeFi协议，刚刚完成了新一轮22M的融资，iZiSwap上线zkSync一个月，TVL便突破40M，目前是zksync第二的dex,未来会把zksync给予项目方潜在空投的50%，用来回馈给用户。",
    },
    {
        key: "2",
        logo: 'portal.png',
        name: "zkSync Portal",
        category: "Portal",
        url: "https://portal.zksync.io/",
        description: "zkSync官方钱包门户。",
    },
    {
        key: "3",
        logo: 'portal.png',
        name: "zkSync Bridge",
        category: "Bridge",
        url: "https://bridge.zksync.io/",
        description: "zkSync官方桥。",
    },
    {
        key: "4",
        logo: 'meson.png',
        name: "meson",
        category: "Bridge",
        url: "https://meson.fi/?from=bitboxtools",
        description: "Meson是一个领先的稳定币跨链协议，它允许稳定币在不同的区块链之间进行跨链交易。该协议支持 USDC、USDT 和 BUSD 等主流稳定币在 zkSync 和其他20条主流公链之间的跨链操作。",
    }
];

const EcosystemModal = (props) => {
    const {open, onCancel} = props;

    return (
        <Modal
            title={
                <>
                    生态应用
                    <Tag color="red"
                         style={{marginLeft: "8px"}}> 在您使用生态应用时，请仔细核对链接，一切造成的损失由您自行承担 </Tag>
                </>}
            open={open}
            onCancel={onCancel}
            footer={[
                <Button onClick={onCancel} type="primary" key="close">
                    关闭
                </Button>,
            ]}
            width={1200}
            centered
            closable={false}
            bodyStyle={{height: "500px", overflow: "auto"}}
        >
            <div>
                <Table columns={ecosystemColumns} pagination={false} size="small" dataSource={data}/>
            </div>
            <div style={{textAlign: "center", marginTop: "16px"}}>
                <p>Wait more...</p>
            </div>
        </Modal>
    );
};

export default EcosystemModal;

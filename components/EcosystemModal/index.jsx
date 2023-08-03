import {Modal, Table, Button, Tooltip, Tag, Image} from "antd";
import {useTranslation} from "react-i18next";

const EcosystemModal = (props) => {
    const {t} = useTranslation();
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
                        // src={`/ecosystem/${text}`}
                        src={text}
                        alt="logo"
                        style={{width: '100%', height: '100%', objectFit: 'contain'}}
                    />
                </div>
            ),
        },
        {
            title: t('protocol'),
            dataIndex: "name",
            key: "name",
            align: "center",
        },
        {
            title: t('category'),
            dataIndex: "category",
            key: "category",
            align: "center",
            filters: [
                {text: 'DEX', value: 'DEX'},
            ],
            onFilter: (value, record) => record.category === value,
        },
        {
            title: t('link'),
            dataIndex: "url",
            key: "url",
            align: "center",
            render: (text) => (
                <Tooltip title={t('tip')}>
                    <a href={text} target="_blank" rel="noreferrer">
                        {text}
                    </a>
                </Tooltip>
            ),
        },
        {
            title: t('intro'),
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
            logo: 'https://20178098.fs1.hubspotusercontent-na1.net/hubfs/20178098/ecosystem/izumi-1.png',
            name: "iziswap",
            category: "DEX",
            url: "https://zksync.izumi.finance/swap",
            description: "izumi_Finance是专注流动性的多链DeFi协议，刚刚完成了新一轮22M的融资，iZiSwap上线zkSync一个月，TVL便突破40M，目前是zksync第二的dex,未来会把zksync给予项目方潜在空投的50%，用来回馈给用户。",
        },
        {
            key: "2",
            logo: 'https://portal.zksync.io/_nuxt/icons/64x64.cb7cab0d.png',
            name: "zkSync Portal",
            category: "Portal",
            url: "https://portal.zksync.io/",
            description: "zkSync官方钱包门户。",
        },
        {
            key: "3",
            logo: 'https://portal.zksync.io/_nuxt/icons/64x64.cb7cab0d.png',
            name: "zkSync Bridge",
            category: "Bridge",
            url: "https://portal.zksync.io/bridge/",
            description: "zkSync官方桥。",
        },
        {
            key: "4",
            logo: 'https://20178098.fs1.hubspotusercontent-na1.net/hubfs/20178098/ecosystem/meson.svg',
            name: "meson",
            category: "Bridge",
            url: "https://meson.fi/?from=bitboxtools",
            description: "Meson是一个领先的稳定币跨链协议，它允许稳定币在不同的区块链之间进行跨链交易。该协议支持 USDC、USDT 和 BUSD 等主流稳定币在 zkSync 和其他20条主流公链之间的跨链操作。",
        },
        {
            key: "5",
            logo: 'https://20178098.fs1.hubspotusercontent-na1.net/hubfs/20178098/ecosystem/hito-transparent.svg',
            name: "Argent",
            category: "Wallet",
            url: "https://www.argent.xyz/",
            description: "Argent是一款基于以太坊的移动钱包，支持zkSync。",
        },
        {
            key: "6",
            logo: 'https://20178098.fs1.hubspotusercontent-na1.net/hubfs/20178098/ecosystem/Group%20104439%20-%20Naomi%20LI.svg',
            name: "Element Market",
            category: "NFT",
            url: "https://element.market/",
            description: "Element Market是一个聚合NFT市场。",
        },
        {
            key: "7",
            logo: 'https://20178098.fs1.hubspotusercontent-na1.net/hubfs/20178098/ecosystem/orbiter-1.png',
            name: "Orbiter",
            category: "Bridge",
            url: "https://orbiter.finance",
            description: "Orbiter是一个跨链桥。",
        },
        {
            key: "8",
            logo: 'https://20178098.fs1.hubspotusercontent-na1.net/hubfs/20178098/ecosystem/okxwallet.png',
            name: "OKX Wallet",
            category: "Wallet",
            url: "https://www.okx.com/cn/web3",
            description: "OKX Wallet,Web3 的入口。",
        },
        {
            key: "9",
            logo: 'https://20178098.fs1.hubspotusercontent-na1.net/hubfs/20178098/ecosystem-logo-2/eco-logo-DeBank.png',
            name: "DeBank",
            category: "Defi",
            url: "https://debank.com/",
            description: "DeBank是一个去中心化的钱包聚合资产平台。",
        }
    ];

    const {open, onCancel} = props;

    return (
        <Modal
            title={
                <>
                    {t('ecosystem')}
                    <Tag color="red"
                         style={{marginLeft: "8px"}}> {t('tip2')} </Tag>
                </>}
            open={open}
            onCancel={onCancel}
            footer={[
                <Button onClick={onCancel} type="primary" key="close">
                    {t('close')}
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

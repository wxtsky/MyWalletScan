import ZksyncMyAddress from "@components/ZksyncMyAddress/index.jsx";
import {Tabs} from "antd";
import ZkTvl from "@components/ZkTvl/index.jsx";
import ZkBridge from "@components/ZkBridge/index.jsx";
import ZkVol from "@components/ZkVol/index.jsx";

const ZkInfo = () => {
    const Items = [
        {
            label: '个人地址详情',
            key: 'ZksyncMyAddress',
            children: <ZksyncMyAddress/>
        },
        {
            label: 'zkSync Tvl',
            key: 'ZksyncTvl',
            children: <ZkTvl/>
        },
        {
            label: 'zkSync Bridge',
            key: 'ZksyncBridge',
            children: <ZkBridge/>
        },
        {
            label: 'zkSync Vol',
            key: 'ZksyncVol',
            children: <ZkVol/>
        }
    ]
    return (
        <div style={{padding: '0 20px'}}>
            <Tabs
                defaultActiveKey="ZksyncTvl"
                centered
                items={Items}
            />
        </div>
    )
}
export default ZkInfo;

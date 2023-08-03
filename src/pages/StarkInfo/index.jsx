import ZksyncMyAddress from "@components/ZksyncMyAddress/index.jsx";
import {Segmented, Tabs} from "antd";
import ZkBridge from "@components/ZkBridge/index.jsx";
import ZkVol from "@components/ZkVol/index.jsx";
import StarkTvl from "@components/StarkTvl/index.jsx";
import StarkVol from "@components/StarkVol/index.jsx";
import React from "react";

const StarkInfo = () => {
    const Items = [
        // {
        //     label: '个人地址详情',
        //     key: 'ZksyncMyAddress',
        //     children: <ZksyncMyAddress/>
        // },
        {
            label: 'StarkTvl',
            key: 'StarkTvl',
            children: <StarkTvl/>
        },
        // {
        //     label: 'zkSync Bridge',
        //     key: 'ZksyncBridge',
        //     children: <ZkBridge/>
        // },
        {
            label: 'StarkVol',
            key: 'StarkVol',
            children: <StarkVol/>
        }
    ]
    return (
        <>
            <Tabs
                defaultActiveKey="StarkTvl"
                centered
                items={Items}
            />
        </>
    )
}
export default StarkInfo;

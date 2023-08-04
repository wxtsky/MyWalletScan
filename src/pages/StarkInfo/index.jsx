import {Tabs} from "antd";
import StarkTvl from "@components/StarkTvl/index.jsx";
import StarkVol from "@components/StarkVol/index.jsx";
import React from "react";
import StarkMyAddress from "@components/StarkMyAddress/index.jsx";

const StarkInfo = () => {
    const Items = [
        {
            label: '个人地址详情',
            key: 'StarkMyAddress',
            children: <StarkMyAddress/>
        },
        {
            label: 'StarkTvl',
            key: 'StarkTvl',
            children: <StarkTvl/>
        },
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

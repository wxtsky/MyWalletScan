import {Menu} from 'antd';
import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {GithubOutlined, TwitterOutlined} from "@ant-design/icons";
import './index.css'
import {getEthPrice} from "@utils";
import React from "react";
import {useTranslation} from "react-i18next";
import {Select} from 'antd';

const {Option} = Select;

function LanguageSwitcher() {
    const {i18n} = useTranslation();

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        localStorage.setItem('i18nextLng', language);
    };

    return (
        <Select defaultValue={i18n.language} style={{width: 120}} onChange={changeLanguage}>
            <Option value="zh">中文</Option>
            <Option value="en">English</Option>
        </Select>
    );
}


const EthPrice = () => {
    const [ethPrice, setEthPrice] = useState(null);

    useEffect(() => {
        const fetchPrice = async () => {
            const price = await getEthPrice();
            setEthPrice(price);
        };

        fetchPrice();
        const interval = setInterval(fetchPrice, 10000);

        return () => clearInterval(interval);
    }, []);

    if (ethPrice === null) {
        return <div>Loading ETH Price...</div>;
    }

    return <div>ETH Price: ${ethPrice}</div>
};

const MenuHeader = () => {
    const items = [
        {
            label: 'zkSync',
            key: 'zksync',
        },
        {
            label: 'Stark',
            key: 'stark',
        },
        {
            label: 'LayerZero',
            key: 'layer',
        },
        // {
        //     label: 'Mirror',
        //     key: 'mirror',
        // },
        // {
        //     label: 'Deposit',
        //     key: 'deposit',
        // },
        {
            label: 'Coffee',
            key: 'coffee',
        },
        {
            label: (
                <a href="https://twitter.com/jingluo0" target="_blank" rel="noopener noreferrer">
                    <TwitterOutlined/>
                </a>
            ),
            key: 'twitter',
        },
        {
            label: (
                <a href="https://github.com/wxtsky/MyWalletScan" target="_blank" rel="noopener noreferrer">
                    <GithubOutlined/>
                </a>
            ),
            key: 'github',
        },
        {
            label: <EthPrice/>,
            key: 'ethPrice',
        },
        {
            label: <LanguageSwitcher/>,
            key: 'languageSwitch',
        },
    ];

    const navigate = useNavigate();
    const location = useLocation();
    const [current, setCurrent] = useState(location.pathname.replace('/', '') || 'zksync');

    const onClick = (e) => {
        if (e.key === 'languageSwitch' || e.key === 'ethPrice') {
            return;
        }

        setCurrent(e.key);
    };

    useEffect(() => {
        if (location.pathname.replace('/', '') === 'twitter' || location.pathname.replace('/', '') === 'github') {
            return;
        }
        setCurrent(location.pathname.replace('/', '') || 'zksync');
    }, [location.pathname]);

    useEffect(() => {
        if (current === 'twitter' || current === 'github') {
            return;
        }
        navigate(`/${current}`);
    }, [current]);

    return (
        <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            style={{
                display: 'flex',
                justifyContent: 'center'
            }}
            className="custom-menu"
            items={items}
        />
    );
};

export default MenuHeader;

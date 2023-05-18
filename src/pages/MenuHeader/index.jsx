import {Menu} from 'antd';
import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {GithubOutlined, TwitterOutlined} from "@ant-design/icons";

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
    {
        label: 'Mirror',
        key: 'mirror',
    },
    {
        label: 'Deposit',
        key: 'deposit',
    },
    {
        label: 'Coffee',
        key: 'coffee',
    },
    {
        label: <a href="https://github.com/wxtsky/MyWalletScan" target="_blank"
                  rel="noopener noreferrer"><GithubOutlined/></a>,
        key: 'github',
    },
    {
        label: <a href="https://twitter.com/jingluo0" target="_blank" rel="noopener noreferrer"><TwitterOutlined/></a>,
        key: 'twitter',
    }
];
const MenuHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [current, setCurrent] = useState(location.pathname.replace('/', '') || 'zksync');
    const onClick = (e) => {
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
        >
            {items.map(item =>
                <Menu.Item key={item.key}>
                    {item.label}
                </Menu.Item>
            )}
        </Menu>
    );

};
export default MenuHeader;

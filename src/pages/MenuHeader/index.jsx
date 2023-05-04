import {Menu} from 'antd';
import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";

const items = [
    {
        label: 'zkSync',
        key: 'zksync',
    },
    {
        label: 'StarkWare',
        key: 'stark',
    },
    {
        label: 'LayerZero',
        key: 'layer',
    }
];
const MenuHeader = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState('mail');
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === '/') {
            setCurrent('zksync')
        } else if (location.pathname === '/zksync') {
            setCurrent('zksync')
        } else if (location.pathname === '/stark') {
            setCurrent('stark')
        } else if (location.pathname === '/layer') {
            setCurrent('layer')
        }
    }, [location.pathname]);
    useEffect(() => {
        if (current === 'zksync') {
            navigate('/zksync');
        }
        if (current === 'stark') {
            navigate('/stark');
        }
        if (current === 'layer') {
            navigate('/layer');
        }
    }, [current]);
    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>;
};
export default MenuHeader;

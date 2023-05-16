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
    },
    {
        label: 'Mirror',
        key: 'mirror',
    },
    {
        label: 'Coffee',
        key: 'coffee',
    }
];
const MenuHeader = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState();
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
        } else if (location.pathname === '/mirror') {
            setCurrent('mirror')
        } else if (location.pathname === '/coffee') {
            setCurrent('coffee')
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
        if (current === 'mirror') {
            navigate('/mirror');
        }
        if (current === 'coffee') {
            navigate('/coffee');
        }
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

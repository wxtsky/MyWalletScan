import MenuHeader from "@pages/MenuHeader/index.jsx";
import Zksync from "@pages/Zksync/index.jsx";
import {useLocation} from "react-router-dom";
import Stark from "@pages/Stark/index.jsx";
import {useEffect, useState} from "react";
import {Layout, Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";

const {Footer} = Layout;
import MyFooter from "@components/MyFooter/index.jsx";

function MainPage() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    );
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [location.pathname]);
    return (
        <div>
            <Layout>
                <div style={{
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 1000,
                }}>
                    <MenuHeader/>
                </div>
                <div style={{paddingTop: '60px', paddingBottom: '60px'}}>
                    {loading ?
                        <Spin size="large" style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                              indicator={antIcon}
                        /> :
                        <div style={{minHeight: "80vh"}}>
                            {location.pathname === '/' && <Zksync/>}
                            {location.pathname === '/zksync' && <Zksync/>}
                            {location.pathname === '/stark' && <Stark/>}
                        </div>
                    }
                </div>
                <Footer
                    style={{
                        textAlign: 'center',
                        width: '100%',
                    }}
                >
                    <MyFooter/>
                </Footer>
            </Layout>
        </div>
    )
}

export default MainPage;

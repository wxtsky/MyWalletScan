import MenuHeader from "@pages/MenuHeader/index.jsx";
import Zksync from "@pages/Zksync/index.jsx";
import {useLocation} from "react-router-dom";
import Stark from "@pages/Stark/index.jsx";
import {Layout} from "antd";
import Layer from "@pages/Layer/index.jsx";
import Coffee from "@pages/Coffee/index.jsx";
import ZkInfo from "@pages/ZkInfo/index.jsx";
import StarkInfo from "@pages/StarkInfo/index.jsx";


function MainPage() {
    const location = useLocation()

    return (
        <div
            style={{
                backgroundColor: "#fff",
                minHeight: "100vh",
            }}
        >
            {/*<Notice message={"Stark功能已更新。"}/>*/}
            <Layout>
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        width: "100%",
                        zIndex: 1,
                    }}
                >
                    <MenuHeader
                        style={{
                            backgroundColor: "#fff",
                            borderBottom: "1px solid #e8e8e8",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                            zIndex: 3,
                        }}
                    />
                </div>
                <div
                    style={{
                        minHeight: "85vh",
                        backgroundColor: "#fff",
                        borderRadius: "4px",
                        marginTop: "42px",
                    }}
                >
                    <div>
                        {location.pathname === "/" && <Zksync/>}
                        {location.pathname === "/zksync" && <Zksync/>}
                        {location.pathname === '/zk_info' && <ZkInfo/>}
                        {location.pathname === "/stark" && <Stark/>}
                        {location.pathname === "/stark_info" && <StarkInfo/>}
                        {location.pathname === "/layer" && <Layer/>}
                        {location.pathname === "/coffee" && <Coffee/>}
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default MainPage;

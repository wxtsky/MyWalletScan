import MenuHeader from "@pages/MenuHeader/index.jsx";
import Zksync from "@pages/Zksync/index.jsx";
import {useLocation} from "react-router-dom";
import Stark from "@pages/Stark/index.jsx";
import {Layout, FloatButton} from "antd";
import Layer from "@pages/Layer/index.jsx";
import Mirror from "@pages/Mirror/index.jsx";
import Coffee from "@pages/Coffee/index.jsx";
import Deposit from "@pages/Deposit/index.jsx";
import Notice from "@components/Notice/index.jsx";

function MainPage() {
    const location = useLocation()
    return (
        <div
            style={{
                backgroundColor: "#f0f2f5",
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
                            backgroundColor: "#f0f2f5",
                            borderBottom: "1px solid #e8e8e8",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                        }}
                    />
                </div>
                <div
                    style={{
                        // paddingTop: "5px",
                        minHeight: "85vh",
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                        borderRadius: "4px",
                        marginTop: "45px",
                    }}
                >
                    <div>
                        {location.pathname === "/" && <Zksync/>}
                        {location.pathname === "/zksync" && <Zksync/>}
                        {location.pathname === "/stark" && <Stark/>}
                        {location.pathname === "/layer" && <Layer/>}
                        {location.pathname === "/mirror" && <Mirror/>}
                        {location.pathname === "/coffee" && <Coffee/>}
                        {location.pathname === "/deposit" && <Deposit/>}
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default MainPage;

import MenuHeader from "@pages/MenuHeader/index.jsx";
import Zksync from "@pages/Zksync/index.jsx";
import {useLocation} from "react-router-dom";
import Stark from "@pages/Stark/index.jsx";
import {Layout} from "antd";

const {Footer} = Layout;
import MyFooter from "@components/MyFooter/index.jsx";
import Layer from "@pages/Layer/index.jsx";
import Mirror from "@pages/Mirror/index.jsx";
import Coffee from "@pages/Coffee/index.jsx";

function MainPage() {
    const location = useLocation()
    return (
        <div
            style={{
                backgroundColor: "#f0f2f5",
                minHeight: "100vh",
            }}
        >
            <Layout>
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        width: "100%",
                        zIndex: 1000,
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
                        paddingTop: "25px",
                        minHeight: "95vh",
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                        borderRadius: "4px",
                        marginTop: "20px",
                    }}
                >
                    <div>
                        {location.pathname === "/" && <Zksync/>}
                        {location.pathname === "/zksync" && <Zksync/>}
                        {location.pathname === "/stark" && <Stark/>}
                        {location.pathname === "/layer" && <Layer/>}
                        {location.pathname === "/mirror" && <Mirror/>}
                        {location.pathname === "/coffee" && <Coffee/>}
                    </div>
                </div>
                <Footer
                    style={{
                        backgroundColor: "#f0f2f5",
                        textAlign: "center",
                        width: "100%",
                    }}
                >
                    <MyFooter/>
                </Footer>
            </Layout>
        </div>
    );
}

export default MainPage;

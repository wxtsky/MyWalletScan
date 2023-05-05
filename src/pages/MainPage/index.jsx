import MenuHeader from "@pages/MenuHeader/index.jsx";
import Zksync from "@pages/Zksync/index.jsx";
import {useLocation} from "react-router-dom";
import Stark from "@pages/Stark/index.jsx";
import {Layout, Spin, Tag} from "antd";
import {LoadingOutlined} from "@ant-design/icons";

const {Footer} = Layout;
import MyFooter from "@components/MyFooter/index.jsx";
import Layer from "@pages/Layer/index.jsx";

function MainPage() {
    const location = useLocation();
    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 50,
            }}
            spin
        />
    );

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
                    <Tag color={"red"}
                         style={{marginBottom: "10px"}}>
                        所有数据都存放在本地，不会上传到服务器，请放心使用，如果你喜欢这款工具，可以为我点赞吗，谢谢！
                    </Tag>
                    <div>
                        {location.pathname === "/" && <Zksync/>}
                        {location.pathname === "/zksync" && <Zksync/>}
                        {location.pathname === "/stark" && <Stark/>}
                        {location.pathname === "/layer" && <Layer/>}
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

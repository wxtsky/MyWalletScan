import MenuHeader from "@pages/MenuHeader/index.jsx";
import {Outlet} from "react-router-dom";
import {Layout} from "antd";


function MainPage() {
    return (
        <div
            style={{
                backgroundColor: "#fff",
                minHeight: "100vh",
            }}
        >
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
                        <Outlet/>
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default MainPage;

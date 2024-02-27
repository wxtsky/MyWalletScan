import MenuHeader from "@pages/MenuHeader/index.jsx";
import {Outlet} from "react-router-dom";
import {Layout, Modal} from "antd";
import {useEffect, useState} from "react";


function MainPage() {
    // const [isModalVisible, setIsModalVisible] = useState(false);
    //
    // useEffect(() => {
    //     // 假设您有某种方式检测到了新版本，可以将下面这行代码放到相应的逻辑中
    //     // 这里为了演示，我们直接在组件挂载后显示模态框
    //     setIsModalVisible(true);
    // }, []);
    //
    // const handleOk = () => {
    //     // 处理确认操作，比如跳转到新版本的链接
    //     window.location.href = 'https://addrtracker.xyz/';
    // };
    //
    // const handleCancel = () => {
    //     // 用户不想更新，关闭模态框
    //     setIsModalVisible(false);
    // };

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
            {/*<Modal*/}
            {/*    title="版本更新"*/}
            {/*    open={isModalVisible}*/}
            {/*    onOk={handleOk}*/}
            {/*    onCancel={handleCancel}*/}
            {/*    okText="前往"*/}
            {/*    cancelText="取消"*/}
            {/*>*/}
            {/*    <p>最新新版本</p>*/}
            {/*    <p>*/}
            {/*        https://addrtracker.xyz/*/}
            {/*    </p>*/}
            {/*</Modal>*/}
        </div>
    );
}

export default MainPage;

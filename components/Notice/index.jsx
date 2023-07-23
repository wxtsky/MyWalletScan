import {Modal} from "antd";
import {useEffect, useState} from "react";

const Notice = ({message}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        const modalStatus = localStorage.getItem('modalStatus');
        if (!modalStatus) {
            setModalIsOpen(true);
        }
    }, []);

    const handleOk = () => {
        localStorage.setItem('modalStatus', 'closed');
        setModalIsOpen(false);
    }

    const handleCancel = () => {
        localStorage.setItem('modalStatus', 'closed');
        setModalIsOpen(false);
    }

    return (
        <div>
            <Modal
                title="Notice"
                open={modalIsOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                style={{fontFamily: 'Arial, sans-serif', top: 20}}
                okText={"知道了，不再提示"}
            >
                <p>{message}</p>
            </Modal>
        </div>
    )
}
export default Notice;

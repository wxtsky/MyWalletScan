import {Modal} from "antd";
import {useEffect, useState} from "react";

const Notice = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    useEffect(() => {
        setModalIsOpen(true);
    }, []);
    return (
        <div>
            <Modal
                title="注意事项(2023-05-17)(24日关闭)"
                open={modalIsOpen}
                onOk={() => setModalIsOpen(false)}
                onCancel={() => setModalIsOpen(false)}
                style={{fontFamily: 'Arial, sans-serif', top: 20}}
                okText={"知道了"}
            >
                <h2 style={{color: '#333', marginBottom: '15px'}}>Hello,大家好，我是开发者北北</h2>
                <p style={{
                    color: '#666',
                    marginBottom: '10px'
                }}>开发这款工具的初衷是为了方便大家查看自己的钱包信息，一直秉持着免费开源的原则，希望大家喜欢。</p>
                <p style={{
                    color: '#666',
                    marginBottom: '10px'
                }}>一开始我开发这款工具的时候，是放到自己的国内服务器上供大家使用的，但是，由于政策相关原因，我不得不将他迁移到Github静态页面上。</p>
                <p style={{color: '#666', marginBottom: '10px'}}>为什么要这样做？</p>
                <ul>
                    <li style={{color: '#666', marginBottom: '10px'}}>1.
                        由于服务器和域名原因，每次大家都得输入地址才能访问，不方便。
                    </li>
                    <li style={{color: '#666', marginBottom: '10px'}}>2. 迁移到Github以后，大家可以直接通过域名访问。</li>
                    <li style={{color: '#666', marginBottom: '10px'}}>3.
                        迁移以后，这款工具依旧是永久免费和永久开源的。永远都不会收费。
                    </li>
                    <li style={{color: '#666', marginBottom: '10px'}}>4.
                        迁移以后，能够更快的访问网页，不会出现卡顿或者打不开网页的情况。
                    </li>
                </ul>
                <p style={{color: '#666', marginBottom: '10px'}}>迁移注意事项</p>
                <ul>
                    <li style={{color: '#666', marginBottom: '10px'}}>1.
                        迁移到新网站以后，原网站（http://150.158.27.95）将逐渐关闭（一周左右），您可以将数据迁移到新的网站。
                    </li>
                    <li style={{color: '#666', marginBottom: '10px'}}>2.
                        新的网站域名将永远不会改变，您以后可以放心使用。纯前端页面，不会收集任何信息。
                    </li>
                    <li style={{color: '#666', marginBottom: '10px'}}>3.
                        如果您正在使用旧网站，可以将数据手动迁移到新网站，如果您使用的是新网站，可以忽略这条信息。
                    </li>
                </ul>
                <p>新的网站链接：<a href={"https://bitboxtools.github.io"}>https://bitboxtools.github.io</a></p>
                <p>开源地址链接：<a
                    href={"https://github.com/wxtsky/MyWalletScan"}>https://github.com/wxtsky/MyWalletScan</a>
                </p>
            </Modal>
        </div>
    )
}
export default Notice;

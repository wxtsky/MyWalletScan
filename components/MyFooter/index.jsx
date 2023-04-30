import {Layout, Button} from 'antd';
import {GithubOutlined, TwitterOutlined} from '@ant-design/icons';

const {Footer} = Layout;
const MyFooter = () => {
    return (
        <Footer
            style={{
                textAlign: 'center',
            }}
        >
            <Button
                type="link"
                href="https://twitter.com/jingluo0"
                target="_blank"
                icon={<TwitterOutlined/>}
                size={"large"}
            />
            <Button
                type="link"
                href="https://github.com/wxtsky"
                target="_blank"
                icon={<GithubOutlined/>}
                size={"large"}
            />
        </Footer>
    )
}
export default MyFooter

import WrapperRouter from "@routes";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {ConfigProvider} from 'antd';
import en from "./locales/en";
import zh from "./locales/zh";
import {useEffect, useState} from "react";
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd/es/locale/en_US';

i18n.use(initReactI18next).init({
    resources: {
        en,
        zh,
    },
    lng: localStorage.getItem('i18nextLng') || "zh",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

function App() {
    const [locale, setLocale] = useState(i18n.language === 'zh' ? zhCN : enUS);
    useEffect(() => {
        const changeLanguage = lng => {
            setLocale(lng === 'zh' ? zhCN : enUS);
        };

        i18n.on('languageChanged', changeLanguage);

        return () => {
            i18n.off('languageChanged', changeLanguage);
        };
    }, []);
    return (
        <ConfigProvider locale={locale}>
            <div className="App">
                <WrapperRouter/>
            </div>
        </ConfigProvider>
    )
}

export default App;

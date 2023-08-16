import React, {Suspense} from "react";


import {Navigate, useRoutes} from "react-router-dom";
import StarkInfo from "@pages/StarkInfo/index.jsx";
import Linea from "@pages/Linea/index.jsx";

const Zksync = React.lazy(() => import("@pages/Zksync"));
const MainPage = React.lazy(() => import("@pages/MainPage"));
const Stark = React.lazy(() => import("@pages/Stark"));
const Layer = React.lazy(() => import("@pages/Layer"));
const Coffee = React.lazy(() => import("@pages/Coffee"));
const ZkInfo = React.lazy(() => import("@pages/ZkInfo"));
const Setting = React.lazy(() => import("@pages/Setting"));
const router = [
    {
        path: '/', element: <MainPage/>,
        children: [
            {
                path: '/zksync',
                element: <Zksync/>,
            },
            {
                path: '/zk_info',
                element: <ZkInfo/>
            },
            {
                path: '/stark',
                element: <Stark/>,
            },
            {
                path: '/stark_info',
                element: <StarkInfo/>
            },
            {
                path: '/linea',
                element: <Linea/>
            },
            {
                path: '/Layer',
                element: <Layer/>,
            },
            {
                path: '/coffee',
                element: <Coffee/>,
            },
            {
                path: '/setting',
                element: <Setting/>
            }
        ]
    },
    {path: "*", element: <Navigate to="/"/>},

];

const WrapperRouter = () => {
    let result = useRoutes(router);
    return (
        <Suspense>
            {result}
        </Suspense>
    );
};

export default WrapperRouter;

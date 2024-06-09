import { ReduxRouter } from "@lagunovsky/redux-react-router";
import React from "react";
import { Provider, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes } from "react-router";
import {type AdminReduxStore, buildAdminStore, useAdminReduxStore, useAdminSelector} from "./buildAdminStore";
import {  ProjectsList }                                          from "../pages/ProjectsPage";
import 'dayjs/locale/ru'
import ruRU from 'antd/locale/en_US'
import {
  connectionSaga,
  connectionSlice,
  SSEReadyStatesEnum,
} from "@common/mydux";
import "./admin.css";
import * as ReactDom from "react-dom/client";
import {ConfigProvider, Empty, Layout, Menu} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { withNavigate } from "../generic-ui/hooks/withNavigate";
import NiceModal from "@ebay/nice-modal-react";
import LoginForm from "./auth/LoginForm";
import AppLayout from "./AppLayout";
import {UsersComponents} from "../pages/UsersPage";
import { createEntityPages } from '../pages/core.tsx'
import { COMMENTS, ISSUES, TOPICS } from 'iso'
import { createGenericPagesForEntity } from '../generic-ui/createGenericPagesForEntity.tsx'
import QTrackPage                            from '../pages/qtrack/QTrackPage.tsx'

export const AdminApp = ({ store }: { store: AdminReduxStore }) => (
  <Provider store={store}>
    <NiceModal.Provider>
      <Preloader />
    </NiceModal.Provider>
  </Provider>
);

const Preloader = () => {

    const store = useAdminReduxStore();

    const connection = useAdminSelector(state => state.connection);

    let isInApp = ( connection.sseReadyState === SSEReadyStatesEnum.OPEN && connection.bootstraped )
    let isInitializing = connection.sseReadyState === SSEReadyStatesEnum.CONNECTING

    const isConnecting =  connection.sseReadyState === SSEReadyStatesEnum.CLOSED ||
        connection.sseReadyState === SSEReadyStatesEnum.INITIALIZING;
    console.log({ isInitializing,SSEReadyStatesEnum,connection,isInApp,  isConnecting });
    if(window.location.pathname!== '/auth' && !connection.error) {
        if ( isInitializing || isConnecting ) {
            return null
        }
        if ( connection.sseReadyState === SSEReadyStatesEnum.OPEN && !connection.bootstraped ) {
            return <div>Preloading</div>
        }
    }
    return (
            <ReduxRouter history={store.history}>    <div
                id="test-pro-layout"
                style={{
                    height: "100vh"
                }}
            >
                <ConfigProvider
                    theme={{
                        components: {
                            Form: {
                                marginLG: 4,
                                lineHeight: 2
                            },
                        },
                        token: {
                            borderRadius: 0,
                        }
                    }}


                    componentSize={'middle'}
                    locale={ruRU}
                    autoInsertSpaceInButton={true}
                    getTargetContainer={() => {
                        return document.getElementById('test-pro-layout') || document.body;
                    }}
                    renderEmpty={() => <Empty description={false}/>}
                >

                <Routes >
                    <Route index={true}  element={<div style={{color:'white'}}>Loading</div>}/>
                    <Route path={'/auth'} element={<LoginForm/>}/>
                    <Route path="/app" element={connection.error ? <Navigate to={"/auth"}/> : ((isInApp)? <AppLayout hidePageContainer={true} />: null)}>
                        <Route index={true}  element={<IssuesPages.ListPage />} />
                        <Route path={"issues"}  element={<QTrackPage />} />
                        <Route path={"income"} element={<CommentsPages.ListPage />} />
                        <Route path={"awaited"} element={<CommentsPages.ListPage />} />
                        <Route path={"comments"} element={<CommentsPages.ListPage />} />
                        <Route path="projects" element={<ProjectsList />} />
                        <Route path="projects/:projectId" element={<QTrackPage />} />
                        <Route path="users" element={<UsersComponents.ListPage />} />
                    </Route>
               </Routes>

                </ConfigProvider>
            </div>
            </ReduxRouter>
    )
}

const IssuesPages =createGenericPagesForEntity(ISSUES)
const CommentsPages = createGenericPagesForEntity(COMMENTS)
const TopicsPages = createGenericPagesForEntity(TOPICS)
const AdminLayout = () =>
    <Layout>
        <Sider breakpoint="lg" >
            <div className="demo-logo-vertical" />
            <MainMenu />
        </Sider>
        <Layout>
            <Content style={{ margin: '24px 16px 0' }}>
                <Outlet/>
            </Content>
        </Layout>
    </Layout>


const MainMenu = withNavigate( props =>
    <Menu
        style={{minHeight:'100vh'}}
        theme="dark"
        mode="vertical"
        defaultSelectedKeys={['/app']}
        items={[
            { label: "Upload", key: "/app/upload" },
            { label: "Users", key: "/app" },
            { label: "Genres", key: "/app/genres" },
            { label: "PlayLists/Tops", key: "/app/tops" },
            { label: "Artists", key: "/app/artists" },
            { label: "Albums", key: "/app/albums", disabled: true },
            { label: "Users", key: "/app/users" },
        ]}
        onClick={ e=> {props.navigate(e.key)}}
    />
)


const main = async () => {
  const store = await buildAdminStore();
  store.run(connectionSaga, "/api/sse/connect");
  ReactDom.createRoot(document.getElementById("root")!)
      .render(React.createElement(AdminApp, { store }));
};

export default main;
main()

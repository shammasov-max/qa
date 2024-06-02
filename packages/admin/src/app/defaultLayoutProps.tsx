import * as Icons from '@ant-design/icons';
import {AppstoreOutlined, BarChartOutlined, CalendarOutlined, ImportOutlined, MailOutlined} from '@ant-design/icons';
import React from 'react'
import {AntdIcons} from '../elements/AntdIcons'
import {Role} from "iso";


export default (role: Role) =>{

    return {
        route: {

            routes: [
                {
                    path: "/app/income",
                    name: "Спросили у меня",
                    icon: <MailOutlined />,
                },
                {
                    path: "/app/awaited",
                    name: "Жду ответа",
                    icon: <MailOutlined />,
                },

                {
                    path: "/app/issues",
                    name: "Вопросы",
                    icon: <MailOutlined />,
                },
                {
                    path: "/app/projects",
                    name: "Проекты",
                    icon: <CalendarOutlined />,
                },
                {
                    path: "/app/comments",
                    name: "Комментарии",
                    icon: <AntdIcons.AccountBookOutlined />,
                },
                {
                    path: "/app/dicts",
                    name: "Справочники",
                    icon: <AppstoreOutlined />,
                    routes: [

                    ]
                },
                {
                    path: "/app/users",
                    name: "Пользователи",
                    icon: <Icons.UserOutlined/>
                },

            ]

        },

        appList: [] as any[]
    }
}
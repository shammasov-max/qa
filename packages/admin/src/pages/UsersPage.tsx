import PanelRGrid from "../generic-ui/grid/PanelRGrid";
import { CellEditingStoppedEvent }                 from "ag-grid-community";
import { type AnyEntitySlice, USERS, type UserVO } from "iso";
import { useAdminSelector }                        from "../app/buildAdminStore.ts";

import { Button } from "antd";
import {entityModalFactory} from "../generic-ui/EntityModal";
import { useModal } from "@ebay/nice-modal-react";
import {createEntityPages} from "./core";
import { createGenericPagesForEntity } from '../generic-ui/createGenericPagesForEntity.tsx'
import { customCellRenderer } from '../generic-ui/grid/RCellRender.tsx'
import type { CustomCellEditorProps } from 'ag-grid-react'

export const UsersComponents  = createGenericPagesForEntity(USERS, (defaultColumns, columnsMap) => {
    return [...defaultColumns, {
        headerName: 'Войти',
        field: 'id',
        editable:false,

        cellRenderer: (props: CustomCellEditorProps) =>
             <a href={'/auth?email='+props.data.email+'&password='+props.data.password} target={'_blank'}>{window.location.host+'/auth?email='+props.data.email+'&password='+props.data.password}</a>

    }]
})

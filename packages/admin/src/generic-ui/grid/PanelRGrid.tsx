import { AgGridReact } from "ag-grid-react";
import RGrid, { RGridProps } from "./RGrid";
import { Button, Dropdown, Input, MenuProps, Space, Typography } from "antd";
import { useColumns } from "./RCol";
import { useDispatch } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import React, { ChangeEventHandler, useRef, useState } from "react";
import { AntdIcons }                                   from "../AntdIcons.tsx";
import DeleteButton                                    from "../buttons/DeleteButton";
import CancelButton from "../buttons/CancelButton";
import CreateButton from "../buttons/CreateButton";
import { RCellRender } from "./RCellRender";
import { GenericEntitySlice } from "@common/mydux";
import { useAdminSelector } from "../../app/buildAdminStore";
import type { ColDef } from "ag-grid-community";

const items: MenuProps["items"] = [
  {
    label: "Сохранить",
    icon: <AntdIcons.SaveFilled />,
    key: "save",
  },
  {
    type: "divider",
  },
  {
    label: "Удалить записи",
    icon: <AntdIcons.DeleteFilled />,
    key: "delete",
    danger: true,
  },
];

export type BottomGridApiBar = React.FC<{ag: AgGridReact}>
export  type PatchColumns <S extends GenericEntitySlice>  ={
    (defaultColumns: ColDef<S['exampleItem']>[], columnsMap:{[key in keyof S['exampleItem']]: ColDef}) : ColDef<S['exampleItem']>[]

}
export type PanelRGridProps<S extends GenericEntitySlice>= {
    onCreateClick: Function
    onEdit: Function
    toolbar?: React.ReactNode,
    bottomBar?:  React.ReactNode
    title: string
    patchColumns?: PatchColumns<S>
} & RGridProps<S>
export default  <S extends GenericEntitySlice>({
                                               title,
                                               bottomBar,toolbar,
                                               columnDefs,
                                               resource,
                                                   rowData,
patchColumns,
    onCreateClick,
    onEdit,
   ...props}: PanelRGridProps<S>) => {
    const dispatch = useDispatch()
    const [isDeleteMode, setDeleteMode,] = useState(false)
    const [defaultColumns, columnsMap] = useColumns(resource,isDeleteMode? 'multiple':undefined)
    const usedColumns = columnDefs || defaultColumns
    const [editColumn, ...restColumns] = usedColumns

    const firstCol = isDeleteMode ? columnsMap.checkboxCol:editColumn

    const resultCols =  [firstCol,...restColumns]
    const patchedColumns = patchColumns? patchColumns(resultCols,columnsMap) : resultCols
//resultCols.forEach(r => r.headerComponentParams = { template: '<b>YALLA</b>' },)
    const defaultList = useAdminSelector(resource.selectors.selectAll)
    const list = rowData || defaultList
    const [searchText, setSearchText] = useState('')

    const [selectedIds,setSelectedIds] = useState([])

    const onSearchTextChanged :ChangeEventHandler<HTMLInputElement> = e => {
        setSearchText(e.target.value)
    }

    const onMenuClick = (key) => {
        if(key ==='delete') {
            setDeleteMode(true)
            setSelectedIds([])
        }
    }

    const onDelete = () => {
        const action = resource.actions.removedMany(selectedIds)
        dispatch(action)
        setSelectedIds([])
        setDeleteMode(false)
    }

    const innerGridRef = useRef<AgGridReact>(null);

    const onSelectionChanged = () => {
        const rows = innerGridRef.current!.api.getSelectedRows()
        const ids = rows.map(r =>r.id)
        setSelectedIds(ids);
    }

    const renderDeleteModeToolBar = () => {
        return <>
                    <DeleteButton disabled={selectedIds.length === 0} onClick={onDelete}/>
                    <CancelButton onCancel={() => setDeleteMode(false)}/>

                </>
    }

    const renderStandartToolBar = () => {
        if(onCreateClick)
        return <>
            <CreateButton resource={resource} onCreate={onCreateClick} />
            <Dropdown menu={{
                items,onClick: e => {
                    onMenuClick(e.key)
                }}} >
                <Button icon={<AntdIcons.SettingOutlined/>} type={'text'}/>
            </Dropdown>
        </>
        return null
    }


    return      <> <div
        style={{
            height: '48px',
            boxShadow: '0 1px 4px rgba(0,21,41,.12)',
            padding: '0 10px 0 10px',
            width: '100%',
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center'
        }}
    >
        <h3 style={{whiteSpace:'nowrap'}}>{title}</h3>
        {
            toolbar
        }
        <div style={{display: 'flex'}}>
            <Space>
                <Input
                    style={{maxWidth: '250px', marginRight: '16px', lineHeight:'unset'}}
                    addonBefore={<SearchOutlined />} placeholder="Быстрый поиск"
                    allowClear
                    value={searchText}
                    onChange={onSearchTextChanged}
                />
                {
                    isDeleteMode ? renderDeleteModeToolBar(): renderStandartToolBar()
                }
            </Space>
        </div>
    </div>
        <RGrid onSelectionChanged={onSelectionChanged} onCellClicked={e => {
            if(e.colDef.cellRenderer=== RCellRender.ClickToEdit && onEdit) {
                onEdit(e.value)
            }
        }} rowSelection={isDeleteMode?'multiple':undefined} {...props}
               columnDefs={patchedColumns} rowData={list} resource={resource} quickFilterText={searchText} ref={innerGridRef}/>
        <div style={{paddingTop: '4px', display: 'flex', justifyContent:'space-between' }}>
            <Space>

                <Typography.Text>Всего записей: {list.length}</Typography.Text>

            </Space>

            <Space>

                {bottomBar
                /*    && innerGridRef.current && (isFunction( bottomBar) ? bottomBar({ag: innerGridRef.current}) : bottomBar)
                */}
            </Space>
        </div>
    </>
 }

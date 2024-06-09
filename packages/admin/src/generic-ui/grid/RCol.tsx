import { RCellRender } from "./RCellRender";

import {getEntityByTypeName, orm} from "iso";

import { useAdminState } from "../../app/buildAdminStore";
import { useDispatch } from "react-redux";
import {
  UploadImageCellEditor,
  UploadImageCellRenderer,
} from "./UploadImageCellEditor";

import { GenericEntitySlice, ItemByAttrs } from "@common/mydux";

import type {
  CellClassRules,
  ColDef,
  ValueSetterFunc,
} from "ag-grid-community";
import type { Resolve } from "@common/utils";
import type { CustomCellEditorProps } from "ag-grid-react";
import { Attachment }         from "./Attachmen";
import {DateInput}            from "./DateInput.tsx";
import {createReferenceInput} from "./ReferenceInput";

interface ICar {
  make: string;
  model: string;
  price: number;
  o: {
    a: number;
  };
}



export const useColumns = <
    E extends Resolve<GenericEntitySlice>, Attrs extends E['attributes'] = E['attributes']
>(res:E ,rowSelection:'single' | 'multiple'|undefined  = undefined)=> {
    type Item =E['exampleItem']

    type CommonColsMap = { clickToEditCol: ColDef<Item, string>, checkboxCol: ColDef }
    type ColsMap = CommonColsMap & {
        [K in keyof (Item | Attrs)]: ColDef<Item, Item[K]>
    }

    const dispatch = useDispatch()
    const state = useAdminState()

    const checkboxCol: ColDef<Item,string>= {
        checkboxSelection:true,
        field:'id',
        headerCheckboxSelectionFilteredOnly:true,
        headerCheckboxSelection:  true,
        width:30,
        resizable: false,
    }

    const clickToEditCol: ColDef<Item, string> = {
        headerName:'',
        field:'id',
        cellRenderer: rowSelection ? undefined : RCellRender.ClickToEdit,
        width:30,
        fieldName: 'id',
        resizable: false,
        resource: res,
    }

    const map: ColsMap = {clickToEditCol,checkboxCol} as any
    const storedColumn = <K extends keyof Attrs & keyof Item> (
        property: K
    ): ColDef<ItemByAttrs<Attrs>,ItemByAttrs<Attrs>[K]> => {
        const attr = res.attributes[property] as any as Attrs[K]
        const colInit :ColDef<Item, Item[K]>= {
            headerName: attr.headerName || attr.name,
            resizable: true,
            sortable: true,
            field: property,
            meta: attr,
            entity:res,
            fieldName:property,
            attr: attr,
            editable: !attr.immutable,
            resource: res,
            filter:true,
            width: 120,
            valueSetter: ((params) => {
                dispatch(res.actions.updated({id: params.data.id,changes:{[attr.name]: params.newValue}}))
            }) as ValueSetterFunc<E['exampleItem'],any>
        }
        if(attr.type === 'image') {
            colInit.cellEditor = UploadImageCellEditor
            colInit.cellRenderer = UploadImageCellRenderer
            colInit.cellEditorPopup=true
            colInit.cellEditorPopupPosition ='under'
        }
        if(attr.type === 'attachment'){
            colInit.cellEditor = Attachment.CellEditor
            colInit.cellRenderer = Attachment.CellRenderer
            colInit.cellEditorPopup=true
            colInit.cellEditorPopupPosition ='under'
        }
        if(attr.type === 'boolean') {
            colInit.cellDataType = 'boolean'
            colInit.width = 70
        }
        if(attr.type === 'datetime') {
            colInit.cellEditor =  DateInput,
            colInit.cellRenderer ='agDateStringCellRenderer'
            /**',* (props: CustomCellEditorProps<any, string>) => {

                return <DateInput value={props.value} readOnly={true}  onChange={props.onValueChange} />
            }*/
            colInit.cellEditorPopup=true

            colInit.cellEditorPopupPosition ='under'
        }
        if(attr.type === 'text') {
            colInit.cellEditor= 'agLargeTextCellEditor'
                colInit.cellEditorPopup= true
            colInit.width =200
        }
       if(attr.type === 'date') {
           function dateFormatter(params) {
               const value = params.data[property]
               var date = new Date(value);
               if(value)
                return `${date.getFullYear()}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getDate().toString().padStart(2,'0')}`;
               return undefined
           }
           colInit.cellDataType = 'dateString'
           colInit.valueFormatter = dateFormatter
           colInit.width = 100
           // colInit. = 'dateString'
        }
        if(attr.type === 'timestamp') {
            function dateFormatter(params) {
                const value = params.data[property]
                var date = new Date(value);
                if(value)
                    return `${date.getFullYear()}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getDate().toString().padStart(2,'0')}`;
                return undefined
            }
            colInit.editable = false
            colInit.cellDataType = 'dateString'
            colInit.valueFormatter = dateFormatter
            colInit.width = 100
            // colInit. = 'dateString'
        }
        if(attr.type==='list') {

            return {
                cellEditor: (props:CustomCellEditorProps)=>{

                }
            } as ColDef
        }
        if(attr.type==='listOf' || attr.type==='itemOf') {
            const RES = orm.entitiesMap[attr.refEID.toUpperCase()]

            const cellClassRules:CellClassRules<Item> = {}
            if(attr.required) {
                cellClassRules['grid-cell-required'] = params => params.data[params.colDef.field]=== undefined
            }

            return {
                ...colInit,
                cellClassRules,
                cellEditorPopup: true,
                cellRenderer:createReferenceInput(attr),
                cellEditor: createReferenceInput(attr),

               /* valueGetter: (params => {


                    const id = params.data[params.colDef.field]
                    try {
                        const it = RES.selectors.selectById(id)(state)
                        return RES.getItemName(it)
                    } catch (e){
                        console.error(e)
                        console.error(RES.EID+ 'id not found '+id, params,params.colDef.field)
                        return id ? 'Удалён '+id : 'Не указан'
                    }

                }) as ValueGetterFunc<Item, Item[K]>*/
            } as ColDef
        }
        return colInit
    }


    const columnsList = res.attributesList.filter((f,i)=> i!==0 && f.type!=='array' && f.colDef !== false).map((f) => {
       const col = storedColumn(f.name)
        const colComposed = f.colDef? {...col, ...f.colDef} : col

        map[f.name] = colComposed


        return colComposed
    })
    console.log('cplumnsList', columnsList)
    return [[map.clickToEditCol, ...columnsList], map] as const
  //  return res.properties

}


export type ResCol = {}

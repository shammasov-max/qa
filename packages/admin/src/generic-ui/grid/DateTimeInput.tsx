import {DatePicker} from "antd";
import dayjs from "dayjs";
import locale from "./locale.ru";
import type {CustomCellEditorProps} from "ag-grid-react";
export type DateTimeInput =  {
    readOnly?:boolean,
    onChange?:(value:string)=>void,
}

export const DateTimeInput = ({onChange,value,readOnly,onValueChange,stopEditing}:  CustomCellEditorProps<any, string> & DateTimeInput) => {
    const readOnlyProps = readOnly
        ? { inputReadOnly:Boolean(value), open:value ? false : undefined}
        :{}
    return <DatePicker

                   locale={locale} value={value === undefined? undefined: dayjs(value)}
                   onChange={ e => {
                       if(onChange)
                       onChange(e.toDate().toISOString())
                       if(onValueChange)
                       onValueChange(e.toDate().toISOString())
                       if(stopEditing)
                           stopEditing()
                   }}
        {...readOnlyProps}
    onOk={() => stopEditing()}/>


}
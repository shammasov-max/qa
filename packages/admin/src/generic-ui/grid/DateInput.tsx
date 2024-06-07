import {DatePicker} from "antd";
import dayjs from "dayjs";
import locale from "./locale.ru";
import type {CustomCellEditorProps} from "ag-grid-react";
export type DateInput =  {
    readOnly?:boolean,
    onChange?:(value:string)=>void,
}

export const DateInput = ({onChange,value,readOnly,onValueChange,stopEditing}: CustomCellEditorProps<any, string> & DateInput) => {
    const readOnlyProps = readOnly
        ? { inputReadOnly:Boolean(value), open:value ? false : undefined}
        :{}
    return <DatePicker
                   locale={locale} value={value === undefined? undefined: dayjs(value)}
                   onChange={ e => {
                       const value = e? e.toDate().toISOString(): undefined;
                       if(onChange)
                       onChange(value)
                       if(onValueChange)
                       onValueChange(value)
                       if(stopEditing)
                           stopEditing()
                   }}
        {...readOnlyProps}
    onOk={() => stopEditing()}/>


}

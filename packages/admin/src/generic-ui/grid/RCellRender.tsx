import React, { forwardRef } from "react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import Highlighter from "react-highlight-words";
import type { CustomCellEditorProps } from 'ag-grid-react'
import type { AnyEntitySlice }                          from 'iso'
import type { AnyAttributes, EntitySlice, ItemByAttrs } from '@shammasov/mydux'

type RCellRenderProps<D = any, V = any> = {
  data: D;
  value: V;
  colDef: ColDef<D, V>;
  onClick: Function;
};

export const customCellRenderer = <TData = any, TValue = any, TContext = any>
( Component: React.Component<CustomCellEditorProps<TData, TValue,TContext>>) =>
        (props: CustomCellEditorProps<TData, TValue,TContext>) =>
            <Component {...props} />

export const customEntityCellRenderer = <I, K extends keyof I
> (entitySlice: {exampleItem: I}, propName: K) =>
    ( Component: React.Component<CustomCellEditorProps<I, I[K]>>) =>
        (props: CustomCellEditorProps<I, I[K]>) =>
            <Component {...props} />


export const RCellRender = {
    ClickToEdit: <D,V>({onClick, ...props}:RCellRenderProps<D,V>) => {

            return (
                <Link onClick={onClick}>
                    <EditOutlined  />
                </Link>

            )
    },
    DefaultCellRenderer:  forwardRef((props: ICellRendererParams, ref) => {
        const search = props.api.getQuickFilter()
        if(props.valueFormatted)
            return  props.valueFormatted
        const text =  props.value
        return  <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={search ? search.split(' '):[]}
            autoEscape={true}
            textToHighlight={text ? text : ''}
        />
    })
}

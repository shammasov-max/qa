import React, { forwardRef } from "react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import Highlighter from "react-highlight-words";

type RCellRenderProps<D = any, V = any> = {
  data: D;
  value: V;
  colDef: ColDef<D, V>;
  onClick: Function;
};

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

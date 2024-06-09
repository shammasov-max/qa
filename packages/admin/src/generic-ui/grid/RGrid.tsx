import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
//import './GODJ-theme.css'
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import React, { useMemo } from "react";
import AG_GEID_LOCALE_RU from "./locale.ru";

import "../../app/rengin-theme.css";

import "../../app/admin.css";
import { ItemByEntity } from "iso";
import { RCellRender } from "./RCellRender";
import { GenericEntitySlice } from "@common/mydux";

export type RGridProps<S extends GenericEntitySlice> = AgGridReactProps<
  ItemByEntity<S>
> & {
  resource: S;
  search?: string;
  fullHeight?: boolean;
};

const checkBoxColProps = {
    headerCheckboxSelection: true,
    checkboxSelection: true,
}
export default React.forwardRef( <S extends GenericEntitySlice>({columnDefs , fullHeight,...props}: RGridProps<S>, ref:React.ForwardedRef<any>) => {

   /* const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current!.api.setQuickFilter(
            (document.getElementById('filter-text-box') as HTMLInputElement).value
        );
    }, []);*/
        const localeText = useMemo<{
                [key: string]: string;
            }>(() => {
                return AG_GEID_LOCALE_RU;
            }, []);

         console.log(columnDefs)

        return <> <div className="ag-theme-alpine" style={{height: fullHeight ?  'calc(100vh - 144px)':'calc(100vh - 244px)', width: '100%'}}>
                    <AgGridReact<ItemByEntity<S>>
                        ref={ref}
                        localeText={localeText}
                        columnDefs={columnDefs}
reactiveCustomComponents={true}
                        defaultColDef={{resizable: true,sortable:true,editable:true,cellRenderer:RCellRender.DefaultCellRenderer}}
                        enableRangeSelection={true}

                        {...props}
                    >

                    </AgGridReact>
                </div>

            </>


}, )

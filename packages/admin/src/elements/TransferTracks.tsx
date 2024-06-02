import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../app/rengin-theme.css";
import React, { useCallback, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  RowDragEndEvent,
} from "ag-grid-community";
import { Issues } from "iso";
import { useColumns } from "../generic-ui/grid/RCol.ts";
import { Col, Row } from "antd";
import { equals } from "ramda";
import { useAdminSelector } from "../app/buildAdminStore.ts";

export type TransferTracksProps = {
  selectedTrackIds: string[];
  setSelectedTrackIds: (list: string[]) => any;
};


export const TransferTracks = ({selectedTrackIds = [], setSelectedTrackIds = console.log}: TransferTracksProps) => {
    const allTracks = useAdminSelector(Issues.selectors.selectAll)
    const allTracksMap = useAdminSelector(Issues.selectors.selectEntities)
    const selectedTracks =allTracks.filter(t => selectedTrackIds.includes(t.id))
    const restTracks = allTracks.filter(t => !selectedTrackIds.includes(t.id))
    const [cols, mapCols] = useColumns(Issues)
    const [leftApi, setLeftApi] = useState<GridApi | null>(null);
    const [rightApi, setRightApi] = useState<GridApi | null>(null);
    const [rawData, setRawData] = useState<any[]>(allTracks);
    const [leftRowData, setLeftRowData] = useState<any[] | null>(restTracks);
    const [rightRowData, setRightRowData] = useState<any[]>(selectedTracks);
    console.log("left", leftRowData);

    console.log("right", rightRowData);
    const RemoveRenderer = (props: ICellRendererParams) => {
        return (
            <i
                className="far fa-trash-alt"
                style={{ cursor: "pointer" }}
                onClick={() => {
                    props.api.applyTransaction({ remove: [props.node.data] });
                }}
            ></i>
        );
    };
    const [leftColumns] = useState([
        {
            rowDrag: true,
            maxWidth: 50,
            suppressMenu: true,
            rowDragText: (params, dragItemCount) => {
                if (dragItemCount > 1) {
                    return dragItemCount + " tracks";
                }
                return params.rowNode!.data.title;
            },
        },
        { field: "title" },
        { field: "artist" },
    ] as ColDef[]);

    const [rightColumns] = useState([
        {
            headerName: "#",
            rowDrag: true,
            pinned: "left",
            maxWidth: 80,
            valueGetter: "node.rowIndex+1",
        },
        { field: "title" },
        { field: "artist" },
    ] as ColDef[]);



    const getRowId = (params: GetRowIdParams) => params.data.id;

    const onDragStopRight = useCallback(
        (params: RowDragEndEvent) => {
            var nodes = params.nodes;
            leftApi!.applyTransactionAsync(
                {
                    remove: nodes.map(function (node) {
                        return node.data;
                    }),
                },
                () => {
                    leftApi?.refreshCells();
                    console.log("DtagStop compleled");
                }
            );
        },
        [leftApi]
    );

    const onDragStopLeft = useCallback(
        (params: RowDragEndEvent) => {
            var nodes = params.nodes;
            rightApi!.applyTransactionAsync(
                {
                    remove: nodes.map(function (node) {
                        return node.data;
                    }),
                },
                () => {
                    rightApi?.refreshCells();
                    console.log("DtagStop compleled");
                }
            );
        },
        [rightApi]
    );
    useEffect(() => {
        if (!leftApi || !rightApi) {
            return;
        }
        const dropZoneParams = rightApi.getRowDropZoneParams({
            onDragStop: onDragStopRight,
        });
        leftApi.removeRowDropZone(dropZoneParams);
        leftApi.addRowDropZone(dropZoneParams);
        const dropZoneParamsLeft = leftApi.getRowDropZoneParams({
            onDragStop: onDragStopLeft,
        });
        rightApi.removeRowDropZone(dropZoneParamsLeft);
        rightApi.addRowDropZone(dropZoneParamsLeft);
    }, [leftApi, rightApi, onDragStopRight, onDragStopLeft]);

    const onGridReady = (params: GridReadyEvent, side: number) => {
        if (side === 0) {
            setLeftApi(params.api);
        }
        if (side === 1) {
            setRightApi(params.api);
        }

    };

    useEffect(() => {
        if(leftApi && rightApi) {

        }
    }, [leftApi, rightApi]);

    const getGridWrapper = (id: number) => (
        <div className="panel panel-primary" style={{ marginRight: "10px" }}>
            <div className="panel-heading">
                {id === 0
                    ? `Все треки ${leftRowData?.length}`
                    : `Треки в списке ${rightRowData?.length}`}
            </div>
            <div className=" ag-theme-alpine" style={{ height: "500px" }}>
                <AgGridReact

                    getRowId={getRowId}
                    rowDragManaged={true}
                    rowSelection={"multiple"}
                    rowDragMultiRow={true}
                    onRowDataUpdated={handleChange}
                    onRowDragEnd={handleChange}
                    onDragStopped={handleChange}
                    suppressMoveWhenRowDragging={false}
                    rowData={id === 0 ? leftRowData : rightRowData}
                    columnDefs={id === 0 ? leftColumns : rightColumns}
                    onGridReady={(params) => onGridReady(params, id)}
                />
            </div>
        </div>
    );

    const getSelectedTrackIdsByApi = ()=>{
        const trackIds = [] as string[];
        rightApi?.forEachNode((node, index) => {
            trackIds[index] = node.data.id;
        });
        return trackIds
    }
    const handleChange = (event) => {
        const newIds =getSelectedTrackIdsByApi()
        if(leftApi && rightApi && !equals(newIds, selectedTrackIds)) {
            if (leftApi)
                leftApi!.refreshCells()
            if (rightApi)
                rightApi!.refreshCells()
            setLeftRowData(allTracks.filter(t => !newIds.includes(t.id)))
            setRightRowData(allTracks.filter(t => newIds.includes(t.id)))
            setSelectedTrackIds(newIds)
        }
    }


    return (

            <Row>
                <Col span={12}> {getGridWrapper(0)}</Col>
                <Col span={12}> {getGridWrapper(1)}</Col>
            </Row>



    );
};

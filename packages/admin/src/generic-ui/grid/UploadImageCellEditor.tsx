import { ICellEditorParams, ICellRendererParams } from "ag-grid-community";
import { ICellEditorReactComp } from "ag-grid-react";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./typing.d.ts";
import { Card, Image, Upload, UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd/es/upload";
import { useClickAway } from "react-use";

// backspace starts the editor on Windows
const KEY_BACKSPACE = 'Backspace';

export interface MySimpleInterface extends ICellEditorReactComp {
    myCustomFunction(): { rowIndex: number; colId: string };
}

export const UploadImageCellEditor = forwardRef((props: ICellEditorParams, ref) => {

    const getInitialValue = (props: ICellEditorParams) => {
        let startValue = props.value;

        const eventKey = props.eventKey;
        const isBackspace = eventKey === KEY_BACKSPACE;

        if (isBackspace) {
            startValue = '';
        } else if (eventKey && eventKey.length === 1) {
            startValue = eventKey;
        }

        if (startValue !== null && startValue !== undefined) {
            return startValue;
        }

        return '';
    };

     const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: '-1',
            name: props.colDef.resource.langRU.singular+'_'+props.data.id+'_'+props.colDef.attr.name,
            status: 'done',
            url: getInitialValue(props),
        }]);
    const refInput = useRef<HTMLInputElement>(null);

    const cardRef = useRef<HTMLInputElement>(null);
    const value = fileList[0]? fileList[0].url: undefined;
    const setValue = (value: string) => setFileList([{...fileList[0], url: value}])
    useEffect(() => {
      //  refInput.current!.focus();
    }, []);

    const handleChange: UploadProps['onChange'] =  (info) => {
        let newFileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        newFileList = newFileList.slice(-2);

        // 2. Read from response and show file link
        newFileList = newFileList.map((file) => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });

        setFileList(newFileList);
    };
    useImperativeHandle(ref, () => {
        return {
            getValue() {
                return fileList[0]?fileList[0].url: undefined;
            },

            myCustomFunction() {
                return {
                    rowIndex: props.rowIndex,
                    colId: props.column.getId(),
                };
            },
        };
    });
useClickAway(cardRef, () => props.stopEditing())
    return (<Card
                ref={cardRef}

            >
                <Upload listType={'picture-card'} action={'/api/upload-image'}  onChange={handleChange} fileList={fileList} maxCount={1} multiple={false} >

                        <UploadOutlined />

                </Upload>

        </Card>

    );
});

export const UploadImageCellRenderer = (props: ICellRendererParams) => {

    return <Image width="20px" src={props.value} />;
};

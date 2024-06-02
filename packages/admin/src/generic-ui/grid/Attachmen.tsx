import type {
  CustomCellEditorProps,
  CustomCellRendererProps,
} from "ag-grid-react";
import { Button, message, Upload, type UploadProps } from "antd";
import { generateGuid } from "@shammasov/utils";
import { UploadOutlined } from "@ant-design/icons";

export const Attachment = {
  CellEditor: (props: CustomCellEditorProps<any, string>) => {
    const onRemove = () => {
      props.onValueChange(undefined);
    };
    const guid = generateGuid();
    const uploadProps: UploadProps = {
      name: "file",
      action: "/api/upload-file?path=" + encodeURIComponent(`/hq/${guid}`),
      type: "select",

      maxCount: 1,
      onRemove: onRemove,
      onChange(info) {
        if (info.file.status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
          const url = info.file.response.url;

          message.success(`HQ файл ${info.file.name} загружен успешно ` + url);
          props.onValueChange(info.file.response.url);
          props.stopEditing();
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    );
  },
  CellRenderer: (props: CustomCellRendererProps) => {
    return props.value ? (
      <a download={true} href={props.value} style={{ color: "blue" }}>
        {props.value}
      </a>
    ) : (
      "-"
    );
  },
};

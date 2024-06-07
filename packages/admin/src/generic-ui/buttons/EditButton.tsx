import { Button } from "antd";
import { GenericEntitySlice } from "@shammasov/mydux";
import {AntdIcons}            from "../AntdIcons.tsx";

export default ({
                    onEdit,
                    resource,
                }: {
    onEdit: Function;
    resource: GenericEntitySlice;
}) => {
    return (
        <Button
            type={"link"}
            icon={<AntdIcons.EditOutlined />}
            onClick={onEdit}
        >
            {resource ? "Редактировать " + resource.langRU.singular : null}
        </Button>
    );
};

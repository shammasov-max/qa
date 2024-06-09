import { Button, type ButtonProps } from 'antd'
import { GenericEntitySlice }       from "@common/mydux";
import {AntdIcons}            from "../AntdIcons.tsx";

export default ({
                    onEdit,
                    resource,
    ...props
                }: {
    onEdit: Function;
    resource: GenericEntitySlice;
} & ButtonProps) => {
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

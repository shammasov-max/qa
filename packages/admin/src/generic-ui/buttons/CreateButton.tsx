import { Button } from "antd";
import { GenericEntitySlice } from "@common/mydux";
import {AntdIcons}            from "../AntdIcons.tsx";

export default ({
  onCreate,
  resource,
}: {
  onCreate: Function;
  resource: GenericEntitySlice;
}) => {
  return (
    <Button
      type={"primary"}
      icon={<AntdIcons.PlusOutlined />}
      onClick={onCreate}
    >
      {resource ? "Новый " + resource.langRU.singular : null}
    </Button>
  );
};

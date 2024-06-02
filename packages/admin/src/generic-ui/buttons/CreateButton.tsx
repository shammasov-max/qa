import { Button } from "antd";
import { GenericEntitySlice } from "@shammasov/mydux";
import {AntdIcons} from "../../elements/AntdIcons";

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

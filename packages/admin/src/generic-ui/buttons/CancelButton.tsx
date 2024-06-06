
import { Button } from "antd";
import React       from "react";
import {AntdIcons} from "../AntdIcons.tsx";

export default ({ onCancel }: { onCancel: Function }) => {
  return (
    <Button icon={<AntdIcons.CloseOutlined />} onClick={onCancel as any}>
      Отмена
    </Button>
  );
};

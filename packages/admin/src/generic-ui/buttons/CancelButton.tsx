
import { Button } from "antd";
import React from "react";
import {AntdIcons} from "../../elements/AntdIcons";

export default ({ onCancel }: { onCancel: Function }) => {
  return (
    <Button icon={<AntdIcons.CloseOutlined />} onClick={onCancel as any}>
      Отмена
    </Button>
  );
};

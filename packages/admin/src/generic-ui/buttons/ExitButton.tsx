import { Button } from "antd";
import React         from "react";
import { AntdIcons } from "../AntdIcons.tsx";

export default ({ onExit }: { onExit?: Function }) => {
  return (
    <Button
      danger
      type="text"
      icon={<AntdIcons.LogoutOutlined />}
      onClick={onExit}
    >
      Выйти
    </Button>
  );
};

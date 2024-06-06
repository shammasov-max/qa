import { FloatButton, FloatButtonProps } from "antd";
import {AntdIcons}                       from "../AntdIcons.tsx";

export default (props: FloatButtonProps) => {
  return (
    <FloatButton
      shape="circle"
      icon={<AntdIcons.PlusCircleTwoTone />}
      onClick={props.onClick}
      style={{ right: 24 + 70 + 70 }}
    />
  );
};

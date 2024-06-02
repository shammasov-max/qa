import { Button, ButtonProps, Popconfirm } from "antd";
import { AntdIcons } from "../../elements/AntdIcons";

export default ({ onClick, ...props }: ButtonProps) => {
  return (
    <Popconfirm
      title="Удаление"
      description="Вы уверениы что хотите удалить записи?"
      okText="Удалить"
      cancelText="Отмена"
      onConfirm={onClick}
    >
      <Button danger={true} icon={<AntdIcons.DeleteFilled />} {...props}>
        Удалить
      </Button>
    </Popconfirm>
  );
};

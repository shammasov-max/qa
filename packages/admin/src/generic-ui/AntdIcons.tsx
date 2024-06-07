import * as AntdIcons from '@ant-design/icons'
import Icon           from 'antd/es/icon'

export {
    AntdIcons
}


export const IconText = ({ Icon, text }) => (
    <span>
    <Icon style={{ marginRight: 8 }} />
        {text}
  </span>
);

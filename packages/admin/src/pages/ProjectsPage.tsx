import { type AnyEntitySlice, PROJECTS, type ProjectVO } from 'iso'
import { createGenericPagesForEntity }                   from '../generic-ui/createGenericPagesForEntity.tsx'
import { entityModalFactory }            from '../generic-ui/EntityModal.tsx'
import { useAdminSelector }              from '../app/buildAdminStore.ts'
import { useModal }                                    from '@ebay/nice-modal-react'
import { Avatar, List, Row, Space, Typography }        from 'antd'
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons'
import CreateButton            from '../generic-ui/buttons/CreateButton.tsx'
import { AntdIcons, IconText } from '../generic-ui/AntdIcons.tsx'
import DeleteButton                                      from '../generic-ui/buttons/DeleteButton.tsx'
import { useDispatch }                                   from 'react-redux'
import EditButton                                        from '../generic-ui/buttons/EditButton.tsx'
import UsersGroup                                        from '../elements/UsersGroup.tsx'
Typography
const Text = Typography.Text;
export const ProjectModal = entityModalFactory(PROJECTS);
export const ProjectsList = () => {


    const list: ProjectVO = useAdminSelector(PROJECTS.selectors.selectAll);

    type E = AnyEntitySlice;

    const itemModal = useModal(ProjectModal);

    const onItemAdd = async () => {
        const item: E["exampleItem"] = await itemModal.show({
            id: 'new',//undefined as any as E["exampleItem"],
            formId: "entityFormId",
        });

    };


    return    <div><Row justify={'end'}><CreateButton resource={PROJECTS} onCreate={onItemAdd}/></Row> <List
        className="demo-loadmore-list"

       pagination={{}}
        dataSource={list}
        itemLayout="vertical"
        size="large"
        renderItem={ item => (
<ProjectListItem item={item}/>
        )}
    />
    </div>
}


export const ProjectListItem = ({item}:{item: ProjectVO}) => {

    const dispatch = useDispatch();
    const itemModal = useModal(ProjectModal);
    const onItemEdit = async (itemId: string) => {
        const item: E["exampleItem"] = await itemModal.show({
            id: itemId,
            formId: "entityFormId",
        });
    };

    return <List.Item

        extra={
            <Space direction={'vertical'} style={{alignItems:'end'}}>
                <Space>
                    <EditButton onEdit={() => onItemEdit(item.id)}/>
                    <DeleteButton onClick={() => dispatch(PROJECTS.actions.removed(item.id))}/>
                </Space>
                <img
                    width={272}
                    alt="logo"
                    src={item.image}
                />
            </Space>

        }
        actions={[
            <IconText Icon={AntdIcons.StarOutlined} text="156" key="list-vertical-star-o" />,
            <IconText Icon={AntdIcons.LikeOutlined} text="156" key="list-vertical-like-o" />,
            <IconText Icon={AntdIcons.MessageOutlined} text="2" key="list-vertical-message" />,
        ]}
    >

        <List.Item.Meta
            avatar={<UsersGroup ids={item.usersIds} />}
            title={<Text underline> <a href={'/app/projects/'+item.id}>{item.name}</a></Text>}
            description={item.description}
        />


    </List.Item>
}

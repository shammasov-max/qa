import { List, Space, Table }       from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { type AnyEntitySlice, ISSUES, type IssueVO, PROJECTS, type ProjectVO } from 'iso'
import EditButton                                                              from '../../generic-ui/buttons/EditButton.tsx'
import DeleteButton                                              from '../../generic-ui/buttons/DeleteButton.tsx'
import CreateButton                                              from '../../generic-ui/buttons/CreateButton.tsx'
import { entityModalFactory }                                    from '../../generic-ui/EntityModal.tsx'
import { useAdminSelector }                                      from '../../app/buildAdminStore.ts'
import { useModal }                                              from '@ebay/nice-modal-react'


import {  Divider, Tag } from 'antd';
import { UserPic }       from '../../elements/UsersGroup.tsx'
import useCurrentUser    from '../../hooks/useCurrentUser.ts'
import { useParams }     from 'react-router'
import { ProjectListItem } from '../ProjectsPage.tsx'
import IssueThread from './IssueThread.tsx'
export default () => {
    const {projectId} = useParams<{projectId?: string}>()
const dispatch = useDispatch()
    const ItemModal = entityModalFactory(ISSUES);
const projectsList  = useSelector(PROJECTS.selectors.selectAll);
    const projectsMap = useSelector(PROJECTS.selectors.selectAsMap);
    const list: IssueVO[] = useAdminSelector(ISSUES.selectors.selectAll);
    const issuesList = projectId ? list.filter(item => item.projectId === projectId): list
const currentUser = useCurrentUser()

    const itemModal = useModal(ItemModal);

    const onItemAdd = async () => {
        const item: IssueVO = await itemModal.show({
            id: 'new',//undefined as any as E["exampleItem"],
            formId: "entityFormId",
            defaultProps: {
                reporterUserId: currentUser.id,
            }
        });

    };
    const onItemEdit = async (itemId: string) => {
        const item:IssueVO = await itemModal.show({
            id: itemId,
            formId: "entityFormId",
        });
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'name',
            width: 60,
            render: (id, record) => <span style={{minWidth:'40px'}}># {data.indexOf(record) + 1}</span>,
        },
        {
            title: 'Проект',
            dataIndex: 'projectId',
            width: 140,
            key: 'projectId',
            render: (projectId, record) => <a href={'/app/projects'+projectId}>{projectsMap[projectId].name}</a>,
        },
        {
            title: 'Вопроситель',
            dataIndex: 'reporterUserId',
            key: 'reporterUserId',
            render: (userId, record) => <UserPic userId={userId}/>,
        },
        {
            title: 'Вопрос',
            dataIndex: 'description',
            key: 'description',
            render: (description, record) => <span>{description}</span>
        },
        {
            title: 'Ответственный',
            dataIndex: 'assigneeUserId',
            key: 'assigneeUserId',
            render: (userId, record) => <UserPic userId={userId}/>,
        },
        {
            title: 'Статус',
            key: 'status',
            dataIndex: 'status',
            render: (status,record) =>


                <Tag color={'blue'} key={status}>
                    {status}
                </Tag>


            ,
        },
        {
            title: 'Опции',
            key: 'id',
            render: (text, item) => (
                <Space>
                    <EditButton onEdit={() => onItemEdit(item.id)} disabled={currentUser!=='Сотрудник'}/>
                    <DeleteButton onClick={() => dispatch(ISSUES.actions.removed(item.id))} disabled={currentUser!=='Сотрудник'}/>
                </Space>
            ),
        },
    ];

    const data = issuesList.map(item => ({
       ...item,
        key: item.id,
    }));

    return (
        <div>
            {
                projectId
                ? <List
                    className="demo-loadmore-list"

                    pagination={{}}
                    dataSource={[projectId]}
                    itemLayout="vertical"
                    size="large"
                    renderItem={ item => {

                     return    <ProjectListItem item={projectsMap[projectId]} />
                    }
                }/> : null
            }

        <Space direction={'vertical'} style={{alignItems:'end'}} >

            <CreateButton onCreate={onItemAdd} resource={ISSUES} />
        </Space>
        <Table columns={columns} dataSource={data}    expandedRowRender={record => <IssueThread issueId={record.id}/> }/>
    </div>
    )
}

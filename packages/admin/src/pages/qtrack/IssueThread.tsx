import { Comment }                                                                   from '@ant-design/compatible'
import { Avatar, Button, Form, List, message, Radio, Row, Tag, Tooltip, Typography } from 'antd'
import { useAdminSelector }                                                          from '../../app/buildAdminStore.ts'
import { COMMENTS, ISSUES, statuses, USERS } from 'iso'
import { UserPic }                           from '../../elements/UsersGroup.tsx'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import TextArea from 'antd/es/input/TextArea'
import { useState } from 'react'
import useCurrentUser                         from '../../hooks/useCurrentUser.ts'
import { AntdIcons }                                                     from '../../generic-ui/AntdIcons.tsx'


export default ({issueId}:{issueId: string}) => {
    return <MessagesList issueId={issueId}/>
}
const Editor = ({ onChange, onSubmit, value }) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit"  onClick={onSubmit} type="primary">
                Add Comment
            </Button>
        </Form.Item>
    </div>
);

const MessagesList = ({issueId}:{issueId: string}) => {
    const issue = useAdminSelector(ISSUES.selectors.selectById(issueId));
    const comments = useAdminSelector(COMMENTS.selectors.selectEq({issueId}));
    const usersList = useAdminSelector(USERS.selectors.selectAll);
    const dispatch = useDispatch()
    const [value, setValue] = useState('');
    const onAssign = (userId) => () => {
        dispatch(ISSUES.actions.updated({id: issueId, changes: {assigneeUserId: userId}}))
    }
    const onStatus = (status) => {
        dispatch(ISSUES.actions.updated({id: issueId, changes: {status}}))
    }
    const onPriority = (status) => {
        dispatch(ISSUES.actions.updated({id: issueId, changes: {status}}))
    }

    const onComment = () => {
        dispatch(COMMENTS.actions.added({issueId: issueId, text: value,authorId: issue.reporterUserId,
            createdAt: new Date().toISOString()}))
        message.success(`Комментарий добавлен`);
        setValue('')
    }



    const user = useCurrentUser()
    const response = (issue.assigneeUserId === user.userId || issue.reporterUserId === user.userId || user.role !== 'Сотрудник')
        ? <Editor
                         onChange={(e) => setValue(e.target.value)}
                         onSubmit={() => {onComment()}}

                         value={value}
                     />
                     : <div><Typography.Text> Вопрос адресован не вам</Typography.Text></div>
    const usersMap = useAdminSelector(USERS.selectors.selectAsMap);
   return <List
       footer={['Закрыт','Отменён'].includes(issue.status) ? <div>Обсуждение закрыто</div> :

               response

       }

        className="comment-list"
        header={<Row style={{justifyContent:'space-between'}}><span>{comments? comments.length : 0} ответов</span>
            <Radio.Group value={issue.status} onChange={e=>onStatus(e.target.value)}>
                {statuses.map((s) => <Radio.Button key={s} value={s}>{s}</Radio.Button>)}
            </Radio.Group></Row>
   }
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={comment => {
            const user = usersMap[comment.authorId];
            const actions =[
                issue.assigneeUserId === comment.authorId
                ? <Tag color={'#f50'}>Ответственный</Tag> :
                <Button type="primary" size="small" icon={<AntdIcons.CloudDownloadOutlined/>} onClick={onAssign(comment.authorId)}>Назначить</Button>,
                issue.reporterUserId === comment.authorId ?
                <Tag color={'green'}>Автор</Tag> : null
                ].filter(a => a !==null)

            return  <li>
                <Comment
                    actions={actions}
                    author={user? user.name : <div>Пользователь не найден</div>}
                    avatar={<UserPic userId={user.id}/>}
                    content={comment.text}
                    datetime={
                            <span>
                              {moment(comment.createdAt).fromNow()}
                            </span>

                    }
                />
            </li>
        }}
    />
}

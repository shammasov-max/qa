import { Avatar }                                   from 'antd'
import { getGravatarTextColor, USERS, type UserVO } from 'iso'
import { head }                                     from 'ramda'
import { useAdminSelector }   from '../app/buildAdminStore.ts'

export const UserPic = (  (props: {userId:string}) =>
{
    const user = useAdminSelector(USERS.selectors.selectById(props.userId))
  return  user ? <Avatar
            style={{backgroundColor: user.color, color: getGravatarTextColor(user.color)}}
            size={"large"}
    >{user.name.split (' ').map (head)}</Avatar> : null
}
)

export default ({ids}: {ids: string[]}) => {
    return <Avatar.Group  max={{
        count: 2,
        style: { color: '#f56a00', backgroundColor: '#fde3cf' },
    }}>
        {ids ? ids.map(id => <UserPic userId={id}/>) : null}
    </Avatar.Group>

}

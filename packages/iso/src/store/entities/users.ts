import chroma from "chroma-js";
import { AttrFactory, createEntitySlice } from "@shammasov/mydux";
import {generateGuid} from "@shammasov/utils";

export const Roles =['Администратор','Руководитель','Сотрудник']as const
export type Role = typeof Roles[number]
const usersRaw = createEntitySlice(
  "users",
  {
    email: AttrFactory.string({
      headerName: "Email",
      required: true,
      trim: true,
      toLowerCase: true,
      unique: true,
      colDef: { width: 250 },
    }),
    password: AttrFactory.string({
      headerName: "Пароль",

      required: true,
      colDef: false,
    }),
    firstName: AttrFactory.string({
      required: true,
      colDef: { width: 250 },
      headerName: "Имя",
    }),
      lastName: AttrFactory.string({
          required: true,
          colDef: { width: 250 },
          headerName: "Фамилия",
      }),
        role: AttrFactory.enum({
          required: true,
          headerName: "Роль",
          enum:Roles as const

        }),
      projectIds: AttrFactory.listOf({
          headerName: "Проекты",
          refEID: "projects",
          tsType: [] as string[],
          default: [],
      })
  },
  {
    extraEntityReducers: (builder) => {
      /*
        builder.addCase(trackListened, (state, action) => {
            const user = state.entities[action.payload.userId]
            user.listenedTrackIds.push(action.payload.trackId)
        })
*/
      /* builder.addCase(trackDownloaded, (state, action) => {
            const user = state.entities[action.payload.userId]
            user.downloadedTrackIds.push(action.payload.trackId)
        })*/
    },

    getItemName: (item) => item.firstName + " " + item.lastName,
    langRU: {
      singular: "Пользователь",
      plural: "Пользователи",
      some: "Пользователя",
    },
  }
);


export type Credentials = {
    password: string
    username: string
}



type UsersReducer = typeof usersRaw.reducer
type State = Parameters<UsersReducer>[0]


var uiAvatarColors = [
    '#775DD0',
    '#FF9800',
    '#A5978B',
    '#FD6A6A',
    '#69D2E7',
    '#C5D86D',
    '#E2C044',
    '#C4BBAF',
    '#00B1f2',
    '#8b71e4',
    '#ffac14',
    '#b9ab9f',
    '#ff7e7e',
    '#7de6fb',
    '#d9ec81',
    '#f6d458',
    '#d8cfc3',
    '#14c5ff',
] as const
let fontColors = ['#f5f6f9', '#383a3e'] as const
var generateGravatar = (index, n, s) => {
    const num = index % uiAvatarColors.length
    const bgColor = uiAvatarColors[num]

    const c1 = chroma.contrast(bgColor, '#f5f6f9')
    const c2 = chroma.contrast(bgColor, '#383a3e')

    const color = chroma.contrast(bgColor, '#f5f6f9') > chroma.contrast(bgColor, '#383a3e')
        ? 'f5f6f9' : '383a3e'
    return `https://ui-avatars.com/api/?background=${bgColor.substring(1)}&font-size=${0.4}&color=${color}&format=svg&name=${n}+${s}`
}

export const getAbbrName = (user) =>  {
    const parts = (user.fullName || 'Новый Пользователь Отчество').split(' ')
    const getPart = (index: number) => {
        const part = parts[index]
        if(index === 0) {
            return part
        }
        return (part && part.length ) ? (' '+part[0]+'.') : ''
    }

    return getPart(0)+getPart(1)+ getPart(2)
}



export const defaultAdminUser = {
    role: 'Admin',
    removed: false,
    avatarUrl: undefined,
    id: 'root',
    email: 'miramaxis@gmail.com',
    company: 'shammasov.com',
    fullName: 'Шаммасов Максим Тимурович',
    password: '123456',
    title: 'Программист',

} as any as UserVO


const  stringToHashInt = (str: string) => {
    let arr = String(str).split('');
    return Math.abs(arr.reduce(
        (hashCode, currentVal) =>
            (hashCode =
                currentVal.charCodeAt(0) +
                (hashCode << 6) +
                (hashCode << 16) -
                hashCode),
        0
    ));
};
export const usersResource = {
    ...usersRaw,
    generateDefaultItems: async (state,exampleItem) => {
        return [{id: generateGuid(),email:'miramaxis@gmail.com',password:'12345678', role:'Администратор',firstName:'Администратор',lastName:'Первый', projectIds:[]}  as UserVO]
    },
    getItemName: (item) =>
        getAbbrName(item),
    selectAvatar: (userId: string) => (state): string => {
        const user:UserVO = usersRaw.selectors.selectById(userId)(state) as any
        if(user.avatarUrl)
            return user.avatarUrl
        const num = stringToHashInt(userId)
        return generateGravatar(num, user.name ? user.name.charAt(0) : '', (user.lastname?user.lastname.charAt(0): ''))
    },

}
export const USERS = usersResource

export default usersResource
export type UserVO = typeof usersRaw.exampleItem

import {AttrFactory, createEntitySlice} from "@shammasov/mydux";

export const TOPICS = createEntitySlice('topics', {
    topicName: AttrFactory.string({
        required: true,
        unique: true,
        headerName: 'Тематика',
    }),
    isFrozen: AttrFactory.boolean({
        headerName: 'Закрыта для новых повпросов',
        default: false,
    }),
    projectIds: AttrFactory.listOf({headerName: 'Открыта в проектах',refEID: 'projects',default:[],}),
},
    {
        langRU:{
            singular:'Тема',
            plural:'Темы',
            some:'Тем'
        }
    })
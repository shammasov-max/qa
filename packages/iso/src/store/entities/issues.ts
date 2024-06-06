import { AttrFactory, createEntitySlice } from "@shammasov/mydux";

export const ISSUES = createEntitySlice('issues',{
        projectId: AttrFactory.itemOf({
            required: true,
            headerName: 'Проект',
            refEID:'projects',
            immutable: true,
            required: true}),
        topic: AttrFactory.string({required: true, headerName: 'Тема'}),
        name: AttrFactory.string({required: true, headerName: 'Заголовок',unique: true}),
        issuedDate: AttrFactory.date({headerName: 'Дата создания',immutable:true, required: true}),
        plannedDate: AttrFactory.date({headerName: 'Запланировано'}),
        completedDate: AttrFactory.date({headerName: 'Дата завершения'}),
        updatedAt: AttrFactory.date({headerName: 'Дата обновления',required:true}),
        reporterUserId: AttrFactory.itemOf({headerName: 'Создатель',refEID:'users',immutable: true, required: true}),
        assigneeUserId: AttrFactory.itemOf({headerName: 'Ответственный',refEID:'users'}),
        status: AttrFactory.enum({headerName: 'Статус',enum:['Новый','На уточнении','Ответ получен','Закрыт','Отменён'] as const}),
        description: AttrFactory.string({headerName: 'Вопрос',required: true}),
        result: AttrFactory.string({headerName: 'Ответ'}),
        priority: AttrFactory.enum({headerName: 'Приоритет',enum:['Низкий','Средний','Высокий','Безотлагательный'] as const}),

    },
    {

        extraEntityReducers: (builder)=> {

            builder.addCase(trackListened, (state, action) => {
                state.entities[action.payload.trackId].listeners++
            })

            builder.addCase(trackDownloaded, (state, action) => {
                state.entities[action.payload.trackId].downloads++
            })
        },

        nameProp: 'title',
        langRU:{
            singular:'Вопрос',
            plural:'Вопросы',
            some:'Вопроса'
        },
    }
)




export function formatMSS(s){
 s = Math.floor(s)
     return(s-(s%=60))/60+(9<s?':':':0')+s
 }



export const MP3TagProps: (keyof typeof Issues.attributes)[]= [
    'title','album','bpm','artist','year','genre','mood','duration'] as const


export type TrackVO =typeof Issues.exampleItem

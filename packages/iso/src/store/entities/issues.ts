import { AttrFactory, createEntitySlice, preparePersistent } from '@common/mydux'
import { createAction }                                      from '@reduxjs/toolkit'
import { faker }                                             from '@faker-js/faker'
import { randomElement } from '@common/utils'
import { DateInput }     from 'admin/src/generic-ui/grid/DateInput.tsx'

const issueAssigned =  createAction(
    "issues/assigned",
    preparePersistent<{ issueId: string, userId?: string; }>()
);

const issueResolved = createAction(
    "issues/resolved",
    preparePersistent<{ issueId: string}>()
)


export const ISSUES = createEntitySlice('issues',{
        index: AttrFactory.number({headerName:'Номер'}),
        // ссылка на проект
        projectId: AttrFactory.itemOf({required: true, headerName: 'Проект', refEID:'projects', immutable: true}),
        issuedDate: AttrFactory.date({headerName: 'Дата создания',immutable:true, required: true, faker: () => new Date().toISOString()}),
        plannedDate: AttrFactory.date({headerName: 'Запланировано', faker: () => new Date().toISOString()}),
        completedDate: AttrFactory.date({headerName: 'Дата завершения', faker: () => new Date().toISOString()}),
        updatedAt: AttrFactory.date({headerName: 'Дата обновления',required:true,faker: () => new Date().toISOString()}),
        // ссылка на вопросителя
        reporterUserId: AttrFactory.itemOf({headerName: 'Создатель',refEID:'users',immutable: true, required: true,}),
        // ссылка на ответственного
        assigneeUserId: AttrFactory.itemOf({headerName: 'Ответственный',refEID:'users'}),
        status: AttrFactory.enum({headerName: 'Статус',enum:['Новый','На уточнении','Ответ получен','Закрыт','Отменён'] as const, faker: ()=> 'Новый'}),
        description: AttrFactory.string({headerName: 'Вопрос',required: true, faker: () => faker.lorem.text()}),
        result: AttrFactory.string({headerName: 'Ответ'}),
        priority: AttrFactory.enum({headerName: 'Приоритет',enum:['Низкий','Средний','Высокий','Безотлагательный'] as const, faker: () => randomElement(['Низкий','Средний','Высокий','Безотлагательный'] )}),

    },
    {

        extraEntityReducers: (builder)=> {
            builder.addCase(issueAssigned, (state, action) => {
                state.entities[action.payload.issueId].assigneeUserId = action.payload.userId
            })

        },

        nameProp: 'name',
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

export const statuses = ['Новый','На уточнении','Ответ получен','Закрыт','Отменён'] as const
export const priority = ['Низкий','Средний','Высокий','Безотлагательный'] as const


export type IssueVO =typeof ISSUES.exampleItem

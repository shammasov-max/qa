import {
  AttrFactory,
  createEntitySlice,
} from "@common/mydux";

export const COMMENTS = createEntitySlice('comments',{
        // ссылка на объект автора, который создал комментарий
        authorId: AttrFactory.itemOf({required: true,headerName: 'Автор',refEID:'users'}),
        // ссылка на объект вопроса, к которому относится комментарий
        issueId: AttrFactory.itemOf({headerName: 'Вопрос',refEID:'issues',immutable: true, required: true}),
        createdAt: AttrFactory.date({headerName: 'Добавлен',}),
        text: AttrFactory.string({required: true, headerName: 'Комментарий'}),
    },
    {
        nameProp: 'text',
        langRU:{
            singular:'Комментарий',
            plural:'Комментарии',
            some:'Комментария'
        }
    }
)

export type CommentVO = typeof COMMENTS['exampleItem']

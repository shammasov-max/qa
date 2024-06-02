import {
  AttrFactory,
  createEntitySlice,
  type StateWithEntity,
} from "@shammasov/mydux";

export const COMMENTS = createEntitySlice('comments',{
        projectId: AttrFactory.itemOf({headerName: 'Проект',refEID:'projects',immutable: true, required: true}),
        authorId: AttrFactory.itemOf({required: true,headerName: 'Автор',refEID:'users'}),
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
COMMENTS.attributes.projectId

export type CommentVO = typeof COMMENTS['exampleItem']
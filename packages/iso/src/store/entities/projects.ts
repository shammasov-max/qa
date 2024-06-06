import { AttrFactory, createEntitySlice } from "@shammasov/mydux";

export const PROJECTS = createEntitySlice(
  "projects",
  {
    name: AttrFactory.string({
      headerName: "Название проекта",
      required: true,
        unique: true,
    }),
    usersIds: AttrFactory.listOf({
        headerName: "Участники",
        refEID: "users",
        tsType: [] as string[],
        default: [],
    }),


  },
  {
      nameProp:'projectName',

    langRU: {
      singular: "Прoект",
      plural: "Проекты",
      some: "Проекта",
    },
  }
);

export type ProjectVO =typeof PROJECTS.exampleItem

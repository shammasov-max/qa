import { AttrFactory, createEntitySlice } from "@shammasov/mydux";

export const PROJECTS = createEntitySlice(
  "projects",
  {
    projectName: AttrFactory.string({
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
    langRU: {
      singular: "Прoект",
      plural: "Проекты",
      some: "Проекта",
    },
  }
);

export type ProjectVO =typeof PROJECTS.exampleItem

import { AttrFactory, createEntitySlice } from "@shammasov/mydux";
import { faker }                          from '@faker-js/faker'

export const PROJECTS = createEntitySlice(
  "projects",
  {
    name: AttrFactory.string({
      headerName: "Название проекта",
      required: true,
        unique: true,
        faker: () => faker.company.name()
    }),
      description: AttrFactory.description({
          headerName: "Описание проекта",
          required: true,
          faker: () => faker.lorem.sentence({ min: 6, max: 15 }),
      }),
    usersIds: AttrFactory.listOf({
        headerName: "Участники",
        refEID: "users",
        tsType: [] as string[],
        default: [],
    }),
    image: AttrFactory.string({
        headerName: "Изображение",
        faker: () => faker.image.urlLoremFlickr({ width: 544, height:366 }),

      }),

  },
  {
      nameProp:'name',

    langRU: {
      singular: "Прoект",
      plural: "Проекты",
      some: "Проекта",
    },
  }
);

export type ProjectVO =typeof PROJECTS.exampleItem

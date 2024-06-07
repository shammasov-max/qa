import {generateGuid, isFunction} from "@shammasov/utils";

import type { ColDef } from "ag-grid-community";
import { mergeDeepRight } from "ramda";
import { AntdNiceFormField } from "@ebay/nice-form-react/lib/cjs/adapters/antdAdapter";
import {DeepPartial} from "utility-types";
import dayjs          from "dayjs";
import {DateInput}                                from "admin/src/generic-ui/grid/DateInput";
import { DatePicker, Input, InputNumber, Switch } from 'antd'
import { DateTimeInput }                          from 'admin/src/generic-ui/grid/DateTimeInput.tsx'

export type Empty = Record<string, never> & { a: 4 };
export type AttrCommonMeta = {
    required?:boolean
    immutable?:boolean
    headerName?: string
    sealed?: boolean
    unique?: boolean
    colDef?: ColDef | false
    select?: boolean
    name?:string
    faker?: (attr,item: object, state: object) => any,
    formField:Partial<AntdNiceFormField>
}

export type AttrPartialArgumentMeta = DeepPartial<AttrCommonMeta>
export type DeepPartialMetaWithoutFormField = Omit<AttrPartialArgumentMeta,'formField'>//{formField?:Partial<AntdN>}

type AttributesFactoryOptions <

TsType extends any = string,
OwnOptions extends object = {},
> = {

    default?: TsType | (() => TsType),
    parseOptions: {
        (options: OwnOptions & DeepPartialMetaWithoutFormField): OwnOptions & AttrCommonMeta & {tsType?: TsType},
    }
}

export type DefaultValueMeta<TsType> = TsType | (() => TsType)

const createAttributesFactory =  <
    AttrType extends string = 'string',
    TsType extends any = string,
    OwnOptions extends {default?:DefaultValueMeta<TsType>} = {default?:DefaultValueMeta<TsType>},
> (type:AttrType, { parseOptions }: AttributesFactoryOptions<
    TsType,
    OwnOptions
    > ) => {
        return (opts:DeepPartialMetaWithoutFormField & OwnOptions) => {

            const ownOptions = parseOptions(opts || {} as any)
            const formField = ownOptions.formField || {}
            if(ownOptions.required)
                formField.required = true


            if(ownOptions.headerName)
                formField.label = ownOptions.headerName
            formField.key = ownOptions!.name!
            formField.name = ownOptions!.name!

            const defaultValue = opts ? isFunction(ownOptions.default) ? ownOptions.default() : ownOptions.default : undefined
            //if(opts.unique)
              //  formField.rules =
            const attr = {
                ...opts,

                ...ownOptions,
                type,

                tsType:'a' as any as TsType,

                formField,
                defaultValue,
                default: ownOptions.default,

            } as const

            return attr
        } 
    }


const createSimpleAttrFactory = <AttrType extends string,TsType = string>(type:AttrType, formField?: Partial<AntdNiceFormField>, tsType?: TsType,) =>
    createAttributesFactory(type, {

        parseOptions: (opts: Omit<AttrCommonMeta,  'formField'>  & {default?:DefaultValueMeta<TsType>} & {formField?: Partial<AntdNiceFormField>}) => {
            return {...opts, tsType,formField:{...(formField||{}),...opts.formField},}
        }
    })


export const AttrFactory = {
    id: createAttributesFactory('id',{
        parseOptions: (opts: DeepPartialMetaWithoutFormField & {default?: DefaultValueMeta<string>} & {formField?: Partial<AntdNiceFormField>}) => {
           return {...opts, tsType: 'a' as any as string,immutable:true,headerName: 'ID' ,required:true, unique:true, colDef:false,formField:{...opts.formField||{}},}
        }
    }),
    itemOf: createAttributesFactory('itemOf',{
        parseOptions: <RefEID extends string>(opts: {refEID: RefEID ,   filterRefs?: (data: any, allIds:string[], state:any) => string[]} & {default?: DefaultValueMeta<string>} & AttrPartialArgumentMeta) => {
            const formField =( opts.formField || {} ) as AntdNiceFormField
            formField.options = [{value:opts.refEID,label:opts.refEID}]


            return mergeDeepRight(opts, {formField, tsType: '' as string, multiple: false}) as any as {refEID: RefEID} & {default?: DefaultValueMeta<string>} & AttrPartialArgumentMeta
        }
    }),
    listOf: createAttributesFactory('listOf',{
        parseOptions: <RefEID extends string>(opts: {refEID: RefEID,   filterRefs?: (data: any, allIds:string[], state:any) => string[]} & {default?: DefaultValueMeta<string[]>} & AttrPartialArgumentMeta) => {
            const formField =( opts.formField || {} ) as AntdNiceFormField

            formField.options = [{value:opts.refEID,label:opts.refEID}]

            return mergeDeepRight({...opts}, {multiple: true, tsType: [] as any as string[], default: []})
        }
    }),
    list: createAttributesFactory('list',{
        parseOptions: (opts :{default?: DefaultValueMeta<string[]>}& AttrPartialArgumentMeta) => {
            const formField =( opts.formField || {} ) as AntdNiceFormField

            return mergeDeepRight({...opts}, {formField, tsType: [] as any as string[]})
        }
    }),
    attachment: createSimpleAttrFactory('attachment',{}),
    string: createSimpleAttrFactory('string',{}),
    description: createSimpleAttrFactory('string',{widget:Input.TextArea}),
    password: createSimpleAttrFactory('password',{}),
    text: createSimpleAttrFactory('text',{}),
    date: createSimpleAttrFactory('date',{widget:DateInput}),
    datetime: createSimpleAttrFactory('datetime',{widget:DateTimeInput}),
    image: createSimpleAttrFactory('image',{}),
    number: createSimpleAttrFactory('number',{widget: InputNumber},4),
    boolean: createSimpleAttrFactory('boolean', {widget:Switch},true),
    uint: createSimpleAttrFactory('uint',{},0),
    int: createSimpleAttrFactory('int',{widget: InputNumber},0),
    timestamp: createSimpleAttrFactory('timestamp',{},0),

    enum: createAttributesFactory('enum',{
        parseOptions: <Enum extends Readonly<string[]>>(opts: AttrPartialArgumentMeta & {enum: Enum} & {default?: Enum[number]}) => {
            return {
                ...opts,
                formField: {...opts.formField,widget:'select', options: opts.enum.map(v => ({value:v}))},
                enum: opts.enum,
                tsType: '' as any as typeof opts.enum[number]
            }
        }
    }),
    //item: itemMeta,
    any: createSimpleAttrFactory('any',{} as any),
}
export type AttrType = keyof typeof AttrFactory
export type AnyAttr = typeof AttrFactory[AttrType]
export type AnyAttrMeta = ReturnType<typeof AttrFactory[AttrType]>


export const commonAttrs =<EID extends string>(eid: EID) => ({
    id: AttrFactory.id({headerName: 'ID', default: () => generateGuid(),formField:{key:'id',name:'id',label:'ID'} }),
    removed: AttrFactory.boolean({select: false, colDef: false, formField:{}}),
    addedAtTS: AttrFactory.datetime({headerName:'Добавлен', default: () => new Date().toISOString(),faker: () => new Date().toISOString(),formField:{widget:DateInput}})
})

export type CommonAttrs<EID extends string> = ReturnType<typeof commonAttrs>


export type AnyAttributes<EID extends string = string> =  {[key: string]: AnyAttrMeta}
export type ItemByAttrs<Attrs extends AnyAttributes, EID extends string = string> ={
    [K in keyof (CommonAttrs<EID> & Attrs)]: (CommonAttrs<EID> & Attrs)[K]['tsType']
}

import { DatePicker, Select, Tooltip } from 'antd'
import locale                          from "antd/es/date-picker/locale/ru_RU";
import type {CustomCellEditorProps} from "ag-grid-react";
import {AttrFactory, AttrType} from "@shammasov/mydux";
import {DefaultOptionType} from "rc-select/lib/Select";
import {getEntityByTypeName} from "iso";
import {useSelector} from "react-redux";
import {reject} from "ramda";
import ReactSelect from "react-select";
import  { components, MultiValueGenericProps } from 'react-select';
import { Space, Typography } from 'antd';
import { isArray } from '@shammasov/utils'

const { Text, Link } = Typography;

export type ReferenceInputProps<IsMulti extends boolean = false> =  {
    readOnly?:boolean,
    value: IsMulti extends boolean? string[] : string,
    onChange?:(value: IsMulti extends boolean? string[]:string)=>void,
    options:DefaultOptionType[]
    multiple?:IsMulti

} & CustomCellEditorProps<any, string[]|string>

type ItemOfAttrType =ReturnType<typeof AttrFactory['itemOf']>

export type RefAttrProps = {
    name:string
    type:AttrType
    refEID:string
    filterRefs?: (data: any, allIds:string[], state:any) => string[]
}

export const  createReferenceInput = (attr: RefAttrProps) => (props:ReferenceInputProps) => {
    return <ReferenceInput {...props} {...attr} multiple={attr.type ==='listOf'} />
}

export const ReferenceInput = ({onChange,value,readOnly,multiple,refEID,filterRefs,  onValueChange,stopEditing,colDef}:   ReferenceInputProps & RefAttrProps) => {
    const MultiValueLabel = (props: MultiValueGenericProps<DefaultOptionType>) => {
        return (
            <Tooltip content={props.data.label}>
                <Link href={'/app'} underline={true} >{props.data.label}</Link>
                {/*<components.MultiValueLabel {...props} />
                 */}</Tooltip>
        );
    };


    const allRefs = useSelector(getEntityByTypeName((refEID.toUpperCase())).selectors.selectAll)
    const refs = filterRefs ? allRefs.filter(filterRefs) : allRefs
    const options = refs.map(i => ({value:i.id, label:i.name}))
    const currentValue = multiple? (value||[]) : (value||undefined)
    const currentSelectValue = multiple ? options.filter(i => currentValue.includes(i.value)) : options.find(i => i.value === currentValue)
    return             <ReactSelect
        style={{minWidth:'250px'}}
        components={{ MultiValueLabel: MultiValueLabel }}
                            isMulti={multiple}
                                value={currentSelectValue}
                            onChange={(newValue, actionMeta) =>{
                                const nextValue = isArray(newValue)? newValue.map(i => i.value) : newValue.value
                                if(onChange)
                                    onChange(nextValue)
                                if(onValueChange)
                                    onValueChange(nextValue)
                                if(stopEditing)
                                    stopEditing()

                                                            }}



                                 allowClear={multiple && true}
                                optionFilterProp={'label'}
                                showSearch={true}
                                style={{minWidth:'200px'}}
                                options={options}
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                     {/*   <Divider style={{ margin: '8px 0' }} />
                                        <Space style={{ padding: '0 8px 4px' }}>
                                            <Button type="text" icon={<PlusOutlined />} >
                                                Добавить
                                            </Button>
                                        </Space>*/}
                                    </>
                                )}
    />


}

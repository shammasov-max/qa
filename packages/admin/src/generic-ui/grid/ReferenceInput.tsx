import {DatePicker, Select} from "antd";
import locale from "antd/es/date-picker/locale/ru_RU";
import type {CustomCellEditorProps} from "ag-grid-react";
import {AttrFactory, AttrType} from "@shammasov/mydux";
import {DefaultOptionType} from "rc-select/lib/Select";
import {getEntityByTypeName} from "iso";
import {useSelector} from "react-redux";
import {reject} from "ramda";
export type ReferenceInputProps =  {
    readOnly?:boolean,
    onChange?:(value:string|string[])=>void,
    options:DefaultOptionType[]
    multiple?:boolean

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


    const allRefs = useSelector(getEntityByTypeName((refEID.toUpperCase())).selectors.selectAll)
    const refs = filterRefs ? allRefs.filter(filterRefs) : allRefs
    const options = refs.map(i => ({value:i.id, label:i.name}))
    return             <Select value={value||[]}
                               onDeselect={(current) => {

                                   const nextValue = multiple ? reject(m => m === current, value) :  current
                                   console.log('Deselect',value,current, nextValue)
                                    if(onChange)
                                        onChange(nextValue)
                                    if(onValueChange)
                                        onValueChange(nextValue)
                                    if(stopEditing)
                                        stopEditing()

                               }}
                                onSelect={ (current, option) => {
                                    const nextValue = multiple ? [...value,current] :  current
                                    console.log('Select',value,current, nextValue)
                                    if(onChange)
                                        onChange(nextValue)
                                    if(onValueChange)
                                        onValueChange(nextValue)
                                    if(stopEditing)
                                        stopEditing()
                                }}

                                mode={multiple ? 'multiple' :undefined}
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
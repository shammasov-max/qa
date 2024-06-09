import {useCallback, useState} from "react";
import {Button, Form, Modal} from "antd";
import NiceForm from "antd-form-builder";
import NiceModal, { antdModal, useModal } from "@ebay/nice-modal-react";
import type { AnyEntitySlice } from "iso";
import { ItemByAttrs } from "@common/mydux";
import {AntdNiceFormField, AntdNiceFormMeta} from "@ebay/nice-form-react/lib/cjs/adapters/antdAdapter";
import { DevTool } from "antd-form-devtools";
import {useDispatch, useSelector} from "react-redux";
import {generateGuid, isArray, isFunction} from "@common/utils";
import {createReferenceInput} from "./grid/ReferenceInput.tsx";
import ReactSelect from 'react-select'

export type EntityModalProps<
  E extends AnyEntitySlice
> = {
    id?: string
    formId?: string
 // onSubmit: {(previousState: E['exampleItem']) : void};
    defaultProps?: Partial<E["exampleItem"]>;
    getMeta?: {(previousState: E['exampleItem'], meta?:AntdNiceFormMeta) : AntdNiceFormMeta};
}
export const entityModalFactory = <
    E extends AnyEntitySlice
> (entitySlice: E) =>  NiceModal.create(( props: EntityModalProps<E>) => {
    const {defaultProps, getMeta}=props
    const [formId] = useState(props.formId || "entityFormId");
    const dispatch = useDispatch();
    const [isNew] = useState(props.id === "new");
    const [id] = useState(isNew ? generateGuid():props.id);
    const selectedItem = useSelector(entitySlice.selectors.selectById(id));
    const [initialValues] = useState(selectedItem || {id,...defaultProps});
    const modal = useModal();
    const [form] = Form.useForm<E['exampleItem']>();
    const currentState = {...form.getFieldsValue()};

        const convertMeta = (item: Partial<E["exampleItem"]>): AntdNiceFormMeta => {
            const result = {
                initialValues:  { id: generateGuid() },
                fields: entitySlice.attributesList
                    .filter((a) => a.select !== false && a.name !== 'id')
                    .map((attr) => {
                        const formField: AntdNiceFormField = {...attr.formField};
                        formField.attr = attr
                        if(formField.required) {
                            formField.required = undefined;
                            formField.rules = [
                                {
                                    required: true,
                                    message: `Укажте ${attr.headerName}!`,
                                },
                            ];
                        }
                        formField.initialValue = isFunction(attr.default) ? attr.default(item) : item[attr.name];
                    if(attr.type === 'itemOf' || attr.type === 'listOf') {
                        formField.widget = createReferenceInput(attr)
                        formField.widgetProps = {mode: attr.type === 'listOf'?'multiple':undefined}
                    }

                        return formField
                    }),
            };
            console.log("META", result);
            return result as AntdNiceFormMeta;
        };
        const meta = convertMeta(currentState);
    const handleSubmit = async () => {

        const result = await form.validateFields()
            const newItem = { ...form.getFieldsValue() };
        if(isNew) {
            const action = entitySlice.actions.added(newItem);
            dispatch(action);
        }else {
            const action = entitySlice.actions.updated({ id: id, changes: newItem });
            dispatch(action);
        }
            modal.resolve(newItem);
           await  modal.hide();
           modal.remove()


    }
    const onAutofill = () => {
        const current = {...form.getFieldsValue()}
        meta.fields.forEach((field) => {
            if(isArray(current[field.name])) {
                return
            }
            if(!current[field.name]) {
                const attr = entitySlice.attributes[field.name]
                current[field.name] = (attr && attr.faker )?attr.faker() : undefined// String(Math.random() * 100)
            }
        })
        form.setFieldsValue(current)
    }
    return (
        <Modal
            {...antdModal(modal)}
            destroyOnClose={true}
            closable={true}
            title={isNew
                ? 'Добавить '+ entitySlice.langRU.singular
                :  entitySlice.langRU.singular + ' '+entitySlice.getItemName(currentState)


            }

            okText={isNew ? 'Добавить' : 'Сохранить'}
            cancelText={"Отмена"}
            onOk={handleSubmit}
           

        >
            <Form form={form} initialValues={initialValues} id={formId} >

                <NiceForm meta={meta} form={form}/>
                <Button onClick={onAutofill}>Autofill</Button>
            </Form>
        </Modal>
    );
}
);

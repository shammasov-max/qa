import type {AnyEntitySlice}               from "iso";
import {entityModalFactory}                from "../generic-ui/EntityModal";
import {useAdminSelector}                  from "../app/buildAdminStore.ts";
import {useModal}                          from "@ebay/nice-modal-react";
import PanelRGrid, { type PatchColumns }   from "../generic-ui/grid/PanelRGrid";
import {Button}                                         from "antd";
import type { AnyAttributes, EntitySlice, ItemByAttrs } from '@common/mydux'

export const createGenericPagesForEntity = <
    Attrs extends AnyAttributes = AnyAttributes,
    K extends keyof ItemByAttrs<Attrs> = ItemByAttrs<Attrs>,
    EID extends string = string,
    E extends EntitySlice<Attr,EID> = EntitySlice<Attr,EID>,
> (entitySlice: E,pathColumns?: PatchColumns<E>) => {



    const ItemModal = entityModalFactory(entitySlice);

    const ListPage = () => {
        const list = useAdminSelector(entitySlice.selectors.selectAll);

        type E = AnyEntitySlice;

        const itemModal = useModal(ItemModal);

        const onItemAdd = async () => {
            const item: E["exampleItem"] = await itemModal.show({
                id: 'new',//undefined as any as E["exampleItem"],
                formId: "entityFormId",
            });

        };
        const onItemEdit = async (itemId: string) => {
            const item: E["exampleItem"] = await itemModal.show({
                id: itemId,
                formId: "entityFormId",
            });


        };
        return (
            <PanelRGrid
                onEdit={onItemEdit}
                onCreateClick={onItemAdd}
                bottomBar={<Button>Bottom bar</Button>}
                title={entitySlice.langRU.plural}
                resource={entitySlice}
                rowData={list}
                patchColumns={pathColumns}
            ></PanelRGrid>
        );
    };

    return {
        entitySlice,
        ItemModal,
        ListPage
    }
}

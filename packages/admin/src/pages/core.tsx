import type {AnyEntitySlice} from "iso";
import {entityModalFactory} from "../generic-ui/EntityModal";
import {useAdminSelector} from "../app/buildAdminStore.ts";
import {useModal} from "@ebay/nice-modal-react";
import PanelRGrid from "../generic-ui/grid/PanelRGrid";
import {Button} from "antd";

export const createEntityPages = <E extends AnyEntitySlice>(entitySlice: AnyEntitySlice) => {



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
            ></PanelRGrid>
        );
    };

    return {
        entitySlice,
        ItemModal,
        ListPage
    }
}

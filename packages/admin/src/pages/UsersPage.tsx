import PanelRGrid from "../generic-ui/grid/PanelRGrid";
import { CellEditingStoppedEvent } from "ag-grid-community";
import { type AnyEntitySlice, USERS } from "iso";
import { useAdminSelector } from "../app/buildAdminStore.ts";

import { Button } from "antd";
import {entityModalFactory} from "../generic-ui/EntityModal";
import { useModal } from "@ebay/nice-modal-react";
import {createEntityPages} from "./core";




export const UsersComponents  = createEntityPages(USERS)
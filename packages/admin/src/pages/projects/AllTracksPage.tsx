import { Issues } from "iso";
import PanelRGrid from "../../generic-ui/grid/PanelRGrid";
import { CellEditingStoppedEvent } from "ag-grid-community";
import { useNavigate } from "react-router-dom";
import { useAdminSelector } from "../../app/buildAdminStore";
import { Button } from "antd";
import { useDispatch } from "react-redux";

export default () => {
  const list = useAdminSelector(Issues.selectors.selectAll);
  const dispatch = useDispatch();

  const onRandomize = () => {};
  console.log("LIST", list);

  const cellEditingStopped = (e: CellEditingStoppedEvent) => {
    console.log(e);
  };

  const navigate = useNavigate();

  const onCreateClick = () => navigate("/admin/upload");

  return (
    <PanelRGrid
      bottomBar={
        <Button onClick={() => onRandomize()}>Назначить случайно</Button>
      }
      onCellEditingStopped={cellEditingStopped}
      title={"Все треки"}
      onCreateClick={onCreateClick}
      resource={Issues}
      rowData={list}
    ></PanelRGrid>
  );
};

import { Button, List, Typography } from "antd";
import { PLAY_LISTS, topListsSchema } from "iso";
import { useParams } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import TransferModal from "../../elements/TransferModal";
import {
  useAdminReduxStore,
  useAdminSelector,
} from "../../app/buildAdminStore";
import { useDispatch } from "react-redux";

export default () => {
  const dispatch = useDispatch();
  let { topListId } = useParams();
  const topListInfos = topListsSchema.list;
  const playListsMap = useAdminSelector(PLAY_LISTS.selectors.selectAsMap);
  const navigate = useNavigate();
  const onModalClose = () => {
    navigate("/admin/tops");
  };
  const store = useAdminReduxStore();
  const onAuto = () => {
    topListInfos.forEach((l) => {
      const playListId = l.playListId;

      const newTrackIds = l!.selectAutoTrackIds!(l.expectedLength!)(
        store.getState()
      );
      console.log("newTrackIds", newTrackIds);
      dispatch(
        PLAY_LISTS.actions.updated({
          id: playListId,
          changes: { trackIds: newTrackIds },
        })
      );
    });
  };
  return (
    <>
      <div>TopListId : {topListId}</div>
      {topListId && (
        <TransferModal
          playListId={topListId}
          onClose={onModalClose}
        ></TransferModal>
      )}
      <List
        itemLayout="horizontal"
        dataSource={topListInfos}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Link to={"/admin/tops/" + item.playListId}>Редактировать</Link>,
            ]}
          >
            <List.Item.Meta
              title={item.topListName}
              description={item.description}
            />
            <div>
              Указано {playListsMap[item.playListId].trackIds.length} треков
            </div>
            <div>
              <Typography.Text type={"secondary"}>
                Рекомендовано {item.expectedLength}
                <Link to={"/admin/tops/" + item.playListId}>Редактировать</Link>
                ,
              </Typography.Text>
            </div>
          </List.Item>
        )}
      />
      <Button onClick={onAuto}>Автоматически назначить списки</Button>
    </>
  );
};

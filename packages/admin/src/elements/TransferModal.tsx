import { useDispatch } from "react-redux";
import { PLAY_LISTS, topListsSchema, TopPlayListInfo } from "iso";
import { Button, Modal } from "antd";
import { TransferTracks } from "./TransferTracks";
import { useState } from "react";
import { useAdminSelector, useAdminState } from "../app/buildAdminStore.ts";

export default ({
  playListId,
  onClose,
}: {
  playListId: string;
  onClose: Function;
}) => {
  const dispatch = useDispatch();

  const topListInfo: TopPlayListInfo = topListsSchema.map[playListId];
  const list = useAdminSelector(PLAY_LISTS.selectors.selectById(playListId));
  const [trackIds, setTrackIds] = useState(list.trackIds);
  const onSave = () => {
    dispatch(
      PLAY_LISTS.actions.updated({
        id: playListId,
        changes: { trackIds: trackIds },
      })
    );
    onClose();
  };
  const state = useAdminState();
  const onClickAuto = () => {
    const newTrackIds = topListInfo!.selectAutoTrackIds!(
      topListInfo.expectedLength!
    )(state);
    console.log("newTrackIds", newTrackIds);
    setTrackIds(newTrackIds);
  };
  const key = trackIds.join("") + "d";
  console.log("Key", key);
  return (
    <Modal
      open={playListId !== undefined}
      onOk={onSave}
      title={"ТОП лист " + topListInfo.topListName}
      onCancel={onClose}
      style={{ width: "90vw" }}
      width={1400}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <Button onClick={onClickAuto} block>
            Собрать автоматически
          </Button>
          <CancelBtn />
          <OkBtn />
        </>
      )}
    >
      <TransferTracks
        key={key}
        selectedTrackIds={trackIds}
        setSelectedTrackIds={setTrackIds}
      />
    </Modal>
  );
};

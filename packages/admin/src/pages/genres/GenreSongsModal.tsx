import { useDispatch } from "react-redux";
import { Modal } from "antd";
import { TransferTracks } from "../../elements/TransferTracks";
import { ARTISTS, Issues } from "iso";
import { useAdminSelector } from "../../app/buildAdminStore";

export type GenreModal = {
  genre: string;
  onClose: Function;
};
export default ({genre,onClose}:GenreModal) => {
    const dispatch = useDispatch()
    const genre = useAdminSelector(ARTISTS.selectors.selectById(genre))
    const allTracks = useAdminSelector(Issues.selectors.selectAll)
   // const tracks = allTracks.filter(i => i.artist === artist.artistName)
    return <Modal
        open={true}
        onCancel={onClose}
        onOk={onClose} style={{width: '90vw'}} width={1400} >
       <TransferTracks targetIds={} />
    </Modal>
}

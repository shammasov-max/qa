import { useDispatch } from "react-redux";
import { Modal } from "antd";
import { ARTISTS, Issues } from "iso";
import RGrid from "../../generic-ui/grid/RGrid";
import { useColumns } from "../../generic-ui/grid/RCol";
import { useAdminSelector } from "../../app/buildAdminStore";

export type ArtistModal = {
  artistId: string;
  onClose: Function;
};
export default ({artistId,onClose}:ArtistModal) => {
    const dispatch = useDispatch()
    const [cols, colsMap] = useColumns(Issues)
    const artist = useAdminSelector(ARTISTS.selectors.selectById(artistId))
    const allTracks = useAdminSelector(Issues.selectors.selectAll)
    const tracks = allTracks.filter(i => i.artist === artist.artistName)
    return <Modal
        open={true}
        onCancel={onClose}
        title={<span><b>{artist.artistName}</b>: все треки исполнителя</span>}
        onOk={onClose} style={{width: '90vw'}} width={1400} >
        <RGrid columnDefs={cols} rowData={tracks} ></RGrid>
    </Modal>
}

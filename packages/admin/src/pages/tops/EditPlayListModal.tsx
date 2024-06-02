import './styles.css'
import React from 'react'
import {ICellRendererParams} from 'ag-grid-community'
import {PlayListID, selectPlayListByQuery, Issues} from 'iso'
import {useAdminSelector} from '../../app/buildAdminStore'


const SportRenderer = (props: ICellRendererParams) => {
    return (
        <i
            className="far fa-trash-alt"
            style={{ cursor: 'pointer' }}
            onClick={() => props.api.applyTransaction({ remove: [props.node.data] })}
        ></i>
    );
};


export type EditPlayListModalProps = {
    playListId: PlayListID
    onClose: Function
}
export const EditPlayListModal = ({playListId, onClose}:EditPlayListModalProps) => {
    const playListTracks = useAdminSelector(selectPlayListByQuery(playListId))
    const playListTrackIds = playListTracks.map(t => t.id)
    const allTracks = useAdminSelector(Issues.selectors.selectAll)

    return (

    )
};

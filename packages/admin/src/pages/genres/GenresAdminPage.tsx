import { useDispatch } from "react-redux";
import { GENRES, getGenrePlayListId, PLAY_LISTS, Issues } from "iso";
import { CellEditingStoppedEvent } from "ag-grid-community";
import PanelRGrid from "../../generic-ui/grid/PanelRGrid";
import { generateGuid, randomInt, shuffle } from "@shammasov/utils";
import { useState } from "react";
import TransferModal from "../../elements/TransferModal";
import { useAdminSelector } from "../../app/buildAdminStore";
import { useSlice } from "@shammasov/react/src/hooks/useSlice";
import { Button } from "antd";

export default () => {
  const dispatch = useDispatch();
  const genresList = useAdminSelector(GENRES.selectors.selectAll);
  const tracks = useAdminSelector(Issues.selectors.selectAll);

  const playListsMap = useSlice(Issues);
  console.log("LIST", genresList);

  const cellEditingStopped = (e: CellEditingStoppedEvent) => {
    console.log(e);
  };

  const onGenreCreateClick = (e) => {
    const genreName = window.prompt("Enter genre name");
    if (genreName && genreName.length) {
      dispatch(
        GENRES.actions.added({ id: generateGuid(), genreName, subGenres: "" })
      );
    }
  };

  const onRandomizeGenresClick = (e) => {
    const getRandomGenreProps = () => {
      const genreItem =
        genresList[Math.floor(Math.random() * genresList.length)];
      const subGenresLength = randomInt(
        Math.min(genreItem.subGenres.length, 3)
      );
      const shuffledSubGenres = shuffle(genreItem.subGenres);
      const subGenres = shuffledSubGenres.slice(0, subGenresLength);
      return { genre: genreItem.id, subGenres };
    };
    const actions = tracks.map((t) =>
      Issues.actions.updated({
        id: t.id,
        changes: { ...getRandomGenreProps() },
      })
    );

    actions.map(dispatch);
  };

  const [selectedPlayListId, setSelectedPlayListId] = useState(
    undefined as any as string
  );
  const onGenreSelect = (genre) => {
    const playListId = genre ? getGenrePlayListId(genre) : undefined;
    if (!playListsMap[playListId]) {
      dispatch(PLAY_LISTS.actions.added({ id: playListId, trackIds: [] }));
    }
    setSelectedPlayListId(playListId);
  };
  return (
    <>
      <PanelRGrid
        onEdit={onGenreSelect} /*patchColumns={(defaultColumns, columnsMap) => {
                defaultColumns.splice(5,0,)
        }}*/
        bottomBar={
          <Button onClick={onRandomizeGenresClick}>
            Распределить жанры случайно
          </Button>
        }
        onCellEditingStopped={cellEditingStopped}
        title={"Все жанры"}
        onCreateClick={onGenreCreateClick}
        resource={GENRES}
        rowData={genresList}
      ></PanelRGrid>
      {selectedPlayListId && (
        <TransferModal
          key={selectedPlayListId}
          playListId={selectedPlayListId}
          key={String(selectedPlayListId)}
        />
      )}
    </>
  );
};

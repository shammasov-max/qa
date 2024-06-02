import { useDispatch } from "react-redux";
import { ARTISTS, ArtistVO, Issues } from "iso";
import { CellEditingStoppedEvent } from "ag-grid-community";
import PanelRGrid from "../../generic-ui/grid/PanelRGrid";
import {
  AutoComplete,
  AutoCompleteProps,
  Form,
  Input,
  Modal,
  SelectProps,
  Upload,
} from "antd";
import React, { useState } from "react";
import ArtistsSongsModal from "./ArtistsSongsModal";
import { UploadOutlined } from "@ant-design/icons";
import { path, prop } from "ramda";
import { useAdminSelector } from "../../app/buildAdminStore";

export default () => {
  const dispatch = useDispatch();
  const list = useAdminSelector(ARTISTS.selectors.selectAll);

  const cellEditingStopped = (e: CellEditingStoppedEvent) => {
    console.log(e);
  };

  const onGenreCreateClick = async (e) => {};
  const [open, setOpen] = useState(false);

  const onCreate = (values: Partial<ArtistVO>) => {
    console.log("Received values of form: ", values);
    dispatch(ARTISTS.actions.added({ ...values }));
    setOpen(false);
  };

  const [id, setId] = useState(undefined as any as string | undefined);
  const artist = useAdminSelector(ARTISTS.selectors.selectById(id));
  const onArtistSelected = (artistId) => {
    setId(artistId);
  };
  const onArtistClose = () => {
    setId(undefined);
  };
  return (
    <>
      <PanelRGrid
        onCreateClick={() => setOpen(true)}
        onEdit={onArtistSelected}
        onCellEditingStopped={cellEditingStopped}
        title={"Все исполнители"}
        resource={ARTISTS}
        rowData={list}
      ></PanelRGrid>
      <ArtistCreateModal
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
      {id && artist && (
        <ArtistsSongsModal
          artistId={id}
          key={String(id)}
          onClose={onArtistClose}
        />
      )}
    </>
  );
};

type Values = Pick<ArtistVO, 'artistName'|'description'|'pictureURL'>
interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: Values) => void;
    onCancel: () => void;
}

const ArtistCreateModal: React.FC<CollectionCreateFormProps> = ({
                                                                       open,
                                                                       onCreate,
                                                                       onCancel,
                                                                   }) => {
    const [form] = Form.useForm();
    const allArtists = useAdminSelector(ARTISTS.selectors.selectAll)

const allArtistsNames = allArtists.map(a => a.artistName)
    return (
        <Modal
            destroyOnClose={true}
            open={open}
            title="Добавить исполнителя"
            okText="Добавить"
            cancelText="Отмена"
            onCancel={onCancel}

            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                preserve={false}
                form={form}
                layout="vertical"
                name="form_in_modal"
            >
                <Form.Item
                    name="artistName"
                    label="Исполнитель"
                    rules={[{ required: true, message: 'Введите название исполнителя' ,}, form => ({
                        validator(_, value) {
                            if (!value || !allArtistsNames.includes(value)) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Исполнитель с таким именем уже создан'));
                        },
                    }),]}
                >
                    <AddArtistAutocomplete/>
                </Form.Item>
                <Form.Item name="description" label="Описание">
                    <Input type="textarea" />
                </Form.Item>
                <Form.Item  name={'pictureURL'} label={'Изображение'} valuePropName={'file'} preserve={false}  getValueFromEvent={e => {
                        return path(['file','response','url'],e)

                }}>
                    <Upload  listType={'picture-card'} action={'/api/upload-image'}  maxCount={1} multiple={false} >
                        <UploadOutlined />
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};


const AddArtistAutocomplete = (props: AutoCompleteProps) => {
    const allArtists = useAdminSelector(ARTISTS.selectors.selectAll)
    const allArtistNames = allArtists.map(prop('artistName'))
    const allTracks = useAdminSelector(Issues.selectors.selectAll)
    const trackListsByArtistNameMap = Object.groupBy(allTracks,(track)=>track.artist)
    const allTrackDefinedArtists = Object.keys(trackListsByArtistNameMap).filter(n => !allArtistNames.includes(n))
    const searchResult = (query: string) => {
        const options = allTrackDefinedArtists.filter(a => {
            if(!query || query==='')
                return true
            return a.startsWith(query)
        })
            .map((trackDefinedArtist, idx) => {
                const category = trackDefinedArtist;
                return {
                    value: category,
                    label: (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
            <span>

                <b
                >
                 {query}
              </b>{category.slice(query.length)}
            </span>
                            <span>{(trackListsByArtistNameMap[category] || []).length} треков</span>
                        </div>
                    ),
                };
            });
        return options
    }
    const [options, setOptions] = useState<SelectProps<object>['options']>(searchResult(''));

    const handleSearch = (value: string) => {
        setOptions(value ? searchResult(value) : []);
    };
    return <AutoComplete

                          options={options}
                          onSearch={handleSearch}
                          size="large" {...props}>

    </AutoComplete>
}

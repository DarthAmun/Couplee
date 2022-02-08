import { useEffect, useState } from "react";
import { Button, Modal, Loader, IconButton, Input } from "rsuite";
import PlusIcon from "@rsuite/icons/Plus";
import styled from "styled-components";
import {
  reciveAll,
  remove,
  saveNew,
  update,
} from "../services/DatabaseService";
import PriceList from "../types/PriceList";
import FortuneWheel from "../components/FortuneWheel";

function Dashboard() {
  const [loading, isLaoding] = useState<boolean>(true);
  const [entities, setEntities] = useState<PriceList[]>([]);

  const [open, setOpen] = useState(false);
  const [entry, setEntry] = useState<PriceList>(new PriceList());

  const loadData = () => {
    console.log("Pull entries");
    reciveAll((results: any[]) => {
      setEntities(results);
      isLaoding(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpen = (entry: PriceList) => {
    console.log(entry);
    setEntry(entry);
    setOpen(true);
  };
  const handleNewOpen = () => {
    handleOpen(new PriceList(0));
  };
  const handleSave = () => {
    if (entry !== undefined) {
      isLaoding(true);
      update(entry);
      setOpen(false);
      loadData();
    }
  };
  const handleNewSave = () => {
    if (entry !== undefined) {
      isLaoding(true);
      saveNew(entry);
      setOpen(false);
      loadData();
    }
  };
  const handleDelete = () => {
    if (entry !== undefined) {
      isLaoding(true);
      remove(entry.id);
      setOpen(false);
      loadData();
    }
  };
  const handleClose = () => setOpen(false);

  const reloadWheel = () => {
    isLaoding(true);
    loadData();
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>
            Edit {entry?.id === 0 ? "new Entry" : "Entry " + entry?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {entry !== undefined && (
            <Input
              value={entry.name}
              placeholder="Default Input"
              onChange={(val) => setEntry({ ...entry, name: val })}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={entry?.id === 0 ? handleNewSave : handleSave}
            appearance="primary"
          >
            Save
          </Button>
          {entry?.id !== 0 && (
            <Button onClick={handleDelete} appearance="primary" color="red">
              Delete
            </Button>
          )}
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <ButtonWrapper>
        <IconButton
          onClick={(e) => handleNewOpen()}
          icon={<PlusIcon />}
          color="blue"
          appearance="primary"
          circle
          size="lg"
        />
      </ButtonWrapper>
      {loading && <Loader backdrop content="loading..." vertical />}
      {!loading && entities && (
        <PanelWrapper>
          {entities.map((list: PriceList) => (
            <FortuneWheel priceList={list} reloadWheel={reloadWheel} />
          ))}
        </PanelWrapper>
      )}
    </>
  );
}

export default Dashboard;

const PanelWrapper = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  & > div {
    flex: 1 1;
    /* aspect-ratio: 1; */
    min-width: min-content;
  }
`;

const ButtonWrapper = styled.div`
  position: fixed;
  bottom: 30px;
  left: 30px;
  z-index: 1000;
`;

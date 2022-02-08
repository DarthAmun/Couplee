import { useEffect, useState } from "react";
import {
  toaster,
  Uploader,
  Notification,
  Col,
  FlexboxGrid,
  Panel,
  IconButton,
} from "rsuite";
import { FaFileExport } from "react-icons/fa";
import { FileType } from "rsuite/esm/Uploader/Uploader";
import { reciveAll, updateListsWith } from "../services/DatabaseService";
import PriceList from "../types/PriceList";

function Settings() {
  const [jsonBackup, setJsonBackup] = useState<string>("");

  const [files, setFiles] = useState<FileType[]>([]);

  useEffect(() => {
    reciveAll((results: any[]) => {
      setJsonBackup(JSON.stringify(results));
    });
  }, []);

  const handleUpload = (file: FileType) => {
    if (file.blobFile) {
      let fileReader = new FileReader();
      fileReader.onloadend = function () {
        const content = fileReader.result;
        if (content !== null) {
          let priceJson: PriceList[] = JSON.parse(content.toString());
          updateListsWith(priceJson);
        }
      };
      fileReader.readAsText(file.blobFile);
    }
  };

  const handleSuccess = (response: object, file: FileType) => {
    toaster.push(
      <Notification closable header={"Success"} type="success">
        Success: Imported {file.name}.
      </Notification>,
      { placement: "bottomStart" }
    );
  };

  const exportAll = () => {
    let contentType = "application/json;charset=utf-8;";
    var a = document.createElement("a");
    a.download =
      "JsonBackup_" +
      new Date().getFullYear() +
      "." +
      (new Date().getMonth() + 1) + ".json";
    a.href = "data:" + contentType + "," + encodeURIComponent(jsonBackup);
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <FlexboxGrid justify="space-around">
      <FlexboxGrid.Item as={Col} colspan={24} md={12}>
        <Panel header="Import Json">
          <Uploader
            fileList={files}
            action={"//jsonplaceholder.typicode.com/posts/"}
            draggable
            multiple
            autoUpload
            onUpload={handleUpload}
            onSuccess={handleSuccess}
            onChange={setFiles}
            accept={".json"}
          >
            <div style={{ lineHeight: "100px" }}>
              Click or Drag files to this area to upload
            </div>
          </Uploader>
        </Panel>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item as={Col} colspan={24} md={12}>
        <Panel header="Export Json">
          <IconButton icon={<FaFileExport />} onClick={() => exportAll()} />
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}

export default Settings;

import { useEffect, useState } from "react";
import { Wheel } from "react-custom-roulette";
import { WheelData } from "react-custom-roulette/dist/components/Wheel/types";
import {
  Button,
  Divider,
  Input,
  Notification,
  Panel,
  PanelGroup,
  toaster,
} from "rsuite";
import { stringToColour } from "../services/ColorService";
import { remove, update } from "../services/DatabaseService";
import PriceList from "../types/PriceList";

interface $WheelProps {
  priceList: PriceList;
  reloadWheel: () => void;
}

const FortuneWheel = ({ priceList, reloadWheel }: $WheelProps) => {
  const [dataText, setDataText] = useState<string>("");
  const [shallSpin, isSpinning] = useState<boolean>(false);
  const [prizeNumber, setPrizeNumber] = useState<number>(0);
  const [backgroundColors, setBackgroundColors] = useState<string[]>([]);

  useEffect(() => {
    let text = "";
    let colors: string[] = [];
    priceList.prices.forEach((price) => {
      text += price.option + "\n";
      colors.push(stringToColour(price.option));
    });
    setDataText(text);
    setBackgroundColors(colors);
  }, [priceList]);

  const spin = () => {
    const winningNumber = Math.floor(Math.random() * priceList.prices.length);
    setPrizeNumber(winningNumber);
    isSpinning(true);
  };
  const resetWheel = () => {
    isSpinning(false);
    toaster.push(
      <Notification closable type="success">
        '{priceList.prices[prizeNumber].option}' won on {priceList.name}!
      </Notification>,
      { placement: "topCenter" }
    );
  };

  const changeData = () => {
    const newPriceList = { ...priceList };
    const textData: string[] = dataText.split("\n");
    let newDataList: WheelData[] = textData.map((elm: string) => {
      return {
        option: elm,
      };
    });
    update({ ...newPriceList, prices: newDataList });
    reloadWheel();
  };

  const deleteList = () => {
    remove(priceList.id);
    reloadWheel();
  };

  return (
    <PanelGroup accordion defaultActiveKey={1} bordered>
      <Panel header={priceList.name} eventKey={1} id="panel1">
        <Wheel
          mustStartSpinning={shallSpin}
          prizeNumber={prizeNumber}
          onStopSpinning={resetWheel}
          data={priceList.prices}
          backgroundColors={backgroundColors}
          textColors={["#ffffff"]}
        />
        <Button
          color="blue"
          appearance="primary"
          onClick={(e) => spin()}
          size="lg"
        >
          Spin
        </Button>
        <Divider vertical />
        {!shallSpin && (
          <>
            '{priceList.prices[prizeNumber].option}' won on {priceList.name}!
          </>
        )}
      </Panel>
      <Panel header="Edit" eventKey={2} id="panel2">
        <Input
          as="textarea"
          rows={3}
          placeholder="Textarea"
          value={dataText}
          onChange={setDataText}
        />
        <Button
          color="blue"
          appearance="primary"
          onClick={(e) => changeData()}
          size="lg"
        >
          Save
        </Button>
        <Button
          color="red"
          appearance="primary"
          onClick={(e) => deleteList()}
          size="lg"
        >
          Delete
        </Button>
      </Panel>
    </PanelGroup>
  );
};

export default FortuneWheel;

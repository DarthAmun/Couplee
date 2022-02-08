import { WheelData } from "react-custom-roulette/dist/components/Wheel/types";

export default class PriceList {
  id?: number;
  name: string;
  prices: WheelData[];

  constructor(id?: number, name?: string, prices?: WheelData[]) {
    this.id = id;
    this.name = name || "New List";
    this.prices = prices || [];
  }
}

export function isPriceList(arg: any): boolean {
  const nameCheck =
    arg !== undefined &&
    typeof arg.name == "string" &&
    arg.name.trim().length > 0;
  const pricesCheck =
    arg !== undefined &&
    arg.prices.trim().length > 0 &&
    arg.prices.split(".").length === 3;

  return arg && nameCheck && pricesCheck;
}

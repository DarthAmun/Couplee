import Dexie from "dexie";
import PriceList from "../types/PriceList";

export class CoupleeDB extends Dexie {
  entries: Dexie.Table<PriceList, number>; // number = type of the primkey

  constructor() {
    super("CoupleeDB");
    this.version(1).stores({
      entries: "++id, name, prices",
    });

    this.entries = this.table("entries");
  }
}

import { IndexableType } from "dexie";
import { WheelData } from "react-custom-roulette/dist/components/Wheel/types";
import { CoupleeDB } from "../database/CoupleeDB";
import PriceList from "../types/PriceList";

export const saveNewFromList = (tableName: string, entities: PriceList[]) => {
  const db = new CoupleeDB();
  db.open()
    .then(async function () {
      const refinedEntities = (entities as PriceList[]).map(
        (entity: PriceList) => {
          delete entity["id"];
          return entity;
        }
      );
      const prom = await db.table(tableName).bulkPut(refinedEntities);
      return prom;
    })
    .finally(function () {
      db.close();
    });
};

export const reciveAll = (callback: (data: IndexableType[]) => void) => {
  const db = new CoupleeDB();
  db.open()
    .then(function () {
      db.table("entries")
        .toArray()
        .then((array) => {
          callback(array);
        });
    })
    .finally(function () {
      db.close();
    });
};

export const reciveByAttribute = (
  name: string,
  value: string,
  callback: (data: IndexableType) => void
) => {
  const db = new CoupleeDB();
  db.open()
    .then(function () {
      db.table("entries")
        .where(name)
        .equalsIgnoreCase(value)
        .toArray()
        .then((array) => {
          callback(array[0]);
        });
    })
    .finally(function () {
      db.close();
    });
};

export const update = (data: PriceList) => {
  const db = new CoupleeDB();
  db.open()
    .then(function () {
      db.table("entries").update(data.id, data);
    })
    .finally(function () {
      db.close();
    });
};

export const saveNew = (entity: PriceList) => {
  const db = new CoupleeDB();
  return db
    .open()
    .then(async function () {
      delete entity["id"];
      const prom = await db.table("entries").put(entity);
      return prom;
    })
    .finally(function () {
      db.close();
    });
};

export const remove = (id: number | undefined) => {
  const db = new CoupleeDB();
  if (id !== undefined) {
    db.open()
      .then(function () {
        db.table("entries").delete(id);
      })
      .finally(function () {
        db.close();
      });
  }
};

const merge = (original: PriceList, newPriceList: PriceList): PriceList => {
  console.log(original, newPriceList);
  const mergedList: PriceList = { ...original };
  let newWheelData: WheelData[] = mergedList.prices;
  newPriceList.prices.forEach((newPrice: WheelData) => {
    let doesContain: boolean = false;
    original.prices.forEach((oldPrice: WheelData) => {
      if (newPrice.option === oldPrice.option) doesContain = true;
    });
    if (!doesContain) {
      newWheelData.push(newPrice);
    }
  });
  console.log({ ...mergedList, prices: newWheelData });
  return { ...mergedList, prices: newWheelData };
};

export const updateListsWith = (priceJson: PriceList[]) => {
  priceJson.forEach((price: PriceList) => {
    reciveByAttribute("name", price.name, (data: unknown) => {
      if (data !== undefined) {
        update(merge(data as PriceList, price));
      } else {
        saveNew(price);
      }
    });
  });
};

import { CellState, SeaMap, SeaTable } from "./map";
import { IDefaultShipConstructor, Ship } from "./Ship";

type MapForCellState = {
  [prop: string]: CellState;
};

type ShipHash = {
  [prop: string]: Ship;
};

const mapForValues: MapForCellState = {
  "-1": "notAllowed",
  "0": "empty",
};

describe("isPositionFit", () => {
  const pointedtable = [
    [-1, -1, -1, -1, 0, 0, 0, 0, 0, 0],
    [-1, 1, -1, -1, 0, 0, 0, 0, 0, 0],
    [-1, -1, -1, -1, 0, 0, 0, 0, 0, 0],
    [-1, 2, 2, -1, 0, 0, 0, 0, 0, 0],
    [-1, -1, -1, -1, 0, 0, 0, 0, 0, 0],
    [3, 3, 3, -1, 0, 0, 0, 0, 0, 0],
    [-1, -1, -1, -1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const testShips: ShipHash = {
    "2": new Ship({
      startPoint: { y: 3, x: 1 },
      direction: "horizontal",
      size: 2,
    }),
    "3": new Ship({
      startPoint: { y: 5, x: 0 },
      direction: "horizontal",
      size: 3,
    }),
  };

  const testSeaTable: SeaTable = prepareTable(pointedtable, testShips);

  const seaMap = new SeaMap({ table: testSeaTable });

  const shipsWithFitPos: IDefaultShipConstructor[] = [
    {
      direction: "horizontal",
      size: 4,
      startPoint: {
        x: 1,
        y: 8,
      },
    },
    {
      direction: "horizontal",
      size: 4,
      startPoint: {
        x: 5,
        y: 3,
      },
    },
    {
      direction: "vertical",
      size: 4,
      startPoint: {
        x: 5,
        y: 1,
      },
    },
    {
      direction: "vertical",
      size: 4,
      startPoint: {
        x: 8,
        y: 1,
      },
    },
  ];

  const shipsWithNotFitPos: IDefaultShipConstructor[] = [
    {
      direction: "horizontal",
      size: 4,
      startPoint: {
        x: 3,
        y: 4,
      },
    },
    {
      direction: "horizontal",
      size: 4,
      startPoint: {
        x: 2,
        y: 6,
      },
    },
    {
      direction: "vertical",
      size: 4,
      startPoint: {
        x: 1,
        y: 1,
      },
    },
    {
      direction: "vertical",
      size: 4,
      startPoint: {
        x: 1,
        y: 4,
      },
    },
  ];

  test("should be true on correct positions", () => {
    shipsWithFitPos.forEach((shipWithFitPos) => {
      expect(seaMap.isPositionFit(new Ship(shipWithFitPos))).toBe(true);
    });
  });

  test("should be false on uncorrect positions", () => {
    shipsWithNotFitPos.forEach((shipWithNotFitPos) => {
      expect(seaMap.isPositionFit(new Ship(shipWithNotFitPos))).toBe(false);
    });
  });
});

function prepareTable(table: number[][], shipHash: ShipHash): SeaTable {
  const seaTable = table.map((row) =>
    row.map((cellValue) => {
      return {
        state: cellValue > 0 ? "empty" : mapForValues[cellValue],
        ship: shipHash[cellValue],
      };
    })
  );

  return seaTable;
}

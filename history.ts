type AssetHistory = AssetHistoryObject[];
type AssetHistoryObject = {
  start: Date | null;
  end: Date;
  assets: AssetObject;
  cash: Cash;
};

type AssetObject = {
  [coinName: string]: AssetOwnership;
};
type AssetOwnership = {
  quantity: number;
  avgCost: number;
};

type Asset = {
  id: number;
  userId: number;
  ticker: string;
  quantity: number;
  averageCost: number;
};

type Cash = number;

type Trade = {
  id: number;
  userId: number;
  ticker: string;
  type: boolean;
  quantity: number;
  price: number;
  timestamp: Date;
};

/**
 * Generate Intervals with cash and asset info
 * @param assets current assets
 * @param trades trade history
 * @returns
 */
const generateIntervals = (assets: Asset[], trades: Trade[], cash: Cash) => {
  // Get current portfolio
  let assetHistory: AssetHistory = [];
  let currentDate = new Date();
  let assetObject: AssetObject = {};
  for (let asset of assets) {
    let assetOwnership: AssetOwnership = {
      quantity: asset.quantity,
      avgCost: asset.averageCost,
    };
    assetObject[asset.ticker] = assetOwnership;
  }

  while (trades.length > 0) {
    let trade: Trade = trades.pop() as Trade;
    let assetHistoryObject: AssetHistoryObject = {
      start: trade.timestamp,
      end: currentDate,
      assets: JSON.parse(JSON.stringify(assetObject)),
      cash: cash,
    };
    currentDate = trade.timestamp;
    assetHistory.unshift(assetHistoryObject);
    // Purchase
    if (trade.type) {
      // Manipulate Coin Data
      let oldQuantity = assetObject[trade.ticker].quantity - trade.quantity;
      let oldAverageCost =
        (assetObject[trade.ticker].avgCost *
          assetObject[trade.ticker].quantity -
          trade.quantity * trade.price) /
        oldQuantity;
      assetObject[trade.ticker].quantity = oldQuantity;
      assetObject[trade.ticker].avgCost = oldAverageCost;
      // Manipulate Cash Data
      cash += trade.quantity * trade.price;
    } // Sale
    else {
      // Manipulate Coin Data
      assetObject[trade.ticker].quantity =
        assetObject[trade.ticker].quantity + trade.quantity;
      // Manipulate Cash Data
      cash -= trade.quantity * trade.price;
    }
  }

  let assetHistoryObject: AssetHistoryObject = {
    start: null,
    end: currentDate,
    assets: JSON.parse(JSON.stringify(assetObject)),
    cash: cash,
  };
  assetHistory.unshift(assetHistoryObject);

  return assetHistory;
};
/*
  [
    {
      start: null,
      end: "2022-10-05T06:06:33.984Z",
      assets: { bitcoin: { quantity: 0, avgCost: null } },
      cash: 100000,
    },
    {
      start: "2022-10-05T06:06:33.984Z",
      end: "2022-10-05T06:06:52.754Z",
      assets: { bitcoin: { quantity: 1, avgCost: 21020.259999999995 } },
      cash: 78979.7,
    },
    {
      start: "2022-10-05T06:06:52.754Z",
      end: "2022-10-05T06:07:12.125Z",
      assets: { bitcoin: { quantity: 3, avgCost: 19673.42 } },
      cash: 40979.7,
    },
    {
      start: "2022-10-05T06:07:12.125Z",
      end: "2022-10-05T07:06:18.658Z",
      assets: { bitcoin: { quantity: 2, avgCost: 19673.42 } },
      cash: 65979.7,
    },
    {
      start: "2022-10-05T07:06:18.658Z",
      end: null,
      assets: { bitcoin: { quantity: 3, avgCost: 19869.88 } },
      cash: 45716.9,
    },
  ]
*/

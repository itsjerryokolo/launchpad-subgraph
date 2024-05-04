import {
  Buy as BuyEvent,
  PoolLaunched as PoolLaunchedEvent,
  Sell as SellEvent,
  Gauge as GaugeContract,
} from "../generated/templates/Gauge/Gauge";
import { ChainlinkAggregator } from "../generated/templates/Gauge/ChainlinkAggregator";
import {
  Trade,
  PoolLaunched,
  Token,
  Gauge,
  PriceData,
  AddressStore,
} from "../generated/schema";
import {
  BigInt,
  BigDecimal,
  Bytes,
  ethereum,
  Address,
} from "@graphprotocol/graph-ts";

export function handleBuy(event: BuyEvent): void {
  let buy = new Trade(event.transaction.hash.concatI32(event.logIndex.toI32()));
  let ETHER_ONE = BigInt.fromI32(10).pow(18);
  buy.type = "buy";
  buy.gauge = event.address.toHex();
  buy.recipient = event.params.recipient;
  buy.tokenAmount = event.params.amount;
  buy.ethAmount = event.params.cost;
  buy.blockNumber = event.block.number;
  buy.blockTimestamp = event.block.timestamp;
  buy.transactionHash = event.transaction.hash;
  buy.priceOpening = event.params.startingPrice;
  buy.priceAvg = event.params.cost.times(ETHER_ONE).div(event.params.amount);

  // Fetch the associated Gauge entity to get the Token reference
  let gauge = Gauge.load(buy.gauge);
  if (gauge && gauge.token) {
    buy.token = gauge.token;
  } else {
  }

  // Get prices
  let tempPriceOpening = event.params.startingPrice;
  let tempPriceAvg = event.params.cost
    .times(ETHER_ONE)
    .div(event.params.amount);
  let tempPriceClosing = getCurrentPriceFromGauge(event.address);
  buy.ethPrice = getEthPrice();

  // Convert prices to USD
  let tempPriceOpeningUSD = tempPriceOpening.times(buy.ethPrice);
  let tempPriceAvgUSD = tempPriceAvg.times(buy.ethPrice);
  let tempPriceClosingUSD = tempPriceClosing.times(buy.ethPrice);

  // Store prices
  buy.priceOpening = tempPriceOpeningUSD;
  buy.priceAvg = tempPriceAvgUSD;
  buy.priceClosing = tempPriceClosingUSD;

  // Store USD value
  buy.usdValue = event.params.cost.times(buy.ethPrice);

  buy.save();

  // Fetch the token entity
  let token = Token.load(buy.token);
  if (token) {
    token.lastPrice = tempPriceClosing;
    token.tokenPurchased = token.tokenPurchased.plus(buy.tokenAmount);
    token.volume = token.volume.plus(buy.usdValue);
    token.save();
  }

  // Update price data
  updateOHLC(
    buy.token,
    buy.blockTimestamp,
    tempPriceOpeningUSD,
    tempPriceClosingUSD,
    buy.usdValue
  );
}

export function handlePoolLaunched(event: PoolLaunchedEvent): void {
  let entity = new PoolLaunched(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.token = event.params.token.toHex();
  entity.pool = event.params.pool;
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Load the Gauge entity associated with this event
  let gaugeId = event.address.toHex();
  let gauge = Gauge.load(gaugeId);
  if (gauge) {
    // Set isCompleted to true because the pool has been launched
    gauge.isCompleted = true;
    gauge.save();
  } else {
    // Optionally handle the case where the Gauge is not found
    // This might involve logging an error or taking other corrective actions
  }

  // Load the token entity associated with this event
  let token = Token.load(entity.token);
  if (token) {
    // Set token.pool to event.params.pool
    token.pool = event.params.pool;
    token.tokenPurchased = token.tokenTarget;
    token.save();
  }
}

export function handleSell(event: SellEvent): void {
  let sell = new Trade(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  let ETHER_ONE = BigInt.fromI32(10).pow(18);

  // Store basic
  sell.type = "sell";
  sell.gauge = event.address.toHex();
  sell.recipient = event.params.recipient;
  sell.tokenAmount = event.params.amount;
  sell.ethAmount = event.params.proceeds;
  sell.blockNumber = event.block.number;
  sell.blockTimestamp = event.block.timestamp;
  sell.transactionHash = event.transaction.hash;

  // Fetch the associated Gauge entity to get the Token reference
  let gauge = Gauge.load(sell.gauge);
  if (gauge && gauge.token) {
    sell.token = gauge.token;
  }

  // Get prices
  let tempPriceOpening = event.params.startingPrice;
  let tempPriceAvg = event.params.proceeds
    .times(ETHER_ONE)
    .div(event.params.amount);
  let tempPriceClosing = getCurrentPriceFromGauge(event.address);
  sell.ethPrice = getEthPrice();

  // Convert prices to USD
  let tempPriceOpeningUSD = tempPriceOpening.times(sell.ethPrice);
  let tempPriceAvgUSD = tempPriceAvg.times(sell.ethPrice);
  let tempPriceClosingUSD = tempPriceClosing.times(sell.ethPrice);

  // Store prices
  sell.priceOpening = tempPriceOpeningUSD;
  sell.priceAvg = tempPriceAvgUSD;
  sell.priceClosing = tempPriceClosingUSD;

  // Store USD value
  sell.usdValue = event.params.proceeds.times(sell.ethPrice);

  sell.save();

  // Fetch the token entity
  let token = Token.load(sell.token);
  if (token) {
    token.lastPrice = tempPriceClosing;
    token.tokenPurchased = token.tokenPurchased.minus(sell.tokenAmount);
    token.volume = token.volume.plus(sell.usdValue);
    token.save();
  }

  // Update price data
  updateOHLC(
    sell.token,
    sell.blockTimestamp,
    tempPriceOpeningUSD,
    tempPriceClosingUSD,
    sell.usdValue
  );
}

function updateOHLC(
  token: string,
  blockTimestamp: BigInt,
  priceOpening: BigInt,
  priceClosing: BigInt,
  usdValue: BigInt
): void {
  let periodStart = (blockTimestamp.toI32() / 60) * 60; // Floors to the nearest minute
  let periodEnd = periodStart + 60; // One minute later

  // Create a unique ID based on the token address and the period start time
  let ohlcId = token + "-" + periodStart.toString();

  let lowestPrice = priceOpening > priceClosing ? priceClosing : priceOpening;
  let highestPrice = priceOpening > priceClosing ? priceOpening : priceClosing;

  let ohlc = PriceData.load(ohlcId);
  if (ohlc == null) {
    ohlc = new PriceData(ohlcId);
    ohlc.token = token;
    ohlc.su = BigInt.fromI32(periodStart);
    ohlc.eu = BigInt.fromI32(periodEnd);
    ohlc.o = priceOpening;
    ohlc.h = highestPrice;
    ohlc.l = lowestPrice;
    ohlc.c = priceClosing;
    ohlc.v = usdValue;
  } else {
    ohlc.h = highestPrice.gt(ohlc.h) ? highestPrice : ohlc.h;
    ohlc.l = lowestPrice.lt(ohlc.l) ? lowestPrice : ohlc.l;
    ohlc.c = priceClosing;
    ohlc.v = ohlc.v.plus(usdValue);
  }

  ohlc.save();
}

function getCurrentPriceFromGauge(gaugeAddress: Address): BigInt {
  let gaugeContract = GaugeContract.bind(gaugeAddress);
  let price = gaugeContract.try_getCurrentPrice();
  return price.reverted ? BigInt.fromI32(0) : price.value;
}

function getEthPrice(): BigInt {
  let CHAINLINK_ETH_FEED = "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70";
  let chainlinkAggregator = ChainlinkAggregator.bind(
    Address.fromString(CHAINLINK_ETH_FEED)
  );
  let price = chainlinkAggregator.try_latestAnswer();
  return price.reverted ? BigInt.fromI32(0) : price.value;
}

export function handleBlock(block: ethereum.Block): void {
  const LAUNCHPAD_ADDRESS = "0x98a310e92f241afa215869ca94cb5633eec89d23";
  let addressStore = AddressStore.load(LAUNCHPAD_ADDRESS);
  if (addressStore == null) {
    addressStore = new AddressStore(LAUNCHPAD_ADDRESS);
    addressStore.save();
  }

  let ethPrice = getEthPrice();
  let tokens = addressStore.tokens.load();
  if (tokens) {
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];
      // Don't update price if the pool has been launched
      if (token && !token.pool) {
        let price = token.lastPrice;
        let priceUSD = price.times(ethPrice);
        updateOHLC(
          token.id,
          block.timestamp,
          priceUSD,
          priceUSD,
          BigInt.fromI32(0)
        );
      }
    }
  }
}

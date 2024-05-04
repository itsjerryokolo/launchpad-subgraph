import {
  BondingCurveFractionSet as BondingCurveFractionSetEvent,
  CreationCostSet as CreationCostSetEvent,
  CurveSet as CurveSetEvent,
  GaugeFeesSet as GaugeFeesSetEvent,
  GaugeImplementationSet as GaugeImplementationSetEvent,
  LpReceiverSet as LpReceiverSetEvent,
  NewToken as NewTokenEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  BoosterFractionSet as BoosterFractionSetEvent,
  TokenImplementationSet as TokenImplementationSetEvent,
  TreasurySet as TreasurySetEvent,
  Launchpad as LaunchpadContract,
  Launchpad__getTokenInfoResultValue0Struct as TokenInfoStruct,
} from "../generated/Launchpad/Launchpad";
import {
  BondingCurveFractionSet,
  CreationCostSet,
  CurveSet,
  GaugeFeesSet,
  GaugeImplementationSet,
  LpReceiverSet,
  NewToken,
  OwnershipTransferred,
  BoosterFractionSet,
  TokenImplementationSet,
  TreasurySet,
  Token,
  Gauge,
  AddressStore,
} from "../generated/schema";
import {
  Gauge as GaugeTemplate,
  LaunchpadToken as LaunchpadTokenTemplate,
} from "../generated/templates";
import { BigInt, Address } from "@graphprotocol/graph-ts";

export function handleBondingCurveFractionSet(
  event: BondingCurveFractionSetEvent
): void {
  let entity = new BondingCurveFractionSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newFraction = event.params.newFraction;
  entity.oldFraction = event.params.oldFraction;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleCreationCostSet(event: CreationCostSetEvent): void {
  let entity = new CreationCostSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newAmount = event.params.newAmount;
  entity.oldAmount = event.params.oldAmount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleCurveSet(event: CurveSetEvent): void {
  let entity = new CurveSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newCurve = event.params.newCurve;
  entity.oldCurve = event.params.oldCurve;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleGaugeFeesSet(event: GaugeFeesSetEvent): void {
  let entity = new GaugeFeesSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newBuyFee = event.params.newBuyFee;
  entity.oldBuyFee = event.params.oldBuyFee;
  entity.newSellFee = event.params.newSellFee;
  entity.oldSellFee = event.params.oldSellFee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleGaugeImplementationSet(
  event: GaugeImplementationSetEvent
): void {
  let entity = new GaugeImplementationSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newImpl = event.params.newImpl;
  entity.oldImpl = event.params.oldImpl;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleLpReceiverSet(event: LpReceiverSetEvent): void {
  let entity = new LpReceiverSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newReceiver = event.params.newReceiver;
  entity.oldReceiver = event.params.oldReceiver;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleNewToken(event: NewTokenEvent): void {
  // Create new AddressStore entity if it does not exist
  let addressStore = AddressStore.load(event.address.toHex());
  if (addressStore == null) {
    addressStore = new AddressStore(event.address.toHex());
    addressStore.save();
  }

  // Create NewToken entity
  let entity = new NewToken(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.creator = event.params.creator;
  entity.token = event.params.token;
  entity.gauge = event.params.gauge;
  entity.curve = event.params.curve;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  // Create Token entity
  let token = new Token(event.params.token.toHex());

  // Bind to Launchpad
  let launchpad = LaunchpadContract.bind(event.address);
  let tokenInfo = launchpad.try_getTokenInfo(event.params.token);

  if (tokenInfo.reverted) {
    token.symbol = "";
    token.name = "";
    token.ipfsHash = "";
    token.website = "";
    token.twitter = "";
    token.telegram = "";
    token.description = "";
    token.metadata = "";
    token.lastPrice = new BigInt(0);
    token.totalSupply = new BigInt(0);
    token.tokenPurchased = new BigInt(0);
    token.tokenTarget = new BigInt(0);
    token.volume = new BigInt(0);
  } else {
    token.name = tokenInfo.value.name;
    token.symbol = tokenInfo.value.symbol;
    token.ipfsHash = tokenInfo.value.metadata.ipfsHash;
    token.website = tokenInfo.value.metadata.website;
    token.twitter = tokenInfo.value.metadata.twitter;
    token.telegram = tokenInfo.value.metadata.telegram;
    token.description = tokenInfo.value.metadata.description;
    token.metadata = tokenInfo.value.metadata.metadata;
    token.lastPrice = tokenInfo.value.currentPrice;
    token.totalSupply = tokenInfo.value.totalSupply;
    token.tokenPurchased = new BigInt(0);
    token.tokenTarget = tokenInfo.value.tokenTarget;
    token.volume = new BigInt(0);
  }

  token.creationTimestamp = event.block.timestamp;
  token.creator = event.params.creator;
  token.factory = event.address.toHex();
  token.save();

  // Create Gauge entity
  let gauge = new Gauge(event.params.gauge.toHex());
  gauge.token = token.id; // Link back to the Token entity
  gauge.isCompleted = false; // Initialized as not completed
  gauge.save();

  // Create dynamic data sources
  LaunchpadTokenTemplate.create(event.params.token);
  GaugeTemplate.create(event.params.gauge);
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleBoosterFractionSet(event: BoosterFractionSetEvent): void {
  let entity = new BoosterFractionSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newFraction = event.params.newFraction;
  entity.oldFraction = event.params.oldFraction;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTokenImplementationSet(
  event: TokenImplementationSetEvent
): void {
  let entity = new TokenImplementationSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newImpl = event.params.newImpl;
  entity.oldImpl = event.params.oldImpl;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTreasurySet(event: TreasurySetEvent): void {
  let entity = new TreasurySet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.newTreasury = event.params.newTreasury;
  entity.oldTreasury = event.params.oldTreasury;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

import { newMockEvent } from "matchstick-as";
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts";
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
} from "../generated/Launchpad/Launchpad";

export function createBondingCurveFractionSetEvent(
  newFraction: BigInt,
  oldFraction: BigInt
): BondingCurveFractionSet {
  let bondingCurveFractionSetEvent = changetype<BondingCurveFractionSet>(
    newMockEvent()
  );

  bondingCurveFractionSetEvent.parameters = new Array();

  bondingCurveFractionSetEvent.parameters.push(
    new ethereum.EventParam(
      "newFraction",
      ethereum.Value.fromUnsignedBigInt(newFraction)
    )
  );
  bondingCurveFractionSetEvent.parameters.push(
    new ethereum.EventParam(
      "oldFraction",
      ethereum.Value.fromUnsignedBigInt(oldFraction)
    )
  );

  return bondingCurveFractionSetEvent;
}

export function createCreationCostSetEvent(
  newAmount: BigInt,
  oldAmount: BigInt
): CreationCostSet {
  let CreationCostSetEvent = changetype<CreationCostSet>(newMockEvent());

  CreationCostSetEvent.parameters = new Array();

  CreationCostSetEvent.parameters.push(
    new ethereum.EventParam(
      "newAmount",
      ethereum.Value.fromUnsignedBigInt(newAmount)
    )
  );
  CreationCostSetEvent.parameters.push(
    new ethereum.EventParam(
      "oldAmount",
      ethereum.Value.fromUnsignedBigInt(oldAmount)
    )
  );

  return CreationCostSetEvent;
}

export function createCurveSetEvent(
  newCurve: Address,
  oldCurve: Address
): CurveSet {
  let curveSetEvent = changetype<CurveSet>(newMockEvent());

  curveSetEvent.parameters = new Array();

  curveSetEvent.parameters.push(
    new ethereum.EventParam("newCurve", ethereum.Value.fromAddress(newCurve))
  );
  curveSetEvent.parameters.push(
    new ethereum.EventParam("oldCurve", ethereum.Value.fromAddress(oldCurve))
  );

  return curveSetEvent;
}

export function createGaugeFeesSetEvent(
  newBuyFee: BigInt,
  oldBuyFee: BigInt,
  newSellFee: BigInt,
  oldSellFee: BigInt
): GaugeFeesSet {
  let gaugeFeesSetEvent = changetype<GaugeFeesSet>(newMockEvent());

  gaugeFeesSetEvent.parameters = new Array();

  gaugeFeesSetEvent.parameters.push(
    new ethereum.EventParam(
      "newBuyFee",
      ethereum.Value.fromUnsignedBigInt(newBuyFee)
    )
  );
  gaugeFeesSetEvent.parameters.push(
    new ethereum.EventParam(
      "oldBuyFee",
      ethereum.Value.fromUnsignedBigInt(oldBuyFee)
    )
  );
  gaugeFeesSetEvent.parameters.push(
    new ethereum.EventParam(
      "newSellFee",
      ethereum.Value.fromUnsignedBigInt(newSellFee)
    )
  );
  gaugeFeesSetEvent.parameters.push(
    new ethereum.EventParam(
      "oldSellFee",
      ethereum.Value.fromUnsignedBigInt(oldSellFee)
    )
  );

  return gaugeFeesSetEvent;
}

export function createGaugeImplementationSetEvent(
  newImpl: Address,
  oldImpl: Address
): GaugeImplementationSet {
  let gaugeImplementationSetEvent = changetype<GaugeImplementationSet>(
    newMockEvent()
  );

  gaugeImplementationSetEvent.parameters = new Array();

  gaugeImplementationSetEvent.parameters.push(
    new ethereum.EventParam("newImpl", ethereum.Value.fromAddress(newImpl))
  );
  gaugeImplementationSetEvent.parameters.push(
    new ethereum.EventParam("oldImpl", ethereum.Value.fromAddress(oldImpl))
  );

  return gaugeImplementationSetEvent;
}

export function createLpReceiverSetEvent(
  newReceiver: Address,
  oldReceiver: Address
): LpReceiverSet {
  let lpReceiverSetEvent = changetype<LpReceiverSet>(newMockEvent());

  lpReceiverSetEvent.parameters = new Array();

  lpReceiverSetEvent.parameters.push(
    new ethereum.EventParam(
      "newReceiver",
      ethereum.Value.fromAddress(newReceiver)
    )
  );
  lpReceiverSetEvent.parameters.push(
    new ethereum.EventParam(
      "oldReceiver",
      ethereum.Value.fromAddress(oldReceiver)
    )
  );

  return lpReceiverSetEvent;
}

export function createNewTokenEvent(
  creator: Address,
  token: Address,
  gauge: Address,
  curve: Address
): NewToken {
  let newTokenEvent = changetype<NewToken>(newMockEvent());

  newTokenEvent.parameters = new Array();

  newTokenEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  );
  newTokenEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  );
  newTokenEvent.parameters.push(
    new ethereum.EventParam("gauge", ethereum.Value.fromAddress(gauge))
  );
  newTokenEvent.parameters.push(
    new ethereum.EventParam("curve", ethereum.Value.fromAddress(curve))
  );

  return newTokenEvent;
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  );

  ownershipTransferredEvent.parameters = new Array();

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  );
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  );

  return ownershipTransferredEvent;
}

export function createBoosterFractionSetEvent(
  newFraction: BigInt,
  oldFraction: BigInt
): BoosterFractionSet {
  let BoosterFractionSetEvent = changetype<BoosterFractionSet>(newMockEvent());

  BoosterFractionSetEvent.parameters = new Array();

  BoosterFractionSetEvent.parameters.push(
    new ethereum.EventParam(
      "newFraction",
      ethereum.Value.fromUnsignedBigInt(newFraction)
    )
  );
  BoosterFractionSetEvent.parameters.push(
    new ethereum.EventParam(
      "oldFraction",
      ethereum.Value.fromUnsignedBigInt(oldFraction)
    )
  );

  return BoosterFractionSetEvent;
}

export function createTokenImplementationSetEvent(
  newImpl: Address,
  oldImpl: Address
): TokenImplementationSet {
  let tokenImplementationSetEvent = changetype<TokenImplementationSet>(
    newMockEvent()
  );

  tokenImplementationSetEvent.parameters = new Array();

  tokenImplementationSetEvent.parameters.push(
    new ethereum.EventParam("newImpl", ethereum.Value.fromAddress(newImpl))
  );
  tokenImplementationSetEvent.parameters.push(
    new ethereum.EventParam("oldImpl", ethereum.Value.fromAddress(oldImpl))
  );

  return tokenImplementationSetEvent;
}

export function createTreasurySetEvent(
  newTreasury: Address,
  oldTreasury: Address
): TreasurySet {
  let treasurySetEvent = changetype<TreasurySet>(newMockEvent());

  treasurySetEvent.parameters = new Array();

  treasurySetEvent.parameters.push(
    new ethereum.EventParam(
      "newTreasury",
      ethereum.Value.fromAddress(newTreasury)
    )
  );
  treasurySetEvent.parameters.push(
    new ethereum.EventParam(
      "oldTreasury",
      ethereum.Value.fromAddress(oldTreasury)
    )
  );

  return treasurySetEvent;
}
